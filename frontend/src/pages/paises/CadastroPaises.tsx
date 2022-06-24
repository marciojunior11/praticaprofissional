import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, CircularProgress, Collapse, Grid, Icon, IconButton, InputAdornment, LinearProgress, Paper, Typography } from "@mui/material";
import * as yup from 'yup';

import { DetailTools } from "../../shared/components";
import { LayoutBase } from "../../shared/layouts";
import { PaisesService } from "../../shared/services/api/paises/PaisesService";
import { VTextField, VForm, useVForm, IVFormErrors } from "../../shared/forms"
import { toast } from "react-toastify";

interface IFormData {
    pais: string;
    sigla: string;
}

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
    pais: yup.string().required(),
    sigla: yup.string().required().min(2)
})

export const CadastroPaises: React.FC = () => {
    const { id = 'novo' } = useParams<'id'>();
    const navigate = useNavigate();

    const { formRef, save, saveAndNew, saveAndClose, isSaveAndNew, isSaveAndClose } = useVForm();

    const [isLoading, setIsLoading] = useState(false);
    const [isValidating, setIsValidating] = useState<any>(null);

    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        if (id !== 'novo') {
            setIsLoading(true);

            PaisesService.getById(Number(id))
                .then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        toast.error(result.message);
                        navigate('/paises');
                    } else {
                        console.log('RESULT', result);
                        formRef.current?.setData(result);
                    }
                });
        } else {
            formRef.current?.setData({
                pais: '',
                sigla: ''
            });
        }
    }, [id]);

    const validate = (filter: string) => {
        setIsValidating(true);
        PaisesService.validate(filter)
            .then((result) => {
                setIsValidating(false);
                if (result instanceof Error) {
                    toast.error(result.message);
                } else {
                    setIsValid(result);
                    if (result === false) {
                        const validationErrors: IVFormErrors = {};
                        validationErrors['pais'] = 'Este país já está cadastrado.';
                        formRef.current?.setErrors(validationErrors);
                    }
                }
            })
    }

    const handleSave = (dados: IFormData) => {
        formValidationSchema
            .validate(dados, { abortEarly: false })
                .then((dadosValidados) => {
                    if(isValid) {
                        setIsLoading(true);
                        if (id === 'novo') {
                            PaisesService.create(dadosValidados)
                                .then((result) => {
                                    setIsLoading(false);
                                    if (result instanceof Error) {
                                        toast.error(result.message)
                                    } else {
                                        toast.success('Cadastrado com sucesso!')
                                        if (isSaveAndClose()) {
                                            navigate('/paises');
                                        } else if (isSaveAndNew()) {
                                            setIsValidating(null);
                                            navigate('/paises/cadastro/novo');
                                            formRef.current?.setData({
                                                pais: '',
                                                sigla: ''
                                            });
                                        } else {
                                            setIsValidating(null);
                                            navigate(`/paises/cadastro/${result}`);
                                        }
                                    }
                                });
                        } else {
                            PaisesService.updateById(Number(id), { id: Number(id), ...dadosValidados })
                                .then((result) => {
                                    setIsLoading(false);
                                    if (result instanceof Error) {
                                        toast.error(result.message);
                                    } else {
                                        toast.success('Alterado com sucesso!');
                                        if (isSaveAndClose()) {
                                            navigate('/paises')
                                        } else {
                                            setIsValidating(null);
                                        }
                                    }
                                });
                        }
                    } else {
                        toast.error('Verifique os campos');
                    }
                })
                .catch((errors: yup.ValidationError) => {
                    const validationErrors: IVFormErrors = {}

                    errors.inner.forEach(error => {
                        if ( !error.path ) return;
                        console.log('path', error.path);
                        console.log('message', error.message);
                        validationErrors[error.path] = error.message;
                    });
                    console.log(validationErrors);
                    formRef.current?.setErrors(validationErrors);
                })
    };

    const handleDelete = (id: number) => {

        if (window.confirm('Deseja apagar o registro?')) {
            PaisesService.deleteById(id)
                .then(result => {
                    if (result instanceof Error) {
                        toast.error(result.message);
                    } else {         
                        toast.success('Apagado com sucesso!')
                        navigate('/paises');
                    }
                })
        }
    }

    return (
        <LayoutBase 
            titulo={id === 'novo' ? 'Novo País' : 'Editar País'}
            barraDeFerramentas={
                <DetailTools
                    mostrarBotaoSalvarFechar
                    mostrarBotaoSalvarNovo={id == 'novo'}
                    mostrarBotaoApagar={id !== 'novo'}
                    mostrarBotaoNovo={id !== 'novo'}
                    
                    onClickSalvar={save}
                    onClickSalvarNovo={saveAndNew}
                    onClickSalvarFechar={saveAndClose}
                    onClickApagar={() => handleDelete(Number(id))}
                    onClickNovo={() => navigate('/paises/cadastro/novo') }
                    onClickVoltar={() => navigate('/paises') }
                />
            }
        >
            <VForm ref={formRef} onSubmit={handleSave}>
                <Box margin={1} display="flex" flexDirection="column" component={Paper} variant="outlined">
                    <Grid container direction="column" padding={2} spacing={2}>

                        {isLoading && (
                            <Grid item>
                                <LinearProgress variant="indeterminate"/>
                            </Grid>
                        )}

                        <Grid item>
                            <Typography variant="h6">Dados Gerais</Typography>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                <VTextField 
                                    fullWidth
                                    name='pais' 
                                    label="País"
                                    disabled={isLoading}                             
                                    InputProps={{
                                        endAdornment: (
                                                <InputAdornment position='start'>
                                                    { isValidating === true && (
                                                        <Box sx={{ display: 'flex',  }}>
                                                            <CircularProgress size={24}/>
                                                        </Box>
                                                    )}
                                                    { isValidating === false && (
                                                        <Box sx={{ display: 'flex' }}>
                                                            { isValid === true ? (
                                                                <Icon color="success">done</Icon>
                                                            ) : (
                                                                <Icon color="error">close</Icon>
                                                            )}
                                                        </Box>
                                                    )}
                                                </InputAdornment>
                                        )
                                    }}
                                    onChange={() => {
                                        setIsValid(false);
                                        setIsValidating('');
                                        formRef.current?.setFieldError('pais', '');
                                    }}
                                    onBlur={(e) => {
                                        if (e.target.value) {
                                            validate(e.target.value)
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                <VTextField 
                                    fullWidth
                                    name='sigla' 
                                    label="Sigla"
                                    disabled={isLoading}
                                    inputProps={{ maxLength: 2 }}
                                />
                            </Grid>
                        </Grid>

                    </Grid>

                </Box>
            </VForm>
        </LayoutBase>
    )

}