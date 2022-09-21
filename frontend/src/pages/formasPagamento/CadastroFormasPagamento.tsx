// #region EXTERNAL IMPORTS
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, CircularProgress, Collapse, Grid, Icon, IconButton, InputAdornment, LinearProgress, Paper, Typography } from "@mui/material";
import * as yup from 'yup';
import { toast } from "react-toastify";
// #endregion

// #region INTERNAL IMPORTS
import { DetailTools } from "../../shared/components";
import { LayoutBase } from "../../shared/layouts";
import { FormasPagamentoService } from "../../shared/services/api/formasPagamento/FormasPagamentoService";
import { IFormasPagamento } from "../../shared/models/ModelFormasPagamento";
import { VTextField, VForm, useVForm, IVFormErrors } from "../../shared/forms"
import { useDebounce } from "../../shared/hooks";
// #endregion

// #region INTERFACES
interface IFormData {
    descricao: string,
    dataCad: string,
    ultAlt: string
}

interface ICadastroProps {
    isDialog?: boolean;
    toggleOpen?: () => void;
    selectedId?: number;
    reloadDataTableIfDialog?: () => void;
}

// #endregion

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
    descricao: yup.string().required(),
    dataCad: yup.string().required(),
    ultAlt: yup.string().required(),
})

export const CadastroFormasPagamento: React.FC<ICadastroProps> = ({isDialog = false, toggleOpen, selectedId, reloadDataTableIfDialog}) => {
    // #region HOOKS
    const { id = 'novo' } = useParams<'id'>();
    const navigate = useNavigate();
    const { formRef, save, saveAndNew, saveAndClose, isSaveAndNew, isSaveAndClose } = useVForm();
    const { debounce } = useDebounce();
    // #endregion

    // #region STATES
    const [obj, setObj] = useState<IFormasPagamento | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isValidating, setIsValidating] = useState<any>(null);
    const [isValid, setIsValid] = useState(false);
    // #endregion

    // #region ACTIONS
    useEffect(() => {
        if (isDialog) {
            if (selectedId !== 0) {
                setIsLoading(true);
                FormasPagamentoService.getById(Number(selectedId))
                    .then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            toast.error(result.message);
                            navigate('/formaspagamento');
                        } else {
                            formRef.current?.setData(result);
                            setObj(result);
                        }
                    });
            } else {
                formRef.current?.setData({
                    descricao: ''
                });
            }
        } else {
            if (id !== 'novo') {
                setIsLoading(true);
                FormasPagamentoService.getById(Number(id))
                    .then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            toast.error(result.message);
                            navigate('/formaspagamento');
                        } else {
                            console.log('RESULT', result);
                            formRef.current?.setData(result);
                            setObj(result);
                        }
                    });
            } else {
                formRef.current?.setData({
                    descricao: ''
                });
            }   
        }
    }, [id]);

    useEffect(() => {
        if (obj) setIsValid(true)
        else setIsValid(false);
    }, [obj])

    const validate = (filter: string) => {
        if (filter != obj?.descricao) {
            setIsValidating(true);
            debounce(() => {
                FormasPagamentoService.validate(filter)
                    .then((result) => {
                        setIsValidating(false);
                        if (result instanceof Error) {
                            toast.error(result.message);
                        } else {
                            setIsValid(result);
                            if (result === false) {
                                const validationErrors: IVFormErrors = {};
                                validationErrors['descricao'] = 'Esta forma de pagamento já está cadastrada';
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
        dados.dataCad = data.toLocaleString();
        dados.ultAlt = data.toLocaleString();
        formValidationSchema
            .validate(dados, { abortEarly: false })
                .then((dadosValidados) => {
                    if(isValid) {
                        setIsLoading(true);
                        if (isDialog) {
                            if (selectedId === 0) {
                                FormasPagamentoService.create(dadosValidados)
                                    .then((result) => {
                                        setIsLoading(false);
                                        if (result instanceof Error) {
                                            toast.error(result.message)
                                        } else {
                                            toast.success('Cadastrado com sucesso!')
                                            if (isSaveAndClose()) {
                                                if (isDialog) {
                                                    reloadDataTableIfDialog?.();
                                                    toggleOpen?.();
                                                }
                                                else {
                                                    navigate('/formaspagamento')
                                                } 
                                            } else if (isSaveAndNew()) {
                                                setIsValidating('');
                                                setIsValid(false);
                                                navigate('/formaspagamento/cadastro/novo');
                                                formRef.current?.setData({
                                                    descricao: ''
                                                });
                                            } else {
                                                setIsValidating(null);
                                                navigate(`/formaspagamento/cadastro/${result}`);
                                            }
                                        }
                                    });
                            } else {
                                FormasPagamentoService.updateById(Number(selectedId), { id: Number(selectedId), ...dadosValidados })
                                    .then((result) => {
                                        setIsLoading(false);
                                        if (result instanceof Error) {
                                            toast.error(result.message);
                                        } else {
                                            toast.success('Alterado com sucesso!');
                                            if (isSaveAndClose()) {
                                                if (isDialog) {
                                                    reloadDataTableIfDialog?.();
                                                    toggleOpen?.();
                                                }
                                                else {
                                                    navigate('/formaspagamento')
                                                } 
                                            } else {
                                                setIsValidating(null);
                                            }
                                        }
                                    });
                            }
                        } else {
                            if (id === 'novo') {
                                FormasPagamentoService.create(dadosValidados)
                                    .then((result) => {
                                        setIsLoading(false);
                                        if (result instanceof Error) {
                                            toast.error(result.message)
                                        } else {
                                            toast.success('Cadastrado com sucesso!')
                                            if (isSaveAndClose()) {
                                                if (isDialog) {
                                                    toggleOpen?.();
                                                }
                                                else {
                                                    navigate('/formaspagamento')
                                                }
                                                ;  
                                            } else if (isSaveAndNew()) {
                                                setIsValidating('');
                                                setIsValid(false);
                                                navigate('/formaspagamento/cadastro/novo');
                                                formRef.current?.setData({
                                                    descricao: ''
                                                });
                                            } else {
                                                setIsValidating(null);
                                                navigate(`/formaspagamento/cadastro/${result}`);
                                            }
                                        }
                                    });
                            } else {
                                FormasPagamentoService.updateById(Number(id), { id: Number(id), ...dadosValidados })
                                    .then((result) => {
                                        setIsLoading(false);
                                        if (result instanceof Error) {
                                            toast.error(result.message);
                                        } else {
                                            toast.success('Alterado com sucesso!');
                                            if (isSaveAndClose()) {
                                                navigate('/formaspagamento')
                                            } else {
                                                setIsValidating(null);
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
                    console.log(validationErrors);
                    formRef.current?.setErrors(validationErrors);
                })
    };

    const handleDelete = (id: number) => {

        if (window.confirm('Deseja apagar o registro?')) {
            FormasPagamentoService.deleteById(id)
                .then(result => {
                    if (result instanceof Error) {
                        toast.error(result.message);
                    } else {         
                        toast.success('Apagado com sucesso!')
                        navigate('/formasPagamento');
                    }
                })
        }
    }
    // #endregion

    // #region CONTROLLERS
    // #endregion

    return (
        <LayoutBase 
            titulo={!isDialog ? (id === 'novo' ? 'Cadastrar Forma de Pagamento' : 'Editar Forma de Pagamento') : ""}
            barraDeFerramentas={
                <DetailTools
                    mostrarBotaoSalvarFechar
                    mostrarBotaoSalvar={id == 'novo' && !isDialog}
                    mostrarBotaoSalvarNovo={id == 'novo' && !isDialog}
                    mostrarBotaoApagar={id !== 'novo' && !isDialog}
                    mostrarBotaoNovo={id !== 'novo' && !isDialog}
                    
                    onClickSalvar={save}
                    onClickSalvarNovo={saveAndNew}
                    onClickSalvarFechar={saveAndClose}
                    onClickApagar={() => handleDelete(Number(id))}
                    onClickNovo={() => navigate('/formaspagamento/cadastro/novo') }
                    onClickVoltar={() => {
                        if (isDialog) toggleOpen?.()
                        else navigate('/formaspagamento');
                    }}
                />
            }
        >
            <VForm ref={formRef} onSubmit={handleSave}>
                <Box margin={1} display="flex" flexDirection="column" component={Paper} variant="outlined" alignItems="center">
                    <Grid item container xs={12} sm={12} md={12} lg={8} xl={8} direction="column" padding={2} spacing={2}>

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
                                    name="descricao"
                                    label="Descrição"
                                    disabled={isLoading}
                                    inputProps={{
                                        endAdornment: (
                                            <InputAdornment position="start">
                                                { (isValidating && formRef.current?.getData().descricao) && (
                                                    <Box sx={{ display: 'flex' }}>
                                                        <CircularProgress size={24}/>
                                                    </Box>
                                                ) }
                                                { (!isValidating && formRef.current?.getData().descricao && isValid) && (
                                                    <Box sx={{ display: 'flex' }}>
                                                        <Icon color="success">done</Icon>
                                                    </Box>
                                                ) }
                                            </InputAdornment>
                                        )
                                    }}
                                    onChange={(e) => {
                                        setIsValid(false);
                                        setIsValidating('');
                                        console.log(id);
                                        formRef.current?.setFieldError('pais', '');
                                        debounce(() => {
                                            validate(e.target.value)
                                        })
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