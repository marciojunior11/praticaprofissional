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
import { IDetalhesPaises, IPaises } from "../../shared/interfaces/entities/Paises";
import { VTextField, VForm, useVForm, IVFormErrors, VAutocompleteSearch, VNumberInput, VIntegerNumberInput, VMoneyInput } from "../../shared/forms"
import { useDebounce } from "../../shared/hooks";
import ControllerPaises from "../../shared/controllers/PaisesController";
import { ICadastroProps } from "../../shared/interfaces/views/Cadastro";
import ControllerClientes from "../../shared/controllers/ClientesController";
import { IClientes } from "../../shared/interfaces/entities/Clientes";
import { ICondicoesPagamento } from "../../shared/interfaces/entities/CondicoesPagamento";
import ControllerCondicoesPagamento from "../../shared/controllers/CondicoesPagamentoController";
import { Environment } from "../../shared/environment";
import { IContasReceber } from "../../shared/interfaces/entities/ContasReceber";
import { DataTable, IHeaderProps } from "../../shared/components/data-table/DataTable";
import { IDetalhesContratos } from "../../shared/interfaces/entities/Contratos";
import ControllerContratos from "../../shared/controllers/ContratosController";
// #endregion

// #region INTERFACES
interface IFormData {
    qtdmeses: number;
}
// #endregion

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
    qtdmeses: yup.number().required()
})

