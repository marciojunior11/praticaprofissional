import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, CircularProgress, Collapse, Grid, Icon, IconButton, InputAdornment, LinearProgress, Paper, Typography } from "@mui/material";
import * as yup from 'yup';

import { DetailTools } from "../../shared/components";
import { LayoutBase } from "../../shared/layouts";
import { ITiposProduto, TiposProdutoService } from "../../shared/services/api/tiposProduto/TiposProdutoService";
import { VTextField, VForm, useVForm, IVFormErrors } from "../../shared/forms"
import { toast } from "react-toastify";

interface IFormData {
    descricao: string
}

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
    descricao: yup.string().required()
})

export const CadastroTiposProduto: React.FC = () => {
    const { id = 'novo' } = useParams<'id'>();
    const navigate = useNavigate();

    const { formRef, save, saveAndNew, saveAndClose, isSaveAndNew, isSaveAndClose } = useVForm();

    const [obj, setObj] = useState<ITiposProduto | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isValidating, setIsValidating] = useState<any>(null);

    const [isValid, setIsValid] = useState(false);

    const [alterando, setAlterando] = useState(false);

    useEffect(() => {
        if (id !== 'novo') {
            setIsLoading(true);

            TiposProdutoService.getById(Number(id))
                .then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        toast.error(result.message);
                        navigate('/tiposproduto');
                    } else {
                        console.log('RESULT', result);
                        formRef.current?.setData(result);
                        setObj(result);
                        setAlterando(true);
                    }
                });
        } else {
            formRef.current?.setData({
                descricao: ''
            });
        }
    }, [id]);

    useEffect(() => {
        if (obj) setIsValid(true)
        else setIsValid(false);
    }, [obj])

    const validate = (filter: string) => {
        if (filter != obj?.descricao) {
            setIsValidating(true);
            TiposProdutoService.validate(filter)
                .then((result) => {
                    setIsValidating(false);
                    if (result instanceof Error) {
                        toast.error(result.message);
                    } else {
                        setIsValid(result);
                        if (result === false) {
                            const validationErrors: IVFormErrors = {};
                            validationErrors['descricao'] = 'Este tipo de produto j?? est?? cadastrado';
                            formRef.current?.setErrors(validationErrors);
                        }
                    }
                })
        } else {
            setIsValid(true);
        }
    }

    const handleSave = (dados: IFormData) => {
        validate(dados.descricao);
        formValidationSchema
            .validate(dados, { abortEarly: false })
                .then((dadosValidados) => {
                    if(isValid) {
                        setIsLoading(true);
                        if (id === 'novo') {
                            TiposProdutoService.create(dadosValidados)
                                .then((result) => {
                                    setIsLoading(false);
                                    if (result instanceof Error) {
                                        toast.error(result.message)
                                    } else {
                                        toast.success('Cadastrado com sucesso!')
                                        if (isSaveAndClose()) {
                                            navigate('/tiposproduto');
                                        } else if (isSaveAndNew()) {
                                            setIsValidating('');
                                            setIsValid(false);
                                            navigate('/tiposproduto/cadastro/novo');
                                            formRef.current?.setData({
                                                descricao: ''
                                            });
                                        } else {
                                            setIsValidating(null);
                                            navigate(`/tiposproduto/cadastro/${result}`);
                                        }
                                    }
                                });
                        } else {
                            TiposProdutoService.updateById(Number(id), { id: Number(id), ...dadosValidados })
                                .then((result) => {
                                    setIsLoading(false);
                                    if (result instanceof Error) {
                                        toast.error(result.message);
                                    } else {
                                        toast.success('Alterado com sucesso!');
                                        if (isSaveAndClose()) {
                                            navigate('/tiposproduto')
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
            TiposProdutoService.deleteById(id)
                .then(result => {
                    if (result instanceof Error) {
                        toast.error(result.message);
                    } else {         
                        toast.success('Apagado com sucesso!')
                        navigate('/tiposProduto');
                    }
                })
        }
    }

    return (
        <LayoutBase 
            titulo={id === 'novo' ? 'Cadastrar Tipo de Produto' : 'Editar Tipo de Produto'}
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
                    onClickNovo={() => navigate('/tiposproduto/cadastro/novo') }
                    onClickVoltar={() => navigate('/tiposproduto') }
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
                                    required
                                    fullWidth
                                    name='descricao' 
                                    label="Descri????o"
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
                                    onChange={(e) => {
                                        setIsValid(false);
                                        setIsValidating('');
                                        formRef.current?.setFieldError('descricao', '');
                                    }}
                                    onBlur={(e) => {
                                        if (e.target.value) {
                                            validate(e.target.value)
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>

                    </Grid>

                </Box>
            </VForm>
        </LayoutBase>
    )

}