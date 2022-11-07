// #region EXTERNAL IMPORTS
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, CircularProgress, Grid, Icon, InputAdornment, LinearProgress, Paper, Typography } from "@mui/material";
import { toast } from "react-toastify";
import * as yup from 'yup';
// #endregion

// #region INTERNAL IMPORTS
import { IEstados } from "../../shared/interfaces/entities/Estados";
import { EstadosService } from "../../shared/services/api/estados/EstadosService";
import { useDebounce } from "../../shared/hooks";
import { ConsultaEstados } from "../estados/ConsultaEstados";
import { CustomDialog, DetailTools } from "../../shared/components";
import { LayoutBase } from "../../shared/layouts";
import { VTextField, VForm, useVForm, IVFormErrors, VAutocompleteSearch } from "../../shared/forms"
import ControllerCidades from "../../shared/controllers/CidadesController";
import { ICadastroProps } from "../../shared/interfaces/views/Cadastro";
import { IDetalhesCidades } from "../../shared/interfaces/entities/Cidades";
// #endregion

// #region INTERFACES
interface IFormData {
    nmcidade: string;
    ddd: string | undefined;
    estado: IEstados;
}
// #endregion

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
    nmcidade: yup.string().required(),
    ddd: yup.string().required(),
    estado: yup.object().typeError("Selecione um estado").shape({
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
    }).required()
})

