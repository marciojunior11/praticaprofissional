// #region EXTERNAL IMPORTS
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, CircularProgress, Collapse, Grid, Icon, IconButton, InputAdornment, LinearProgress, Paper, Typography } from "@mui/material";
import * as yup from 'yup';
import { toast } from "react-toastify";
// #endregion

// #region INTERNAL IMPORTS
import { CustomDialog, DetailTools } from "../../shared/components";
import { LayoutBase } from "../../shared/layouts";
import { VTextField, VForm, useVForm, IVFormErrors, VAutocompleteSearch } from "../../shared/forms"
import { IGrades } from "../../shared/interfaces/entities/Grades";
import { IDetalhesCaracteristicas, ICaracteristicas } from "../../shared/interfaces/entities/Caracteristicas";
import { useDebounce } from "../../shared/hooks";
import ControllerCaracteristicas from "../../shared/controllers/CaracteristicasController";
import ControllerGrades from "../../shared/controllers/GradesController";
import { ConsultaGrades } from "../grades/ConsultaGrades";
import { ICadastroProps } from "../../shared/interfaces/views/Cadastro";
// #endregion

// #region INTERFACES
interface IFormData {
    descricao: string;
    grade: IGrades
}
// #endregion

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
    descricao: yup.string().required(),
    grade: yup.object().typeError("Selecione uma grade").shape({
        id: yup.number(),
        descricao: yup.string(),
        datacad: yup.string(),
        ultalt: yup.string()
    }).required()
})