export const CadastroContratos: React.FC<ICadastroProps> = ({isDialog = false, toggleOpen, selectedId, reloadDataTableIfDialog}) => {
    // #region CONTROLLERS
    const controller = new ControllerContratos();
    const controllerClientes = new ControllerClientes();
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
    const [objCliente, setObjCliente] = useState<IClientes | null>(null);
    const [condicaoPagamento, setCondicaoPagamento] = useState<ICondicoesPagamento | null>(null);
    const [qtd, setQtd] = useState(0);
    const [vlUnitario, setVlUnitario] = useState(Environment.VALOR_CONTRATO);
    const [listaContasReceber, setListaContasReceber] = useState<IContasReceber[]>([]);
    const [isConsultaClientesDialogOpen, setIsConsultaClientesDialogOpen] = useState(false);
    const [isConsultaCondicoesPagamentoDialogOpen, setIsConsultaCondicoesPagamentoDialogOpen] = useState(false);
    // #endregion

    // #region ACTIONS
    const toggleConsultaClientesDialogOpen = () => {
        setIsConsultaClientesDialogOpen(oldValue => !oldValue);
    }

    const toggleConsultaCondicoesPagamentoDialogOpen = () => {
        setIsConsultaCondicoesPagamentoDialogOpen(oldValue => !oldValue);
    }

    const headersContasReceber: IHeaderProps[] = [
        {
            name: 'nrparcela',
            label: 'Nr. Parcela',
            align: 'right',
        },
        {
            name: 'percparcela',
            label: 'Perc. Parcela',
            align: 'left',
            render: (row) => {
                return (
                    `${row.percparcela}%`
                )
            }
        },
        {
            name: 'dtvencimento',
            label: 'Vencimento',
            align: 'left',
            render: (row) => {
                return (
                    new Date(row.dtvencimento).toLocaleDateString()
                )
            }
        },
        {
            name: 'formapagamento.descricao',
            label: 'Forma de Pagamento',
            align: 'center',
        },
        {
            name: 'vltotal',
            label: 'Valor',
            align: 'center',
            render: (row) => {
                return (
                    new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }).format(row.vltotal)
                )
            }
        }
    ];

    const calcularFooterValorContasPagar = (): string => {
        var total = 0;
        listaContasReceber.forEach(item => {
            total = total + item.vltotal
        })
        return new Intl.NumberFormat('pr-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(total);
    }

    useEffect(() => {
        formRef.current?.setFieldValue('total', parseFloat((vlUnitario*qtd).toFixed(2)));        
    }, [vlUnitario, qtd])

    const gerarContasPagar = () => {
        const listaParcelas = condicaoPagamento?.listaparcelas;
        const mArray: Array<IContasReceber> = [];
        const dataemissao = new Date();

        var totalContrato = formRef.current?.getData().total;
        var totalContasPagar = 0;

        listaParcelas?.forEach((item, index) => {
            let dtvencimento = new Date();
            dtvencimento.setDate(dataemissao.getDate() + item.dias);
            let valor = totalContrato * (item.percentual/100)
            totalContasPagar = totalContasPagar + valor;
            if (index + 1 == listaParcelas?.length) {
                if (totalContasPagar < totalContrato) {
                    let diferenca = totalContrato - totalContasPagar;
                    totalContasPagar = totalContasPagar + (totalContrato - totalContasPagar);
                    valor = valor + diferenca;
                } else {
                    let diferenca = totalContrato - totalContasPagar;
                    totalContasPagar = totalContasPagar - (totalContasPagar - totalContrato);
                    valor = valor - diferenca;
                }
            }
            let contareceber: IContasReceber = {
                nrparcela: item.numero,
                percparcela: item.percentual,
                dtvencimento: dtvencimento,
                vltotal: parseFloat(Number(valor).toFixed(2)),
                txdesc: condicaoPagamento!.txdesc,
                txmulta: condicaoPagamento!.txmulta,
                txjuros: condicaoPagamento!.txjuros,
                observacao: `Contrato a Receber - Parcela ${item.numero} de ${index + 1} referente ao mês ${dtvencimento.getMonth() + 1}/${dtvencimento.getFullYear()}`,
                cliente: objCliente!,
                florigem: 'C',
                formapagamento: {
                    ...item.formapagamento,
                    datacad: new Date(),
                    ultalt: new Date()
                },
                flsituacao: 'A',
                datacad: new Date(),
                ultalt: new Date()
            }
            mArray.push(contareceber);
        });
        setListaContasReceber(mArray);
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
                            navigate('/contratos')
                        } else {
                            formRef.current?.setData(result);
                        }
                    })
            } else {
                setQtd(0);
                formRef.current?.setData({
                    cliente: null,
                    qtd: 0,
                    condicaoPagamento: null
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
                        navigate('/contratos');
                    } else {
                        result.datacad = new Date(result.datacad).toLocaleString();
                        result.ultalt = new Date(result.ultalt).toLocaleString();
                        formRef.current?.setData(result);
                    }
                });
            } else {
                setQtd(0);
                formRef.current?.setData({
                    cliente: null,
                    qtd: 0,
                    condicaoPagamento: null
                });
            }
        }
    }, [id]);

    const handleSave = (dados: IFormData) => {
        var errors = false;
        if (!objCliente) {
            errors = true;
        }
        if (!qtd) {
            errors = true;
        }
        if (!condicaoPagamento) {
            errors = true;
        }
        if (listaContasReceber.length === 0) {
            errors = true;
        }
        if (errors) {
            const validationErrors: IVFormErrors = {};

            toast.error('Verifique os erros.');

            if (!objCliente) {
                validationErrors['cliente'] = 'Selecione um cliente.';
            }
            if (!qtd) {
                validationErrors['qtd'] = 'Informe a quantidade de meses.';
            }
            if (!condicaoPagamento) {
                validationErrors['condicaopagamento'] = 'Selecione a Condição de Pagamento.';
            }
            if (listaContasReceber.length === 0) {
                toast.error('É necessário gerar contas a receber antes de salvar.');
            }
            formRef.current?.setErrors(validationErrors);

        } else {
            formValidationSchema
                .validate(dados, { abortEarly: false })
                    .then((dadosValidados) => {
                        let datavalidade = new Date();
                        datavalidade.setMonth(datavalidade.getMonth() + qtd);
                        setIsLoading(true);
                        if (isDialog) {
                            if (selectedId === 0) {
                                controller.create({
                                    ...dadosValidados,
                                    cliente: objCliente!,
                                    condicaopagamento: condicaoPagamento!,
                                    listacontasreceber: listaContasReceber,
                                    vltotal: formRef.current?.getData().total,
                                    datavalidade: datavalidade,
                                    flsituacao: 'V'
                                })
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
                                controller.update(Number(id), {
                                    ...dadosValidados,
                                    cliente: objCliente!,
                                    condicaopagamento: condicaoPagamento!,
                                    listacontasreceber: listaContasReceber,
                                    vltotal: formRef.current?.getData().total,
                                    datavalidade: datavalidade,
                                    flsituacao: 'V'
                                })
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
                                controller.create({
                                    ...dadosValidados,
                                    cliente: objCliente!,
                                    condicaopagamento: condicaoPagamento!,
                                    listacontasreceber: listaContasReceber,
                                    vltotal: formRef.current?.getData().total,
                                    datavalidade: datavalidade,
                                    flsituacao: 'V'
                                })
                                    .then((result) => {
                                        setIsLoading(false);
                                        if (result instanceof Error) {
                                            toast.error(result.message)
                                        } else {
                                            toast.success('Cadastrado com sucesso!')
                                            if (isSaveAndClose()) {
                                                navigate('/contratos');
                                            } else if (isSaveAndNew()) {
                                                navigate('/contratos/cadastro/novo');
                                                setQtd(0);
                                                formRef.current?.setData({
                                                    cliente: null,
                                                    qtd: 0,
                                                    condicaoPagamento: null
                                                });
                                            } else {
                                                navigate(`/contratos/cadastro/${result}`);
                                            }
                                        }
                                    });
                            } else {
                                controller.update(Number(id), {
                                    ...dadosValidados,
                                    cliente: objCliente!,
                                    condicaopagamento: condicaoPagamento!,
                                    listacontasreceber: listaContasReceber,
                                    vltotal: formRef.current?.getData().total,
                                    datavalidade: datavalidade,
                                    flsituacao: 'V'
                                })
                                .then((result) => {
                                    setIsLoading(false);
                                    if (result instanceof Error) {
                                        toast.error(result.message);
                                    } else {
                                        toast.success('Alterado com sucesso!');
                                        if (isSaveAndClose()) {
                                            navigate('/contratos')
                                        } else {
                                        }
                                    }
                                });
                            }
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
        }
    };

    const handleDelete = (id: number) => {

        if (window.confirm('Deseja apagar o registro?')) {
            controller.delete(id)
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

    return (
        <LayoutBase 
            titulo={id === 'novo' ? 'Cadastrar Contrato' : 'Editar Contrato'}
            barraDeFerramentas={
                <DetailTools
                    mostrarBotaoSalvarFechar
                    mostrarBotaoSalvar={!isDialog}
                    mostrarBotaoSalvarNovo={false}
                    mostrarBotaoApagar={id !== 'novo' && !isDialog}
                    mostrarBotaoNovo={id !== 'novo' && !isDialog}

                    disableButtons={false}

                    onClickSalvar={save}
                    onClickSalvarNovo={saveAndNew}
                    onClickSalvarFechar={saveAndClose}
                    onClickApagar={() => handleDelete(Number(id))}
                    onClickNovo={() => navigate('/contratos/cadastro/novo') }
                    onClickVoltar={() => {
                        if (isDialog) {
                            toggleOpen?.();
                        } else {
                            navigate('/contratos');
                        }
                    }}
                />
            }
        >
            <VForm ref={formRef} onSubmit={handleSave}>
                <Box margin={1} display="flex" flexDirection="column" component={Paper} alignItems="center">
                    <Grid item container xs={12} sm={12} md={10} lg={8} xl={6} direction="column" padding={2} spacing={2} alignItems="left">
                        {isLoading && (
                            <Grid item>
                                <LinearProgress variant="indeterminate"/>
                            </Grid>
                        )}

                        <Grid item>
                            <Typography variant="h6">Dados Gerais</Typography>
                        </Grid>

                        <Grid container item direction="row" spacing={2} justifyContent="center">
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <VAutocompleteSearch
                                    size="small"
                                    required
                                    name="cliente"
                                    label={["nmcliente"]}
                                    TFLabel="Cliente"
                                    disabled={isLoading || listaContasReceber.length > 0}
                                    getAll={controllerClientes.getAll}
                                    onChange={(value: IClientes) => {
                                        setObjCliente(value);
                                        formRef.current?.setFieldError('cliente', '');
                                    }}
                                    onInputchange={() => {
                                        formRef.current?.setFieldError('cliente', '');
                                    }}
                                    onClickSearch={toggleConsultaClientesDialogOpen}
                                    isDialogOpen={isConsultaClientesDialogOpen}
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2} justifyContent="center">
                            <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                                <VIntegerNumberInput
                                    disabled={isLoading || listaContasReceber.length > 0}
                                    size="small"
                                    fullWidth
                                    name="qtd"
                                    label="Qtd. Meses"
                                    onChange={e => {
                                        setQtd(Number(e.target.value));
                                    }}
                                />
                            </Grid>

                            <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                                <VMoneyInput
                                    disabled={isLoading || listaContasReceber.length > 0}
                                    inputProps={{
                                        readOnly: true
                                    }}
                                    size="small"
                                    fullWidth
                                    name="valor"
                                    label="Valor Contrato"
                                    initialValue={vlUnitario}
                                />  
                            </Grid>

                            <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                                <VMoneyInput
                                    disabled={isLoading || listaContasReceber.length > 0}
                                    inputProps={{
                                        readOnly: true
                                    }}
                                    size="small"
                                    fullWidth
                                    name="total"
                                    label="Vl. Total"
                                    initialValue={0}
                                />  
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2} justifyContent="left">
                            <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                                <VAutocompleteSearch
                                    disabled={isLoading || listaContasReceber.length > 0}
                                    size="small"
                                    name="condicaopagamento"
                                    label={["descricao"]}
                                    TFLabel="Condição de Pagamento"
                                    getAll={controllerCondicoesPagamento.getAll}
                                    onChange={(value) => {
                                        setCondicaoPagamento(value);
                                        formRef.current?.setFieldError('condicaopagamento', '');
                                    }}
                                    onInputchange={() => {
                                        formRef.current?.setFieldError('condicaopagamento', '');
                                    }}
                                    onClickSearch={toggleConsultaCondicoesPagamentoDialogOpen}
                                    isDialogOpen={isConsultaCondicoesPagamentoDialogOpen}
                                />
                            </Grid>
                            { listaContasReceber.length === 0 ? (
                                <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                                    <Button
                                        disabled={isLoading || listaContasReceber.length > 0 || !qtd || !condicaoPagamento}
                                        variant="contained" 
                                        color="primary"
                                        size="large"
                                        fullWidth
                                        onClick={e => {
                                            if (!qtd) {
                                                formRef.current?.setFieldError('qtd', 'Insira uma quantidade maior que zero.');
                                                toast.error('Insira uma quantidade maior que zero.')
                                            } else {
                                                if (window.confirm('Deseja gerar contas a pagar? Esta operação bloqueia os campos.')) {
                                                    gerarContasPagar();
                                                }
                                            }
                                        }}
                                    >
                                        GERAR
                                    </Button>
                                </Grid>
                            ) : (
                                <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                                    <Button
                                        disabled={isLoading}
                                        variant="contained" 
                                        color="error"
                                        size="large"
                                        fullWidth
                                        onClick={e => {
                                            setListaContasReceber([]);
                                        }}
                                    >
                                        <Icon>close</Icon>
                                    </Button>
                                </Grid>                                
                            )}
                        </Grid>

                        <Grid item>
                            <Typography variant="h6">Contas a Receber</Typography>
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={4} xl={6}>
                            <DataTable
                                rowCount={listaContasReceber.length}
                                headers={headersContasReceber}
                                rows={listaContasReceber}
                                rowId="nrparcela"
                                footer
                                footerValue={<Typography variant="h6">{calcularFooterValorContasPagar()}</Typography>}
                                footerLabel={<Typography variant="h6">Total:</Typography>}
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
                </Box>
            </VForm>
        </LayoutBase>
    )

}