// #region EXTERNAL IMPORTS
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, CircularProgress, Collapse, Grid, Icon, IconButton, InputAdornment, LinearProgress, Paper, Typography } from "@mui/material";
import * as yup from 'yup';
import { toast } from "react-toastify";
// #endregion

// #region INTERNAL IMPORTS
import { DetailTools } from "../../shared/components";
import { LayoutBase } from "../../shared/layouts";
import { EstadosService } from "../../shared/services/api/estados/EstadosService";
import { VTextField, VForm, useVForm, IVFormErrors, VAutocompleteSearch } from "../../shared/forms"
import { IPaises } from "../../shared/interfaces/entities/Paises";
import { IDetalhesEstados, IEstados } from "../../shared/interfaces/entities/Estados";
import { useDebounce } from "../../shared/hooks";
import ControllerEstados from "../../shared/controllers/EstadosController";
import ControllerPaises from "../../shared/controllers/PaisesController";
// #endregion

// #region INTERFACES
interface IFormData {
    nmestado: string;
    uf: string;
    pais: IPaises;
    datacad: string;
    ultalt: string;
}
// #endregion

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
    nmestado: yup.string().required(),
    uf: yup.string().required().min(2),
    pais: yup.object().shape({
        id: yup.number().positive().integer().required(),
        nmpais: yup.string().required(),
        sigla: yup.string().required().min(2),
        datacad: yup.string().required(),
        ultalt: yup.string().required()
    }).required(),
    datacad: yup.string().required(),
    ultalt: yup.string().required()
})

export const CadastroEstados: React.FC = () => {
    // #region HOOKS
    const { id = 'novo' } = useParams<'id'>();
    const navigate = useNavigate();
    const { formRef, save, saveAndNew, saveAndClose, isSaveAndNew, isSaveAndClose } = useVForm();
    const { debounce } = useDebounce();
    // #endregion

    // #region STATES
    const [obj, setObj] = useState<IEstados | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isValidating, setIsValidating] = useState<any>(null);
    const [estado, setEstado] = useState<string>('');
    const [pais, setPais] = useState<IPaises | null>(null);
    const [isValid, setIsValid] = useState(false);
    const [alterando, setAlterando] = useState(false);
    // #endregion

    // #region ACTIONS
    useEffect(() => {
        if (id !== 'novo') {
            setIsLoading(true);

            controller.getOne(Number(id))
                .then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        toast.error(result.message);
                        navigate('/estados');
                    } else {
                        console.log('RESULT', result);
                        formRef.current?.setData(result);
                        setIsValid(true);
                        // setEstado(formRef.current?.getData().estado);
                        // setPais(formRef.current?.getData().pais);
                        // setObj(result);
                        // setAlterando(true);
                        // validate({
                        //     nmestado: result.nmestado,
                        //     uf: result.uf,
                        //     pais: result.pais,
                        //     datacad: result.datacad.toLocaleString(),
                        //     ultalt: result.ultalt.toLocaleString()
                        // });
                    }
                });
        } else {
            formRef.current?.setData({
                nmestado: '',
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
        console.log('aqui');
        if (estado && pais) {
            const formData = formRef.current?.getData();
            const data: IFormData = {
                nmestado: formData?.nmestado,
                uf: formData?.uf,
                pais: formData?.pais,
                datacad: new Date().toLocaleString(),
                ultalt: new Date().toLocaleString(),
            }
            validate(data);
        }
    }, [estado, pais])

    const validate = (dados: IFormData) => {
        const obj1 = {
            id: obj?.id,
            estado: obj?.nmestado,
            pais: obj?.pais
        }
        const obj2 = {
            id: Number(id),
            estado: dados.nmestado,
            pais: dados.pais
        }
        if (JSON.stringify(obj1) !== JSON.stringify(obj2) && ((dados.nmestado) && (dados.pais))) {
            debounce(() => {
                setIsValidating(true);
                controller.validate(dados)
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
        let data = new Date();
        dados.datacad = data.toLocaleString();
        dados.ultalt = data.toLocaleString();
        formValidationSchema
            .validate(dados, { abortEarly: false })
                .then((dadosValidados) => {
                    if(isValid) {
                        setIsLoading(true);
                        if (id === 'novo') {
                            controller.create(dadosValidados)
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
                            controller.update(Number(id), { id: Number(id), ...dadosValidados })
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
    // #endregion

    // #region CONTROLLERS
    const controller = new ControllerEstados();
    const controllerPaises = new ControllerPaises();
    // #endregion

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
                <Box margin={1} display="flex" flexDirection="column" component={Paper} alignItems="center">
                    <Grid item container xs={12} sm={10} md={6} lg={5} xl={4} direction="column" padding={2} spacing={2} alignItems="left">

                        {isLoading && (
                            <Grid item>
                                <LinearProgress variant="indeterminate"/>
                            </Grid>
                        )}

                        <Grid item>
                            <Typography variant="h6">Dados Gerais</Typography>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <VTextField 
                                    required
                                    fullWidth
                                    size="small"
                                    name='nmestado' 
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
                                                nmestado: formData?.estado,
                                                uf: formData?.uf,
                                                pais: formData?.pais,
                                                datacad: new Date().toLocaleString(),
                                                ultalt: new Date().toLocaleString()
                                            }
                                            validate(data);
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <VTextField 
                                    required
                                    fullWidth
                                    size="small"
                                    name='uf' 
                                    label="UF"
                                    disabled={isLoading}
                                    inputProps={{ maxLength: 2 }}
                                    // onBlur={() => {
                                    //     if (alterando) {
                                    //         const formData = formRef.current?.getData();
                                    //         const data = {
                                    //             nmestado: formData?.estado,
                                    //             uf: formData?.uf,
                                    //             pais: formData?.pais,
                                    //             datacad: new Date().toLocaleString(),
                                    //             ultalt: new Date().toLocaleString()
                                    //         }
                                    //         validate(data);
                                    //     }
                                    // }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <VAutocompleteSearch
                                    size="small"
                                    required
                                    name="pais"
                                    label={["nmpais"]}
                                    TFLabel="País"
                                    getAll={controllerPaises.getAll}
                                    onInputchange={() => {
                                        setIsValid(false);
                                        setIsValidating('');
                                        formRef.current?.setFieldError('estado', '');
                                    }}
                                    onChange={(newValue) => {
                                        setPais(newValue);
                                        if (newValue && formRef.current?.getData().nmestado != "") {
                                            debounce(() => {
                                            })
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