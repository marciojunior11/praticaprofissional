import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, CircularProgress, Collapse, Grid, Icon, IconButton, InputAdornment, LinearProgress, Paper, Typography } from "@mui/material";
import * as yup from 'yup';

import { DetailTools } from "../../shared/components";
import { LayoutBase } from "../../shared/layouts";
import { EstadosService, IEstados } from "../../shared/services/api/estados/EstadosService";
import { VTextField, VForm, useVForm, IVFormErrors, VAutocomplete } from "../../shared/forms"
import { toast } from "react-toastify";
import { PaisesService } from "../../shared/services/api/paises/PaisesService";
import { IPaises } from "../../shared/models/ModelPaises";
import { useDebounce } from "../../shared/hooks";

interface IFormData {
    estado: string;
    uf: string;
    pais: IPaises;
}

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
    estado: yup.string().required(),
    uf: yup.string().required().min(2),
    pais: yup.object().shape({
        id: yup.number().positive().integer().required(),
        pais: yup.string().required(),
        sigla: yup.string().required().min(2)
    }).required()
})

export const CadastroEstados: React.FC = () => {
    const { id = 'novo' } = useParams<'id'>();
    const navigate = useNavigate();

    const { formRef, save, saveAndNew, saveAndClose, isSaveAndNew, isSaveAndClose } = useVForm();
    const { debounce } = useDebounce();

    const [obj, setObj] = useState<IEstados | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isValidating, setIsValidating] = useState<any>(null);

    const [estado, setEstado] = useState<string>('');
    const [pais, setPais] = useState<IPaises | null>(null);
    const [isValid, setIsValid] = useState(false);
    const [alterando, setAlterando] = useState(false);

    useEffect(() => {
        if (id !== 'novo') {
            setIsLoading(true);

            EstadosService.getById(Number(id))
                .then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        toast.error(result.message);
                        navigate('/estados');
                    } else {
                        console.log('RESULT', result);
                        formRef.current?.setData(result);
                        setEstado(formRef.current?.getData().estado);
                        setPais(formRef.current?.getData().pais);
                        setObj(result);
                        setAlterando(true);
                    }
                });
        } else {
            formRef.current?.setData({
                estado: '',
                uf: '',
                pais: null
            });
        }
    }, [id]);

    useEffect(() => {
        if (obj) setIsValid(true)
        else setIsValid(false);
    }, [obj])

    useEffect(() => {
        if (estado && pais) {
            const formData = formRef.current?.getData();
            const data: IFormData = {
                estado: formData?.estado,
                uf: formData?.uf,
                pais: formData?.pais
            }
            validate(data);
        }
    }, [estado, pais])

    const validate = (dados: IFormData) => {
        const obj1 = {
            id: obj?.id,
            estado: obj?.estado,
            pais: obj?.pais
        }
        const obj2 = {
            id: Number(id),
            estado: dados.estado,
            pais: dados.pais
        }
        if (JSON.stringify(obj1) !== JSON.stringify(obj2)) {
            setIsValidating(true);
            debounce(() => {
                EstadosService.validate(dados)
                .then((result) => {
                    setIsValidating(false);
                    if (result instanceof Error) {
                        toast.error(result.message);
                    } else {
                        setIsValid(result);
                        if (result === false) {
                            const validationErrors: IVFormErrors = {};
                            validationErrors['estado'] = 'Já existe um estado vinculado a este país.';
                            formRef.current?.setErrors(validationErrors);
                        }
                    }
                })
            })
        } else {
            setIsValid(true);
        }
    }

    const handleSave = (dados: IFormData) => {
        validate(dados);
        formValidationSchema
            .validate(dados, { abortEarly: false })
                .then((dadosValidados) => {
                    if(isValid) {
                        setIsLoading(true);
                        if (id === 'novo') {
                            EstadosService.create(dadosValidados)
                                .then((result) => {
                                    setIsLoading(false);
                                    if (result instanceof Error) {
                                        toast.error(result.message)
                                    } else {
                                        toast.success('Cadastrado com sucesso!')
                                        if (isSaveAndClose()) {
                                            navigate('/estados');
                                        } else if (isSaveAndNew()) {
                                            setIsValidating(null);
                                            navigate('/estados/cadastro/novo');
                                            formRef.current?.setData({
                                                estado: '',
                                                uf: '',
                                                pais: null
                                            });
                                        } else {
                                            setIsValidating(null);
                                            navigate(`/estados/cadastro/${result}`);
                                        }
                                    }
                                });
                        } else {
                            EstadosService.updateById(Number(id), { id: Number(id), ...dadosValidados })
                                .then((result) => {
                                    setIsLoading(false);
                                    if (result instanceof Error) {
                                        toast.error(result.message);
                                    } else {
                                        toast.success('Alterado com sucesso!');
                                        if (isSaveAndClose()) {
                                            navigate('/estados')
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
                    if (!pais) {
                        validationErrors['pais'] = 'O campo é obrigatório';
                    }
                    
                    console.log(validationErrors);
                    formRef.current?.setErrors(validationErrors);
                })
    };

    const handleDelete = (id: number) => {

        if (window.confirm('Deseja apagar o registro?')) {
            EstadosService.deleteById(id)
                .then(result => {
                    if (result instanceof Error) {
                        toast.error(result.message);
                    } else {         
                        toast.success('Apagado com sucesso!')
                        navigate('/estados');
                    }
                })
        }
    }

    return (
        <LayoutBase 
            titulo={id === 'novo' ? 'Cadastrar Estado' : 'Editar Estado'}
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
                    onClickNovo={() => navigate('/estados/cadastro/novo') }
                    onClickVoltar={() => navigate('/estados') }
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
                                    name='estado' 
                                    label="Estado"
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
                                        formRef.current?.setFieldError('estado', '');
                                        setEstado(e.target.value.toUpperCase());
                                    }}
                                    onBlur={() => {
                                        if (pais) {
                                            const formData = formRef.current?.getData();
                                            const data = {
                                                estado: formData?.estado,
                                                uf: formData?.uf,
                                                pais: formData?.pais
                                            }
                                            validate(data);
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                <VTextField 
                                    required
                                    fullWidth
                                    name='uf' 
                                    label="UF"
                                    disabled={isLoading}
                                    inputProps={{ maxLength: 2 }}
                                    onBlur={() => {
                                        if (alterando) {
                                            const formData = formRef.current?.getData();
                                            const data = {
                                                estado: formData?.estado,
                                                uf: formData?.uf,
                                                pais: formData?.pais
                                            }
                                            validate(data);
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                <VAutocomplete
                                    required
                                    name="pais"
                                    label="pais"
                                    TFLabel="País"
                                    getAll={PaisesService.getAll}
                                    onInputchange={() => {
                                        setIsValid(false);
                                        setIsValidating('');
                                        formRef.current?.setFieldError('estado', '');
                                    }}
                                    onChange={(newValue) => {
                                        setPais(newValue);
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