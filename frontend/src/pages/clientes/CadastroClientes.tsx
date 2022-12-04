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
import { VTextField, VForm, useVForm, IVFormErrors, VAutocompleteSearch, VSelect, VCNPJMask, VNumberTextField, VCEPMask, VTelefoneMask, VCelularMask, VCPFMask, VRGMask, VDatePicker } from "../../shared/forms";
import { ICidades } from "../../shared/interfaces/entities/Cidades";
import { useDebounce } from "../../shared/hooks";
import { number } from "../../shared/utils/validations";
import ControllerClientes from "../../shared/controllers/ClientesController";
import ControllerCidades from "../../shared/controllers/CidadesController";
import { ConsultaCidades } from "../cidades/ConsultaCidades";
import ControllerCondicoesPagamento from "../../shared/controllers/CondicoesPagamentoController";
import { ConsultaCondicoesPagamento } from "../condicoesPagamento/ConsultaCondicoesPagamento";
import { ICadastroProps } from "../../shared/interfaces/views/Cadastro";
import { ICondicoesPagamento } from "../../shared/interfaces/entities/CondicoesPagamento";
import { IDetalhesClientes } from "../../shared/interfaces/entities/Clientes";
import dayjs, { Dayjs } from "dayjs";
// #endregion

// #region INTERFACES
interface IFormData {
    nmcliente: string;
    cpf: string;
    rg: string | undefined;
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
    nmcliente: yup.string().required(),
    cpf: yup.string().required(),
    rg: yup.string(),
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



export const CadastroClientes: React.FC<ICadastroProps> = ({isDialog = false, toggleOpen, selectedId, reloadDataTableIfDialog}) => {
    // #region CONTROLLERS
        const controller = new ControllerClientes();
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
    const [isValidating, setIsValidating] = useState<any>(null);
    const [isConsultaCidadesDialogOpen, setIsConsultaCidadesDialogOpen] = useState(false);
    const [isConsultaCondicoesPagamentoDialogOpen, setIsConsultaCondicoesPagamentoDialogOpen] = useState(false);
    const [cnpj, setCnpj] = useState("");
    const [clienteOriginal, setFornecedorOriginal] = useState<IDetalhesClientes | null>(null)
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
                            navigate('/clientes');
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
                            navigate('/clientes');
                        } else {
                            console.log(result);
                            let dtnasc = new Date(result.datanasc);
                            let datanasc = dayjs(dtnasc);
                            result.datacad = new Date(result.datacad).toLocaleString();
                            result.ultalt = new Date(result.ultalt).toLocaleString();
                            formRef.current?.setData(result);
                            formRef.current?.setFieldValue('datanasc', datanasc);
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

    useEffect(() => {
        if (cnpj != "") validate(cnpj);
    }, [cnpj]);

    const validate = (filter: string) => {
        debounce(() => {
            if (!isValid && filter != "" && (filter.toUpperCase() != clienteOriginal?.cpf)) {
                setIsValidating(true);
                debounce(() => {
                    controller.validate({
                        cpf: filter
                    })
                        .then((result) => {
                            setIsValidating(false);
                            if (result instanceof Error) {
                                toast.error(result.message);
                            } else {
                                setIsValid(result);
                                if (result === false) {
                                    const validationErrors: IVFormErrors = {};
                                    validationErrors['cpf'] = 'Já existe um cliente cadastrado com este CPF.';
                                    formRef.current?.setErrors(validationErrors);
                                }
                            }
                        })
                });        
            } else {
                setIsValid(true);
            }
        })
    }

    const handleSave = (dados: IFormData) => {
        if (!formRef.current?.getData().condicaopagamento) {
            const validationErrors: IVFormErrors = {}
            validationErrors['condicaopagamento'] = 'O campo é obrigatório'
            formRef.current?.setErrors(validationErrors);
            return;
        }
        formValidationSchema
            .validate(dados, { abortEarly: false })
                .then((dadosValidados) => {
                    if(isValid) {
                        setIsLoading(true);
                        let dtnasc: Dayjs = formRef.current?.getData().datanasc;
                        let datanasc = new Date(dtnasc.toISOString());
                        if (isDialog) {
                            if (selectedId == 0) {
                                controller.create({
                                    ...dadosValidados,
                                    datanasc: datanasc,
                                    flassociado: 'N',
                                    sexo: formRef.current?.getData().sexo,
                                    condicaopagamento: formRef.current?.getData().condicaopagamento,
                                })
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
                                                    navigate('/clientes')
                                                } 
                                            } else if (isSaveAndNew()) {
                                                setIsValid(false);
                                                navigate('/clientes/cadastro/novo');
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
                                                navigate(`/clientes/cadastro/${result}`);
                                            }
                                        }
                                    });
                            } else {
                                controller.update(Number(id), {
                                    ...dadosValidados,
                                    datanasc: datanasc,
                                    condicaopagamento: formRef.current?.getData().condicaopagamento,
                                    flsituacao: formRef.current?.getData().flsituacao,
                                    flassociado: clienteOriginal?.flassociado!,
                                    sexo: formRef.current?.getData().sexo,
                                })
                                    .then((result) => {
                                        setIsLoading(false);
                                        if (result instanceof Error) {
                                            toast.error(result.message);
                                        } else {
                                            toast.success('Alterado com sucesso!');
                                            if (isSaveAndClose()) {
                                                navigate('/clientes')
                                            } else {
                                            }
                                        }
                                    });
                            }
                        } else {
                            if (id === 'novo') {
                                controller.create({
                                    ...dadosValidados,
                                    datanasc: datanasc,
                                    flassociado: 'N',
                                    condicaopagamento: formRef.current?.getData().condicaopagamento,
                                    sexo: formRef.current?.getData().sexo,
                                })
                                    .then((result) => {
                                        setIsLoading(false);
                                        if (result instanceof Error) {
                                            toast.error(result.message)
                                        } else {
                                            toast.success('Cadastrado com sucesso!')
                                            if (isSaveAndClose()) {
                                                navigate('/clientes');
                                            } else if (isSaveAndNew()) {
                                                setIsValid(false);
                                                navigate('/clientes/cadastro/novo');
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
                                                navigate(`/clientes/cadastro/${result}`);
                                            }
                                        }
                                    });
                            } else {
                                controller.update(Number(id), {
                                    ...dadosValidados,
                                    datanasc: datanasc,
                                    condicaopagamento: formRef.current?.getData().condicaopagamento,
                                    flsituacao: formRef.current?.getData().flsituacao,
                                    flassociado: clienteOriginal?.flassociado!,
                                    sexo: formRef.current?.getData().sexo,
                                })
                                    .then((result) => {
                                        setIsLoading(false);
                                        if (result instanceof Error) {
                                            toast.error(result.message);
                                        } else {
                                            toast.success('Alterado com sucesso!');
                                            if (isSaveAndClose()) {
                                                navigate('/clientes')
                                            } else {
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
                        validationErrors[error.path] = error.message;
                    });
                    validationErrors['cidade'] = 'O campo é obrigatório'
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
                        navigate('/clientes');
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
            titulo={id === 'novo' ? 'Cadastrar Cliente' : 'Editar Cliente'}
            barraDeFerramentas={
                <DetailTools
                mostrarBotaoSalvarFechar
                // mostrarBotaoSalvar={!isDialog}
                mostrarBotaoSalvarNovo={id == 'novo' && !isDialog}
                mostrarBotaoApagar={id !== 'novo' && !isDialog}
                mostrarBotaoNovo={id !== 'novo' && !isDialog}
                
                disableButtons={isValidating}

                onClickSalvar={save}
                onClickSalvarNovo={saveAndNew}
                onClickSalvarFechar={saveAndClose}
                onClickApagar={() => handleDelete(Number(id))}
                onClickNovo={() => navigate('/clientes/cadastro/novo') }
                onClickVoltar={() => {
                    if (isDialog) {
                        toggleOpen?.();
                    } else {
                        navigate('/clientes') 
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
                                        name='nmcliente' 
                                        label="Nome Completo"
                                        disabled={isLoading}  
                                    />
                                </Grid>

                                <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                    <VDatePicker
                                        disableFuture
                                        disabled={isLoading}
                                        name="datanasc"
                                        label="Data de Nascimento"
                                    />
                                </Grid>

                                <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                    <VTextField
                                        size="small"
                                        inputProps={{
                                            maxLength: 1
                                        }}
                                        required
                                        fullWidth
                                        name='sexo' 
                                        label="Sexo"
                                        disabled={isLoading}  
                                    />
                                </Grid>

                                <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
                                    <VCPFMask
                                        inputProps={
                                            <InputAdornment position="end">
                                                { (isValidating && formRef.current?.getData().cpf) && (
                                                    <Box sx={{ display: 'flex' }}>
                                                        <CircularProgress size={24}/>
                                                    </Box>
                                                ) }
                                                { (isValid && formRef.current?.getData().cpf) && (
                                                    <Box sx={{ display: 'flex' }}>
                                                        <Icon color="success">done</Icon>
                                                    </Box>
                                                ) }
                                            </InputAdornment>
                                        }
                                        size="small"
                                        required
                                        fullWidth
                                        name='cpf' 
                                        label="CPF"
                                        disabled={isLoading}  
                                        onBlur={e => {
                                            setIsValidating(false);
                                        }}
                                        onChange={(e) => {
                                            setIsValid(false);
                                            setIsValidating(false);
                                            formRef.current?.setFieldError('cpf', '');
                                            validate(e.target.value);
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
                                    <VRGMask
                                        size="small"
                                        required
                                        fullWidth
                                        name='rg' 
                                        label="RG"
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
                                    <VCEPMask
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
                                    <VNumberTextField
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
                                        <VTelefoneMask
                                            size="small"
                                            required
                                            fullWidth
                                            name='telefone' 
                                            label="Telefone"
                                            disabled={isLoading}  
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
                                        <VCelularMask
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