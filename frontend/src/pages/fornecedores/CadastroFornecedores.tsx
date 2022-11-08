// #region EXTERNAL IMPORTS
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, CircularProgress, Collapse, Grid, Icon, IconButton, InputAdornment, LinearProgress, MenuItem, Paper, Tab, Tabs, Typography } from "@mui/material";
import * as yup from 'yup';
import { toast } from "react-toastify";
// #endregion

// #region INTERNAL IMPORTS
import { CustomDialog, DetailTools } from "../../shared/components";
import { LayoutBase } from "../../shared/layouts";
import { VTextField, VForm, useVForm, IVFormErrors, VAutocompleteSearch, VSelect } from "../../shared/forms";
import { ICidades } from "../../shared/interfaces/entities/Cidades";
import { useDebounce } from "../../shared/hooks";
import { number } from "../../shared/utils/validations";
import ControllerFornecedores from "../../shared/controllers/FornecedoresController";
import ControllerCidades from "../../shared/controllers/CidadesController";
import { ConsultaCidades } from "../cidades/ConsultaCidades";
import ControllerCondicoesPagamento from "../../shared/controllers/CondicoesPagamentoController";
import { ConsultaCondicoesPagamento } from "../condicoesPagamento/ConsultaCondicoesPagamento";
import { ICadastroProps } from "../../shared/interfaces/views/Cadastro";
import { ICondicoesPagamento } from "../../shared/interfaces/entities/CondicoesPagamento";
// #endregion

// #region INTERFACES
interface IFormData {
    razsocial: string;
    nmfantasia: string | undefined;
    cnpj: string;
    inscestadual: string;
    telefone: string | undefined;
    celular: string | undefined;
    email: string | undefined;
    cep: string;
    endereco: string;
    numend: string;
    bairro: string;
    cidade: ICidades;
}
// #endregion

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
    razsocial: yup.string().required(),
    nmfantasia: yup.string(),
    cnpj: yup.string().required().max(20).matches(number, 'Apenas números são aceitos neste campo.'),
    inscestadual: yup.string().required(),
    email: yup.string(),
    telefone: yup.string().matches(number, 'Apenas números são aceitos neste campo.'),
    celular: yup.string().matches(number, 'Apenas números são aceitos neste campo.'),
    cep: yup.string().matches(number, 'Apenas números são aceitos neste campo.').required(),
    endereco: yup.string().required(),
    numend: yup.string().matches(number, 'Apenas números são aceitos neste campo.').required(),
    bairro: yup.string().required(),
    cidade: yup.object().shape({
        id: yup.number(),
        cidade: yup.string(),
        estado: yup.object().shape({
            id: yup.number(),
            estado: yup.string(),
            uf: yup.string(),
            pais: yup.object({
                id: yup.number(),
                pais: yup.string(),
                sigla: yup.string()
            }),
        })
    }).required(),
})