export const CadastroCaracteristicas: React.FC<ICadastroProps> = ({isDialog = false, toggleOpen, selectedId, reloadDataTableIfDialog}) => {
    // #region HOOKS
    const { id = 'novo' } = useParams<'id'>();
    const navigate = useNavigate();
    const { formRef, save, saveAndNew, saveAndClose, isSaveAndNew, isSaveAndClose } = useVForm();
    const { debounce } = useDebounce();
    // #endregion

    // #region STATES
    const [isLoading, setIsLoading] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [grade, setGrade] = useState<IGrades | null>(null);
    const [descricao, setDescricao] = useState("");
    const [caracteristicaOriginal, setGradeOriginal] = useState<IDetalhesCaracteristicas | null>(null);
    const [isValid, setIsValid] = useState(false);
    const [isConsultaGradesDialogOpen, setIsConsultaGradesDialogOpen] = useState(false);
    // #endregion

    // #region ACTIONS
    const toggleConsultaGradesDialogOpen = () => {
        setIsConsultaGradesDialogOpen(oldValue => !oldValue);
    }
    useEffect(() => {
        if (isDialog) {
            if (selectedId !== 0) {
                setIsLoading(true);
                controller.getOne(Number(selectedId))
                    .then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            toast.error(result.message);
                            navigate('/caracteristicas');
                        } else {
                            result.datacad = new Date(result.datacad).toLocaleString();
                            result.ultalt = new Date(result.ultalt).toLocaleString();
                            formRef.current?.setData(result);
                            setIsValid(true);
                            setGrade(result.grade);
                            setDescricao(result.descricao);
                            setGradeOriginal(result);
                        }
                    });
            } else {
                formRef.current?.setData({
                    descricao: '',
                    grade: null
                });
            }
        } else {
            if (id !== 'novo') {
                setIsLoading(true);
                controller.getOne(Number(id))
                    .then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            toast.error(result.message);
                            navigate('/caracteristicas');
                        } else {
                            result.datacad = new Date(result.datacad).toLocaleString();
                            result.ultalt = new Date(result.ultalt).toLocaleString();
                            formRef.current?.setData(result);
                            setIsValid(true);
                            setGrade(result.grade);
                            setDescricao(result.descricao);
                            setGradeOriginal(result);
                        }
                    });
            } else {
                formRef.current?.setData({
                    descricao: '',
                    grade: null
                });
            }
        }
    }, [id]);

    useEffect(() => {
        const formData = formRef.current?.getData();
        const dados: IFormData = {
            descricao: formData?.descricao,
            grade: formData?.grade
        }
        if (descricao != "" && grade != null) {
            if (id !== 'novo' || (selectedId && selectedId != 0)) {
                const objAlterado = {
                    descricao: descricao,
                    grade: grade
                };
                const objOriginal = {
                    descricao: caracteristicaOriginal?.descricao,
                    grade: caracteristicaOriginal?.grade,
                };
                console.log(objOriginal);
                console.log(objAlterado);
                if (JSON.stringify(objAlterado) === JSON.stringify(objOriginal)) {
                    setIsValid(true);
                    console.log(isValid);
                } else {
                    validate(dados);
                }
            } else {
                validate(dados);
            }
        }
    }, [descricao, grade]);

    const validate = (dados: IFormData) => {
        debounce(() => {
            if (!isValid && dados.descricao && dados.grade) {
                setIsValidating(true);
                debounce(() => {
                    controller.validate({
                        descricao: dados.descricao,
                        grade: dados.grade
                    })
                    .then((result) => {
                        setIsValidating(false);
                        if (result instanceof Error) {
                            toast.error(result.message);
                        } else {
                            setIsValid(result);
                            console.log("RESULT", result);
                            if (result === false) {
                                const validationErrors: IVFormErrors = {};
                                validationErrors['descricao'] = 'A característica informada já está vinculada a esta grade.';
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
                                                navigate('/caracteristicas');
                                            } else if (isSaveAndNew()) {
                                                setIsValidating(false);
                                                navigate('/caracteristicas/cadastro/novo');
                                                formRef.current?.setData({
                                                    nmcaracteristica: '',
                                                    uf: '',
                                                    grade: null
                                                });
                                                setIsValid(false);
                                            } else {
                                                setIsValidating(false);
                                                setIsValid(true);
                                                setDescricao(dadosValidados.descricao);
                                                setGrade(dadosValidados.grade)
                                                navigate(`/caracteristicas/cadastro/${result}`);
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
                                            navigate('/caracteristicas')
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
                        navigate('/caracteristicas');
                    }
                })
        }
    }
    // #endregion

    // #region CONTROLLERS
    const controller = new ControllerCaracteristicas();
    const controllerGrades = new ControllerGrades();
    // #endregion

    return (
        <LayoutBase 
            titulo={id === 'novo' ? 'Cadastrar Característica' : 'Editar Característica'}
            barraDeFerramentas={
                <DetailTools
                    mostrarBotaoSalvarFechar
                    mostrarBotaoSalvar={!isDialog}
                    mostrarBotaoSalvarNovo={id == 'novo' && !isDialog}
                    mostrarBotaoApagar={id !== 'novo' && !isDialog}
                    mostrarBotaoNovo={id !== 'novo' && !isDialog}
                    
                    disableButtons={isValidating}

                    onClickSalvar={save}
                    onClickSalvarNovo={saveAndNew}
                    onClickSalvarFechar={saveAndClose}
                    onClickApagar={() => handleDelete(Number(id))}
                    onClickNovo={() => navigate('/caracteristicas/cadastro/novo') }
                    onClickVoltar={() => {
                        if (isDialog) {
                            toggleOpen?.();
                        } else {
                            navigate('/caracteristicas')
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
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <VTextField 
                                    required
                                    fullWidth
                                    size="small"
                                    name='descricao' 
                                    label="Descrição"
                                    disabled={isLoading}                             
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                { isValidating && (
                                                    <Box sx={{ display: 'flex' }}>
                                                        <CircularProgress size={24}/>
                                                    </Box>
                                                ) }
                                                { (isValid && descricao != "" && grade != null) && (
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
                                        setDescricao(e.target.value.toUpperCase());
                                        formRef.current?.setFieldError('descricao', '');
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <VAutocompleteSearch
                                    size="small"
                                    required
                                    name="grade"
                                    label={["descricao"]}
                                    TFLabel="Grade"
                                    getAll={controllerGrades.getAll}
                                    onInputchange={() => {
                                        setIsValid(false);
                                        setIsValidating(false);
                                        formRef.current?.setFieldError('descricao', '');
                                    }}
                                    onChange={newValue => {
                                        setGrade(newValue);
                                    }}
                                    onClickSearch={() => {
                                        toggleConsultaGradesDialogOpen();
                                    }}
                                    isDialogOpen={isConsultaGradesDialogOpen}
                                />
                            </Grid>
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
                    <CustomDialog
                        onClose={toggleConsultaGradesDialogOpen}
                        handleClose={toggleConsultaGradesDialogOpen}
                        open={isConsultaGradesDialogOpen}
                        title="Consultar Grades"
                        fullWidth
                        maxWidth="xl"
                    >
                        <ConsultaGrades
                            isDialog
                            onSelectItem={(row) => {
                                formRef.current?.setFieldValue("grade", row);
                                formRef.current?.setFieldError('grade', '');
                                setGrade(row);
                            }}
                            toggleDialogOpen={toggleConsultaGradesDialogOpen}
                        />
                    </CustomDialog>
                </Box>
            </VForm>
        </LayoutBase>
    )

}