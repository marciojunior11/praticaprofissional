// #region EXTERNAL IMPORTS
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, CircularProgress, Collapse, Grid, Icon, IconButton, InputAdornment, LinearProgress, Paper, Typography } from "@mui/material";
import * as yup from 'yup';
// #endregion

// #region INTERNAL IMPORTS
import { DetailTools } from "../../shared/components";
import { LayoutBase } from "../../shared/layouts";
import { PaisesService } from "../../shared/services/api/paises/PaisesService";
import { IPaises } from "../../shared/interfaces/entities/Paises";
import { VTextField, VForm, useVForm, IVFormErrors } from "../../shared/forms"
import { toast } from "react-toastify";
import { useDebounce } from "../../shared/hooks";
import ControllerPaises from "../../shared/controllers/PaisesController";
// #endregion

// #region INTERFACES
interface IFormData {
    nmpais: string;
    sigla: string;
    ddi: string;
}
// #endregion

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
    nmpais: yup.string().required(),
    sigla: yup.string().required().min(2),
    ddi: yup.string().required(),
})

export const CadastroPaises: React.FC = () => {
    // #region HOOKS
    const { id = 'novo' } = useParams<'id'>();
    const navigate = useNavigate();
    const { debounce } = useDebounce();
    const { formRef, save, saveAndNew, saveAndClose, isSaveAndNew, isSaveAndClose } = useVForm();
    // #endregion

    // #region STATES
    const [obj, setObj] = useState<IPaises | null>(null); 
    const [isLoading, setIsLoading] = useState(false);
    const [isValidating, setIsValidating] = useState<boolean>(false);
    const [isValid, setIsValid] = useState(false);
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
                    navigate('/paises');
                } else {
                    console.log('RESULT', result);
                    formRef.current?.setData(result);
                    setObj(result);
                }
            });
        } else {
            setIsValid(false);
            formRef.current?.setData({
                nmpais: '',
                sigla: '',
                ddi: ''
            });
        }
    }, [id]);

    useEffect(() => {
        if (obj) setIsValid(true)
        else setIsValid(false);
    }, [obj])

    const validate = (filter: string) => {
        if (filter != obj?.nmpais) {
            if (filter != "") {
                setIsValidating(true);
                debounce(() => {
                    controller.validate(filter)
                        .then((result) => {
                            setIsValidating(false);
                            if (result instanceof Error) {
                                toast.error(result.message);
                            } else {
                                setIsValid(result);
                                if (result === false) {
                                    const validationErrors: IVFormErrors = {};
                                    validationErrors['nmpais'] = 'Este país já está cadastrado.';
                                    formRef.current?.setErrors(validationErrors);
                                }
                            }
                        })
                });        
            }
        } else {
            setIsValid(true);
        }
    }

    const handleSave = (dados: IFormData) => {
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
                                            navigate('/paises');
                                        } else if (isSaveAndNew()) {
                                            setIsValidating(false);
                                            navigate('/paises/cadastro/novo');
                                            formRef.current?.setData({
                                                pais: '',
                                                sigla: '',
                                                ddi: ''
                                            });
                                            setIsValid(false);
                                        } else {
                                            setIsValidating(false);
                                            navigate(`/paises/cadastro/${result}`);
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
                                        navigate('/paises')
                                    } else {
                                        setIsValidating(false);
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
    // #endregion

    // #region CONTROLLERS
    const controller = new ControllerPaises();
    // #endregion


    return (
        <LayoutBase 
            titulo={id === 'novo' ? 'Cadastrar País' : 'Editar País'}
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
                    onClickNovo={() => navigate('/paises/cadastro/novo') }
                    onClickVoltar={() => navigate('/paises') }
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
                                    size="small"
                                    required
                                    fullWidth
                                    name='nmpais' 
                                    label="País"
                                    disabled={isLoading}                             
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                { (isValidating && formRef.current?.getData().nmpais) && (
                                                    <Box sx={{ display: 'flex' }}>
                                                        <CircularProgress size={24}/>
                                                    </Box>
                                                ) }
                                                { (isValid) && (
                                                    <Box sx={{ display: 'flex' }}>
                                                        <Icon color="success">done</Icon>
                                                    </Box>
                                                ) }
                                            </InputAdornment>
                                        )
                                    }}
                                    onBlur={e => {
                                        setIsValidating(false);
                                    }}
                                    onChange={(e) => {
                                        setIsValid(false);
                                        setIsValidating(false);
                                        formRef.current?.setFieldError('pais', '');
                                        debounce(() => {
                                            validate(e.target.value);
                                        });
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <VTextField
                                    size="small"
                                    required
                                    fullWidth
                                    name='sigla' 
                                    label="Sigla"
                                    disabled={isLoading}
                                    inputProps={{ maxLength: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <VTextField
                                    size="small"
                                    required
                                    fullWidth
                                    name='ddi' 
                                    label="DDI"
                                    disabled={isLoading}
                                    inputProps={{ maxLength: 4 }}
                                />
                            </Grid>
                        </Grid>

                    </Grid>

                </Box>
            </VForm>
        </LayoutBase>
    )

}