export const CadastroCidades: React.FC<ICadastroProps> = ({isDialog = false, toggleOpen, selectedId, reloadDataTableIfDialog}) => {
    // #region HOOKS
    const { id = 'novo' } = useParams<'id'>();
    const navigate = useNavigate();
    const { formRef, save, saveAndNew, saveAndClose, isSaveAndNew, isSaveAndClose } = useVForm();
    const { debounce } = useDebounce();
    // #endregion

    // #region STATES
    const [isLoading, setIsLoading] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [nmcidade, setNmCidade] = useState("");
    const [estado, setEstado] = useState<IEstados | null>(null);
    const [cidadeOriginal, setCidadeOriginal] = useState<IDetalhesCidades | null>(null);
    const [isValid, setIsValid] = useState(false);
    const [isConsultaEstadosOpen, setIsConsultaEstadosDialogOpen] = useState(false);
    // #endregion

    // #region ACTIONS
    const toggleConsultaEstadosDialogOpen = () => {
        setIsConsultaEstadosDialogOpen(oldValue => !oldValue);
    }

    useEffect(() => {
        if (id !== 'novo') {
            setIsLoading(true);
            controller.getOne(Number(id))
                .then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        toast.error(result.message);
                        navigate('/cidades');
                    } else {
                        result.datacad = new Date(result.datacad).toLocaleString();
                        result.ultalt = new Date(result.ultalt).toLocaleString();
                        formRef.current?.setData(result);
                        setIsValid(true);
                        setEstado(result.estado);
                        setNmCidade(result.nmcidade);
                        setCidadeOriginal(result);
                    }
                });
        } else {
            formRef.current?.setData({
                nmcidade: '',
                ddd: '',
                estado: null
            });
        }
    }, [id]);

    useEffect(() => {
        const formData = formRef.current?.getData();
        const dados: IFormData = {
            nmcidade: formData?.nmcidade,
            ddd: formData?.ddi,
            estado: formData?.estado
        }
        if (nmcidade != "" && estado) {
            if (id !== 'novo') {
                const objAlterado = {
                    nmcidade: nmcidade,
                    estado: estado
                };
                const objOriginal = {
                    nmcidade: cidadeOriginal?.nmcidade,
                    estado: cidadeOriginal?.estado,
                };
                if (JSON.stringify(objAlterado) === JSON.stringify(objOriginal)) {
                    setIsValid(true);
                } else {
                    validate(dados);
                }
            } else {
                validate(dados);
            }
        }
    }, [nmcidade, estado]);

    const validate = (dados: IFormData) => {
        debounce(() => {
            if (!isValid && dados.nmcidade && dados.estado) {
                setIsValidating(true);
                debounce(() => {
                    controller.validate(dados)
                    .then((result) => {
                        setIsValidating(false);
                        if (result instanceof Error) {
                            toast.error(result.message);
                        } else {
                            setIsValid(result);
                            console.log("RESULT", result);
                            if (result === false) {
                                const validationErrors: IVFormErrors = {};
                                validationErrors['nmcidade'] = 'Já existe uma cidade vinculada a este estado.';
                                formRef.current?.setErrors(validationErrors);
                            }
                        }
                    })
                })
            } else {
                setIsValid(true);
            }
        })
    }

    const handleSave = (dados: IFormData) => {
        formValidationSchema
            .validate(dados, { abortEarly: false })
                .then((dadosValidados) => {
                    if(isValid) {
                        setIsLoading(true);
                        if (isDialog) {
                            if (selectedId === 0) {
                                controller.create(dadosValidados)
                                    .then((result) => {
                                        setIsLoading(false);
                                        if (result instanceof Error) {
                                            toast.error(result.message)
                                        } else {
                                            toast.success('Cadastrado com sucesso!')
                                            reloadDataTableIfDialog?.()
                                            toggleOpen?.();
                                        }
                                    });
                            } else {
                                controller.update(Number(id), dadosValidados)
                                .then((result) => {
                                    setIsLoading(false);
                                    if (result instanceof Error) {
                                        toast.error(result.message);
                                    } else {
                                        toast.success('Alterado com sucesso!');
                                        reloadDataTableIfDialog?.();
                                        toggleOpen?.();
                                    }
                                });
                            }
                        } else {
                            if (id === 'novo') {
                                controller.create(dadosValidados)
                                    .then((result) => {
                                        setIsLoading(false);
                                        if (result instanceof Error) {
                                            toast.error(result.message)
                                        } else {
                                            toast.success('Cadastrado com sucesso!')
                                            if (isSaveAndClose()) {
                                                navigate('/cidades');
                                            } else if (isSaveAndNew()) {
                                                setIsValidating(false);
                                                navigate('/cidades/cadastro/novo');
                                                formRef.current?.setData({
                                                    nmcidade: '',
                                                    ddd: '',
                                                    estado: null
                                                });
                                                setIsValid(false);
                                            } else {
                                                setIsValidating(false);
                                                setIsValid(true);
                                                setNmCidade(dadosValidados.nmcidade);
                                                setEstado(dadosValidados.estado)
                                                navigate(`/cidades/cadastro/${result}`);
                                            }
                                        }
                                    });
                            } else {
                                controller.update(Number(id), dados)
                                .then((result) => {
                                    setIsLoading(false);
                                    if (result instanceof Error) {
                                        toast.error(result.message);
                                    } else {
                                        toast.success('Alterado com sucesso!');
                                        if (isSaveAndClose()) {
                                            navigate('/cidades')
                                        } else {
                                            setIsValidating(false);
                                        }
                                    }
                                });
                            }
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
                    formRef.current?.setErrors(validationErrors);
                })
    };

    const handleDelete = (id: number) => {

        if (window.confirm('Deseja apagar o registro?')) {
            controller.delete(id)
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
    // #endregion

    // #region CONTROLLERS
    const controller = new ControllerCidades();
    // #endregion

    return (
        <LayoutBase 
            titulo={id === 'novo' ? 'Cadastrar Cidade' : 'Editar Cidade'}
            barraDeFerramentas={
                <DetailTools
                    mostrarBotaoSalvarFechar
                    mostrarBotaoSalvarNovo={id == 'novo'}
                    mostrarBotaoApagar={id !== 'novo'}
                    mostrarBotaoNovo={id !== 'novo'}
                    
                    disableButtons={isValidating}

                    onClickSalvar={save}
                    onClickSalvarNovo={saveAndNew}
                    onClickSalvarFechar={saveAndClose}
                    onClickApagar={() => handleDelete(Number(id))}
                    onClickNovo={() => navigate('/cidades/cadastro/novo') }
                    onClickVoltar={() => {
                        if (isDialog) {
                            toggleOpen?.();
                        } else {
                            navigate('/cidades')
                        }
                    }}
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
                                    size="small"
                                    required
                                    fullWidth
                                    name='nmcidade' 
                                    label="Cidade"
                                    disabled={isLoading}                             
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                { isValidating && (
                                                    <Box sx={{ display: 'flex' }}>
                                                        <CircularProgress size={24}/>
                                                    </Box>
                                                ) }
                                                { (isValid && nmcidade != "" && estado) && (
                                                    <Box sx={{ display: 'flex' }}>
                                                        <Icon color="success">done</Icon>
                                                    </Box>
                                                ) }
                                            </InputAdornment>
                                        )
                                    }}
                                    onChange={(e) => {
                                        setIsValid(false);
                                        setIsValidating(false);
                                        setNmCidade(e.target.value.toUpperCase());
                                        formRef.current?.setFieldError('nmcidade', '');
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <VTextField 
                                    required
                                    fullWidth
                                    size="small"
                                    name='ddd' 
                                    label="DDD"
                                    disabled={isLoading}
                                    inputProps={{ maxLength: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <VAutocompleteSearch
                                    size="small"
                                    required
                                    name="estado"
                                    label={["nmestado", "pais.sigla"]}
                                    TFLabel="Estado"
                                    getAll={EstadosService.getAll}
                                    onInputchange={() => {
                                        setIsValid(false);
                                        setIsValidating(false);
                                        formRef.current?.setFieldError('nmcidade', '');
                                    }}
                                    onChange={(newValue) => {
                                        setEstado(newValue);
                                    }}
                                    onClickSearch={toggleConsultaEstadosDialogOpen}
                                    isDialogOpen={isConsultaEstadosOpen}
                                />
                            </Grid>  

                            {(id != 'novo' || (selectedId && selectedId != 0)) && (
                            <Grid container item direction="row" spacing={2}>
                                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                    <VTextField
                                        size="small"
                                        required
                                        fullWidth
                                        name='datacad' 
                                        label="Data Cad."
                                        inputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                    <VTextField
                                        size="small"
                                        required
                                        fullWidth
                                        name='ultalt' 
                                        label="Ult. Alt."
                                        inputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        )}
                        </Grid>         
                    </Grid>
                    <CustomDialog
                        onClose={toggleConsultaEstadosDialogOpen}
                        handleClose={toggleConsultaEstadosDialogOpen}
                        open={isConsultaEstadosOpen}
                        title="Consultar Estados"
                        fullWidth
                        maxWidth="xl"
                    >
                        <ConsultaEstados
                            isDialog
                            onSelectItem={(row) => {
                                formRef.current?.setFieldValue("estado", row);
                                formRef.current?.setFieldError('estado', '');
                                setEstado(row);
                            }}
                            toggleDialogOpen={toggleConsultaEstadosDialogOpen}
                        />
                    </CustomDialog>
                </Box>
            </VForm>
        </LayoutBase>
    )

}