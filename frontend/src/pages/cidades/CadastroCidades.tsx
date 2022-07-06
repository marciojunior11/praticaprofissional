import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, CircularProgress, Collapse, Grid, Icon, IconButton, InputAdornment, LinearProgress, Paper, Typography } from "@mui/material";
import * as yup from 'yup';

import { DetailTools } from "../../shared/components";
import { LayoutBase } from "../../shared/layouts";
import { CidadesService, ICidades } from "../../shared/services/api/cidades/CidadesService";
import { VTextField, VForm, useVForm, IVFormErrors, VAutocomplete } from "../../shared/forms"
import { toast } from "react-toastify";
import { IEstados, EstadosService } from "../../shared/services/api/estados/EstadosService";
import { useDebounce } from "../../shared/hooks";

interface IFormData {
    cidade: string;
    estado: IEstados;
}

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
    cidade: yup.string().required(),
    estado: yup.object().shape({
        id: yup.number().positive().integer().required(),
        estado: yup.string().required(),
        uf: yup.string().required().min(2),
        pais: yup.object().shape({
            id: yup.number(),
            pais: yup.string(),
            sigla: yup.string()
        })
    }).required()
})

export const CadastroCidades: React.FC = () => {
    const { id = 'novo' } = useParams<'id'>();
    const navigate = useNavigate();

    const { formRef, save, saveAndNew, saveAndClose, isSaveAndNew, isSaveAndClose } = useVForm();
    const { debounce } = useDebounce();

    const [obj, setObj] = useState<ICidades | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isValidating, setIsValidating] = useState<any>(null);

    const [cidade, setCidade] = useState<string>('');
    const [estado, setEstado] = useState<IEstados | null>(null);
    const [isValid, setIsValid] = useState(false);
    const [alterando, setAlterando] = useState(false);

    useEffect(() => {
        if (id !== 'novo') {
            setIsLoading(true);

            CidadesService.getById(Number(id))
                .then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        toast.error(result.message);
                        navigate('/cidades');
                    } else {
                        console.log('RESULT', result);
                        formRef.current?.setData(result);
                        setObj(result);
                        setAlterando(true);
                    }
                });
        } else {
            formRef.current?.setData({
                cidade: '',
                estado: null
            });
        }
    }, [id]);

    useEffect(() => {
        if (obj) setIsValid(true)
        else setIsValid(false);
    }, [obj])

    useEffect(() => {
        if (cidade && estado) {
            const formData = formRef.current?.getData();
            const data: IFormData = {
                cidade: formData?.cidade,
                estado: formData?.estado
            }
            validate(data);
        }
    }, [cidade, estado])

    const validate = (dados: IFormData) => {
        const obj1 = {
            id: obj?.id,
            cidade: obj?.cidade,
            estado: obj?.estado
        }
        const obj2 = {
            id: Number(id),
            cidade: dados.cidade,
            estado: dados.estado
        }
        if (JSON.stringify(obj1) !== JSON.stringify(obj2)) {
            setIsValidating(true);
            debounce(() => {
                CidadesService.validate(dados)
                .then((result) => {
                    setIsValidating(false);
                    if (result instanceof Error) {
                        toast.error(result.message);
                    } else {
                        setIsValid(result);
                        if (result === false) {
                            const validationErrors: IVFormErrors = {};
                            validationErrors['cidade'] = 'Já existe uma cidade vinculada a este estado.';
                            validationErrors['estado'] = 'Já existe um estado vinculado a esta cidade.';
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
                            CidadesService.create(dadosValidados)
                                .then((result) => {
                                    setIsLoading(false);
                                    if (result instanceof Error) {
                                        toast.error(result.message)
                                    } else {
                                        toast.success('Cadastrado com sucesso!')
                                        if (isSaveAndClose()) {
                                            navigate('/cidades');
                                        } else if (isSaveAndNew()) {
                                            setIsValidating(null);
                                            navigate('/cidades/cadastro/novo');
                                            formRef.current?.setData({
                                                estado: '',
                                                uf: ''
                                            });
                                        } else {
                                            setIsValidating(null);
                                            navigate(`/cidades/cadastro/${result}`);
                                        }
                                    }
                                });
                        } else {
                            CidadesService.updateById(Number(id), { id: Number(id), ...dadosValidados })
                                .then((result) => {
                                    setIsLoading(false);
                                    if (result instanceof Error) {
                                        toast.error(result.message);
                                    } else {
                                        toast.success('Alterado com sucesso!');
                                        if (isSaveAndClose()) {
                                            navigate('/cidades')
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
                    if (!estado) {
                        validationErrors['estado'] = 'O campo é obrigatório';
                    }
                    
                    console.log(validationErrors);
                    formRef.current?.setErrors(validationErrors);
                })
    };

    const handleDelete = (id: number) => {

        if (window.confirm('Deseja apagar o registro?')) {
            CidadesService.deleteById(id)
                .then(result => {
                    if (result instanceof Error) {
                        toast.error(result.message);
                    } else {         
                        toast.success('Apagado com sucesso!')
                        navigate('/cidades');
                    }
                })
        }
    }

    return (
        <LayoutBase 
            titulo={id === 'novo' ? 'Cadastrar Cidade' : 'Editar Cidade'}
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
                    onClickNovo={() => navigate('/cidades/cadastro/novo') }
                    onClickVoltar={() => navigate('/cidades') }
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
                                    name='cidade' 
                                    label="Cidade"
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
                                        formRef.current?.setFieldError('cidade', '');
                                        setCidade(e.target.value.toUpperCase());
                                        if (alterando) setAlterando(false);
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                <VAutocomplete
                                    required
                                    name="estado"
                                    label='estado'
                                    TFLabel="Estado"
                                    secLabel={['pais', 'sigla']}
                                    getAll={EstadosService.getAll}
                                    onInputchange={() => {
                                        setIsValid(false);
                                        setIsValidating('');
                                        formRef.current?.setFieldError('estado', '');
                                    }}
                                    onChange={(newValue) => {
                                        setEstado(newValue);
                                        if (alterando) setAlterando(false);
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