export const CadastroFornecedores: React.FC<ICadastroProps> = ({isDialog = false, toggleOpen, selectedId, reloadDataTableIfDialog}) => {
    // #region CONTROLLERS
        const controller = new ControllerFornecedores();
        const controllerCidades = new ControllerCidades();
        const controllerCondicoesPagamento = new ControllerCondicoesPagamento();
    // #endregion

    // #region HOOKS
    const { id = 'novo' } = useParams<'id'>();
    const navigate = useNavigate();
    const { formRef, save, saveAndNew, saveAndClose, isSaveAndNew, isSaveAndClose } = useVForm();
    const { debounce } = useDebounce();
    // #endregion

    // #region STATES
    const [isLoading, setIsLoading] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [isConsultaCidadesDialogOpen, setIsConsultaCidadesDialogOpen] = useState(false);
    const [isConsultaCondicoesPagamentoDialogOpen, setIsConsultaCondicoesPagamentoDialogOpen] = useState(false);
    // #endregion

    // #region ACTIONS
    useEffect(() => {
        if (isDialog) {
            if (selectedId !== 0) {
                setIsLoading(true);
                controller.getOne(Number(selectedId))
                    .then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            toast.error(result.message);
                            navigate('/fornecedores');
                        } else {
                            result.datacad = new Date(result.datacad).toLocaleString();
                            result.ultalt = new Date(result.ultalt).toLocaleString();
                            formRef.current?.setData(result);
                            setIsValid(true);
                        }
                    });
            } else {
                formRef.current?.setData({
                    razSocial: '',
                    cnpj: '',
                    nomeFantasia: '',
                    telefone: '',
                    endereco: '',
                    numEnd: '',
                    bairro: '',
                    cidade: null
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
                            navigate('/fornecedores');
                        } else {
                            result.datacad = new Date(result.datacad).toLocaleString();
                            result.ultalt = new Date(result.ultalt).toLocaleString();
                            formRef.current?.setData(result);
                            setIsValid(true);
                        }
                    });
            } else {
                formRef.current?.setData({
                    razSocial: '',
                    cnpj: '',
                    nomeFantasia: '',
                    telefone: '',
                    endereco: '',
                    numEnd: '',
                    bairro: '',
                    cidade: null
                });
            }
        }
    }, [id]);

    const handleSave = (dados: IFormData) => {
        formValidationSchema
            .validate(dados, { abortEarly: false })
                .then((dadosValidados) => {
                    if(isValid) {
                        setIsLoading(true);
                        if (id === 'novo') {
                            controller.create({
                                ...dadosValidados,
                                condicaopagamento: formRef.current?.getData().condicaopagamento,
                            })
                                .then((result) => {
                                    setIsLoading(false);
                                    if (result instanceof Error) {
                                        toast.error(result.message)
                                    } else {
                                        toast.success('Cadastrado com sucesso!')
                                        if (isSaveAndClose()) {
                                            navigate('/fornecedores');
                                        } else if (isSaveAndNew()) {
                                            setIsValid(false);
                                            navigate('/fornecedores/cadastro/novo');
                                            formRef.current?.setData({
                                                razSocial: '',
                                                nomeFantasia: '',
                                                cnpj: '',
                                                telefone: '',
                                                endereco: '',
                                                numero: '',
                                                bairro: '',
                                                cidade: null
                                            });
                                        } else {
                                            navigate(`/fornecedores/cadastro/${result}`);
                                        }
                                    }
                                });
                        } else {
                            controller.update(Number(id), {
                                ...dadosValidados,
                                condicaopagamento: formRef.current?.getData().condicaopagamento,
                                flsituacao: formRef.current?.getData().flsituacao
                            })
                                .then((result) => {
                                    setIsLoading(false);
                                    if (result instanceof Error) {
                                        toast.error(result.message);
                                    } else {
                                        toast.success('Alterado com sucesso!');
                                        if (isSaveAndClose()) {
                                            navigate('/fornecedores')
                                        } else {
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
                    validationErrors['cidade'] = 'O campo é obrigatório'
                    console.log(validationErrors);
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
                        navigate('/fornecedores');
                    }
                })
        }
    }

    const toggleConsultaCidadesDialogOpen = () => {
        setIsConsultaCidadesDialogOpen(oldValue => !oldValue);
    }

    const toggleConsultaCondicoesPagamentoDialogOpen = () => {
        setIsConsultaCondicoesPagamentoDialogOpen(oldValue => !oldValue);
    }
    // #endregion

    return (
        <LayoutBase 
            titulo={id === 'novo' ? 'Cadastrar Fornecedor' : 'Editar Fornecedor'}
            barraDeFerramentas={
                <DetailTools
                mostrarBotaoSalvarFechar
                // mostrarBotaoSalvar={!isDialog}
                mostrarBotaoSalvarNovo={id == 'novo' && !isDialog}
                mostrarBotaoApagar={id !== 'novo' && !isDialog}
                mostrarBotaoNovo={id !== 'novo' && !isDialog}
                    
                    onClickSalvar={save}
                    onClickSalvarNovo={saveAndNew}
                    onClickSalvarFechar={saveAndClose}
                    onClickApagar={() => handleDelete(Number(id))}
                    onClickNovo={() => navigate('/fornecedores/cadastro/novo') }
                    onClickVoltar={() => {
                        if (isDialog) {
                            toggleOpen?.();
                        } else {
                            navigate('/fornecedores') 
                        }
                    }}
                />
            }
        >
            <VForm ref={formRef} onSubmit={handleSave}>
                <Box margin={1} display="flex" flexDirection="column" component={Paper} alignItems="center">
                    <Grid item container xs={12} sm={10} md={6} lg={5} xl={5} direction="column" padding={2} spacing={2} alignItems="left">

                        {isLoading && (
                            <Grid item>
                                <LinearProgress variant="indeterminate"/>
                            </Grid>
                        )}
                        
                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={10} lg={10} xl={8}>
                                <Typography variant="h6">Dados Gerais</Typography>
                            </Grid>
                            { id != "novo" && (
                                <Grid container item xs={12} sm={12} md={2} lg={2} xl={4} alignItems="center" justifyContent="right">
                                    <Typography marginRight="4px" variant="subtitle1">Situação</Typography>
                                    <VSelect
                                        name="flsituacao"
                                        size="small"
                                    >
                                        <MenuItem value="A">ATIVO</MenuItem>
                                        <MenuItem value="I">INATIVO</MenuItem>
                                    </VSelect>
                                </Grid>
                            ) }
                        </Grid>

                            <Grid container item direction="row" spacing={2}>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <VTextField
                                        size="small"
                                        required
                                        fullWidth
                                        name='razsocial' 
                                        label="Razão Social"
                                        disabled={isLoading}  
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <VTextField
                                        size="small"
                                        required
                                        fullWidth
                                        name='nmfantasia' 
                                        label="Nome Fantasia"
                                        disabled={isLoading}  
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
                                    <VTextField
                                        size="small"
                                        required
                                        fullWidth
                                        name='cnpj' 
                                        label="CNPJ"
                                        disabled={isLoading}  
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
                                    <VTextField
                                        size="small"
                                        required
                                        fullWidth
                                        name='inscestadual' 
                                        label="Inscrição Estadual"
                                        disabled={isLoading}  
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <VAutocompleteSearch
                                        size="small"
                                        required
                                        name="condicaopagamento"
                                        label={["descricao"]}
                                        TFLabel="Condição de Pagamento"
                                        getAll={controllerCondicoesPagamento.getAll}
                                        // onChange={(e) => {
                                        //     setCondicaoPagamento(e.target.value);
                                        // }}
                                        onClickSearch={() => {
                                            toggleConsultaCondicoesPagamentoDialogOpen();
                                        }}
                                        onInputchange={() => {
                                            formRef.current?.setFieldError('condicaopagamento', '');
                                        }}
                                        isDialogOpen={isConsultaCondicoesPagamentoDialogOpen}
                                    />
                                </Grid>
                            </Grid>
                        
                            <Grid item>
                                <Typography variant="h6">Endereço</Typography>
                            </Grid>

                            <Grid container item direction="row" spacing={2}>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={3}>
                                    <VTextField
                                        size="small"
                                        required
                                        fullWidth
                                        name='cep' 
                                        label="CEP"
                                        disabled={isLoading}  
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
                                    <VTextField
                                        size="small"
                                        required
                                        fullWidth
                                        name='endereco' 
                                        label="Endereço"
                                        disabled={isLoading}  
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={3}>
                                    <VTextField
                                        size="small"
                                        required
                                        fullWidth
                                        name='numend' 
                                        label="Número"
                                        disabled={isLoading}  
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <VTextField
                                        size="small"
                                        required
                                        fullWidth
                                        name='bairro' 
                                        label="Bairro"
                                        disabled={isLoading}  
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <VAutocompleteSearch
                                        size="small"
                                        required
                                        name="cidade"
                                        label={["nmcidade", "estado.uf", "estado.pais.nmpais"]}
                                        TFLabel="Cidade"
                                        getAll={controllerCidades.getAll}
                                        onInputchange={() => {
                                            formRef.current?.setFieldError('nmcidade', '');
                                        }}
                                        onClickSearch={toggleConsultaCidadesDialogOpen}
                                        isDialogOpen={isConsultaCidadesDialogOpen}
                                    />
                                </Grid>
                            </Grid>  

                            <Grid item>
                                <Typography variant="h6">Informações para contato</Typography>
                            </Grid>

                            <Grid container item direction="row" spacing={2}>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
                                        <VTextField
                                            size="small"
                                            required
                                            fullWidth
                                            name='telefone' 
                                            label="Telefone"
                                            disabled={isLoading}  
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
                                        <VTextField
                                            size="small"
                                            required
                                            fullWidth
                                            name='celular' 
                                            label="Celular"
                                            disabled={isLoading}  
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <VTextField
                                            size="small"
                                            required
                                            fullWidth
                                            name='email' 
                                            label="E-mail"
                                            disabled={isLoading}  
                                        />
                                    </Grid>
                                </Grid>  
                    </Grid>
                    <CustomDialog
                        onClose={toggleConsultaCidadesDialogOpen}
                        handleClose={toggleConsultaCidadesDialogOpen}
                        open={isConsultaCidadesDialogOpen}
                        title="Consultar Cidades"
                        fullWidth
                        maxWidth="xl"
                    >
                        <ConsultaCidades
                            isDialog
                            onSelectItem={(row) => {
                                formRef.current?.setFieldValue("cidade", row);
                                formRef.current?.setFieldError('cidade', '');
                                //setEstado(row);
                            }}
                            toggleDialogOpen={toggleConsultaCidadesDialogOpen}
                        />
                    </CustomDialog>

                    <CustomDialog
                        onClose={toggleConsultaCondicoesPagamentoDialogOpen}
                        handleClose={toggleConsultaCondicoesPagamentoDialogOpen}
                        open={isConsultaCondicoesPagamentoDialogOpen}
                        title="Consultar Condições de Pagamento"
                        fullWidth
                        maxWidth="xl"
                    >
                        <ConsultaCondicoesPagamento
                            isDialog
                            onSelectItem={(row) => {
                                formRef.current?.setFieldValue("condicaopagamento", row);
                                formRef.current?.setFieldError('condicaopagamento', '');
                            }}
                            toggleDialogOpen={toggleConsultaCondicoesPagamentoDialogOpen}
                        />
                    </CustomDialog>
                </Box>
            </VForm>
        </LayoutBase>
    )

}