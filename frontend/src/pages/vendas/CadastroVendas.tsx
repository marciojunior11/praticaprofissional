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
import { IDetalhesVendas, IVendas, IValidator } from "../../shared/interfaces/entities/Vendas";
import { VTextField, VForm, useVForm, IVFormErrors, VAutocompleteSearch, VDatePicker, VNumberTextField, VNumberInput } from "../../shared/forms"
import { useDebounce } from "../../shared/hooks";
import ControllerVendas from "../../shared/controllers/VendasController";
import { IClientes } from "../../shared/interfaces/entities/Clientes";
import ControllerClientes from "../../shared/controllers/ClientesController";
import { ConsultaClientes } from "../clientes/ConsultaClientes";
import ControllerProdutos from "../../shared/controllers/ProdutosController";
import { ConsultaProdutos } from "../produtos/ConsultaProdutos";
import { IProdutosNF } from "../../shared/interfaces/entities/ProdutosNF";
import { DataTable, IHeaderProps } from "../../shared/components/data-table/DataTable";
import { VMoneyInput } from "../../shared/forms/VMoneyInput";
import ControllerCondicoesPagamento from "../../shared/controllers/CondicoesPagamentoController";
import { ConsultaCondicoesPagamento } from "../condicoesPagamento/ConsultaCondicoesPagamento";
import { IContasReceber } from "../../shared/interfaces/entities/ContasReceber";
import { Dayjs } from "dayjs";
import { ICondicoesPagamento } from "../../shared/interfaces/entities/CondicoesPagamento";
import { ICadastroProps } from "../../shared/interfaces/views/Cadastro";
// #endregion

// #region INTERFACES
interface IFormData {

}
// #endregion

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({

})

export const CadastroVendas: React.FC<ICadastroProps> = ({isDialog = false, toggleOpen, selectedId, reloadDataTableIfDialog}) => {
    // #region CONTROLLERS
    const controller = new ControllerVendas();
    const controllerClientes = new ControllerClientes();
    const controllerProdutos = new ControllerProdutos();
    const controllerCondicoesPagamento = new ControllerCondicoesPagamento();
    // #endregion
   
    // #region HOOKS
    const { id = 'novo' } = useParams<'id'>();
    const navigate = useNavigate();
    const { formRef, save, saveAndNew, saveAndClose, isSaveAndNew, isSaveAndClose } = useVForm();
    const { debounce } = useDebounce();
    // #endregion

    // #region STATES
    const [isConsultaClientesDialogOpen, setIsConsultaClientesDialogOpen] = useState(false);
    const [isConsultaProdutosDialogOpen, setIsConsultaProdutosDialogOpen] = useState(false);
    const [isConsultaCondicoesPagamentoDialogOpen, setIsConsultaCondicoesPagamentoDialogOpen] = useState(false);
    const [listaProdutosNF, setListaProdutosNF] = useState<IProdutosNF[]>([]);
    const [listaContasReceber, setListaContasReceber] = useState<IContasReceber[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isValidating, setIsValidating] = useState<boolean>(false);
    const [isEditingProduto, setIsEditingProduto] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [objCliente, setObjCliente] = useState<IClientes | null>(null);
    const [vendaOriginal, setVendaOriginal] = useState<IVendas | null>(null);
    const [produto, setProduto] = useState<IProdutosNF | null>(null);
    const [condicaoPagamento, setCondicaoPagamento] = useState<ICondicoesPagamento | null>(null);
    const [vlTotalProdutosNota, setVlTotalProdutosNota] = useState(0);
    const [vlTotalNota, setVlTotalNota] = useState(0);
    const [vlUnitario, setVlUnitario] = useState(0);
    const [qtd, setQtd] = useState(0);
    // #endregion

    // #region ACTIONS
    const toggleConsultaClientesDialogOpen = () => {
        setIsConsultaClientesDialogOpen(oldValue => !oldValue);
    }

    const toggleConsultaProdutosDialogOpen = () => {
        setIsConsultaProdutosDialogOpen(oldValue => !oldValue);
    }

    const toggleConsultaCondicoesPagamentoDialogOpen = () => {
        setIsConsultaCondicoesPagamentoDialogOpen(oldValue => !oldValue);
    }

    const headers: IHeaderProps[] = [
        {
            label: "ID",
            name: "id",
            align: "right",  
        },
        {
            label: "Descrição",
            name: "descricao",
            align: "left",
        },
        {
            label: "UND",
            name: "undmedida",
            align: "center",
        },
        {
            label: "Quantidade",
            name: "qtd",  
            align: "center",
        },
        {
            label: "Valor unitário",
            name: "vlvenda",
            align: "center",
            render: (row: IProdutosNF) => {
                return (
                    new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }).format(row.vlvenda)
                )
            }  
        },
        {
            label: "Total",
            name: "vltotal", 
            align: "center",
            render: (row: IProdutosNF) => {
                return (
                    new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }).format(row.vltotal)
                )
            }  
        },
        {
            label: "Ações",
            name: " ",
            align: "right",
            render: (row: IProdutosNF) => {
                return (
                    <>
                        <IconButton
                            disabled={isEditingProduto || listaContasReceber.length > 0} 
                            color="error" 
                            size="small" 
                            onClick={() => {
                                if (window.confirm('Deseja excluir este produto?')) {
                                    const mArray = listaProdutosNF.slice();
                                    const index = mArray.findIndex(item => item.id == row.id);
                                    insertProduto(true, index);
                                }
                            }}
                        >
                            <Icon>delete</Icon>
                        </IconButton>
                        <IconButton
                            disabled={isEditingProduto || listaContasReceber.length > 0} 
                            color="primary" 
                            size="small"
                            onClick={() => {
                                setIsEditingProduto(true);
                                formRef.current?.setFieldValue('produto', row);
                                formRef.current?.setFieldValue('valor', row.vlcompra);
                                formRef.current?.setFieldValue('qtd', row.qtd);
                                setProduto(row);
                                setVlUnitario(row.vlcompra);
                                setQtd(row.qtd);
                            }}
                        >
                            <Icon>edit</Icon>
                        </IconButton>
                    </>
                )
            }
        }
    ];

    const headersContasPagar: IHeaderProps[] = [
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

    useEffect(() => {
        formRef.current?.setFieldValue('total', parseFloat((vlUnitario*qtd).toFixed(2)));        
    }, [vlUnitario, qtd])

    const calcularFooterValue = (): string => {
        if (id != 'novo') {
            var total = vlTotalNota;
            return new Intl.NumberFormat('pr-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(total);           
        }

        var total = vlTotalProdutosNota;

        return new Intl.NumberFormat('pr-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(total);
    }

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

    const gerarContasPagar = () => {
        const listaParcelas = condicaoPagamento?.listaparcelas;
        const mArray: Array<IContasReceber> = [];
        const dataEmissao: Dayjs = formRef.current?.getData().dataemissao;
        const dtemissao = new Date(dataEmissao.toISOString());

        var totalNota = vlTotalProdutosNota;
        var totalContasPagar = 0;

        listaParcelas?.forEach((item, index) => {
            let dtvencimento = new Date();
            dtvencimento.setDate(dtemissao.getDate() + item.dias);
            let valor = totalNota * (item.percentual/100)
            totalContasPagar = totalContasPagar + valor;
            if (index + 1 == listaParcelas?.length) {
                if (totalContasPagar < totalNota) {
                    let diferenca = totalNota - totalContasPagar;
                    totalContasPagar = totalContasPagar + (totalNota - totalContasPagar);
                    valor = valor + diferenca;
                } else {
                    let diferenca = totalNota - totalContasPagar;
                    totalContasPagar = totalContasPagar - (totalContasPagar - totalNota);
                    valor = valor - diferenca;
                }
            }
            let contapagar: IContasReceber = {
                nrparcela: item.numero,
                percparcela: item.percentual,
                dtvencimento: dtvencimento,
                vltotal: parseFloat(Number(valor).toFixed(2)),
                txdesc: condicaoPagamento!.txdesc,
                txmulta: condicaoPagamento!.txmulta,
                txjuros: condicaoPagamento!.txjuros,
                observacao: `Conta a Pagar Parcela ${item.numero} de ${index + 1} referente ao mês ${dtvencimento.getMonth()}/${dtvencimento.getFullYear()}`,
                cliente: objCliente!,
                florigem: 'V',
                formapagamento: {
                    ...item.formapagamento,
                    datacad: new Date(),
                    ultalt: new Date()
                },
                flsituacao: 'A',
                datacad: new Date(),
                ultalt: new Date()
            }
            mArray.push(contapagar);
        });
        setListaContasReceber(mArray);
    }

    const insertProduto = (isDeleting: boolean = false, index?: number) => {
        if (produto?.qtdatual! < qtd) {
            toast.error('Verifique a quantidade de produtos informada.')
            const validationErrors: IVFormErrors = {};
            validationErrors['qtd'] = 'A quantidade de produtos informada é maior do que a quantidade atual em estoque.';
            formRef.current?.setErrors(validationErrors);
            return;
        }
        console.log('produto', produto);
        var totalProdutosNota = vlTotalProdutosNota;
        if (isEditingProduto) {
            totalProdutosNota = totalProdutosNota - (produto!.vlvenda * produto!.qtd);
            console.log(`EDITING totalProdutosNota1: ${totalProdutosNota}`);
        }
        totalProdutosNota = totalProdutosNota + (vlUnitario * qtd);
        console.log(`totalProdutosNota: ${totalProdutosNota}`);
        var listaProdutos = listaProdutosNF.slice();
        console.log('listaProdutos1', listaProdutos);
        var mProduto = listaProdutos.find(item => item.id == produto?.id);
        var item: IProdutosNF;
        if (mProduto && !isDeleting && !isEditingProduto) {
            toast.error('Este produto já está na lista.')
            const validationErrors: IVFormErrors = {};
            validationErrors['produto'] = 'Este produto já está na lista.';
            formRef.current?.setErrors(validationErrors);
        } else {
            if (isDeleting) {
                let produto = listaProdutos[index!];
                totalProdutosNota = totalProdutosNota - (produto.vlvenda * produto.qtd);
                listaProdutos.splice(index!, 1);
            } else {
                item = {
                    id: produto!.id,
                    gtin: produto!.gtin,
                    descricao: produto!.descricao,
                    apelido: produto!.apelido,
                    marca: produto!.marca,
                    undmedida: produto!.undmedida,
                    unidade: produto!.unidade,
                    vlcusto: 0,
                    vlcompra: produto!.vlcompra,
                    vlvenda: vlUnitario,
                    lucro: 0,
                    pesoliq: produto!.pesoliq,
                    pesobruto: produto!.pesobruto,
                    ncm: produto!.ncm,
                    cfop: produto!.cfop,
                    percicmssaida: produto!.percicmssaida,
                    percipi: produto!.percipi,
                    cargatribut: produto!.cargatribut,
                    qtdatual: produto!.qtdatual,
                    qtdideal: produto!.qtdideal,
                    qtdmin: produto!.qtdmin,
                    fornecedor: produto!.fornecedor,
                    listavariacoes: produto!.listavariacoes,
                    qtd: qtd,
                    vltotal: 0,
                    datacad: produto!.datacad,
                    ultalt: produto!.ultalt
                }
                console.log('___________');
                console.log('item', item);
                if (isEditingProduto) {
                    let index = listaProdutos.findIndex(item => item.id == produto?.id);
                    listaProdutos.splice(index, 1, item);
                } else {
                    listaProdutos.push(item); 
                }     
                console.log('listaProdutos2', listaProdutos);       
            }
            setVlTotalProdutosNota(totalProdutosNota);   
            var vlTotalNota = 0;
            var percTotal = 0;
            listaProdutos.map((produto, index) => {
                console.log("___________");
                console.log('PRODUTO ', index+1);
                produto.vltotal = parseFloat((produto.vlvenda * produto.qtd).toFixed(2));
                console.log(`vltotal: ${produto.vltotal}`);
                vlTotalNota = parseFloat((vlTotalNota + produto.vltotal).toFixed(2));
                console.log(`vltotalnota: ${vlTotalNota}`);
            })
            setVlTotalNota(vlTotalNota);
            setListaProdutosNF(listaProdutos);
            formRef.current?.setFieldValue('produto', null);
            formRef.current?.setFieldValue('valor', '');
            formRef.current?.setFieldValue('qtd', '');
            formRef.current?.setFieldValue('total', 0);
            setIsEditingProduto(false);
            setVlUnitario(0);
            setQtd(0);
        }
    }

    useEffect(() => {
        if (isDialog) {
            if (selectedId) {
                setIsLoading(true);
                controller.getOne(selectedId)
                    .then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            toast.error(result.message);
                            navigate('/compras')
                        } else {
                            result.datacad = new Date(result.datacad).toLocaleString();
                            result.ultalt = new Date(result.ultalt).toLocaleString();
                            formRef.current?.setData(result);
                            setIsValid(true);
                            setObjCliente(result.cliente);
                            setVendaOriginal(result);
                        }
                    })
            } else {
                formRef.current?.setData({

                });
            }
        } else {
            if (id !== 'novo') {
                setIsLoading(true);
                controller.getOne(Number(id))
                .then((result) => {
                    console.log(result);
                    setIsLoading(false);
                    if (result instanceof Error) {
                        toast.error(result.message);
                        navigate('/compras');
                    } else {
                        setVlTotalNota(result.vltotal);
                        result.datacad = new Date(result.datacad).toLocaleString();
                        result.ultalt = new Date(result.ultalt).toLocaleString();
                        formRef.current?.setData(result);
                        setListaContasReceber(result.listacontasreceber);
                        setListaProdutosNF(result.listaprodutos);
                        setIsEditing(true);
                    }
                });
            } else {
                setIsValid(false);
                formRef.current?.setData({

                });
            }
        }
    }, [id]);

    const handleSave = (dados: IFormData) => {
        var errors = false;
        if (listaContasReceber.length == 0) {
            errors = true;
        }
        if (listaProdutosNF.length == 0) {
            errors = true;
        }
        if (!formRef.current?.getData().dataemissao) {
            errors = true;
        }
        if (!objCliente) {
            errors = true;
        }
        if (errors) {
            const validationErrors: IVFormErrors = {}

            toast.error('Verifique os erros.');

            if (listaContasReceber.length == 0) {
                validationErrors['condicaopagamento'] = 'Por favor, gere as contas a receber antes de salvar.'
            }

            if (listaProdutosNF.length == 0) {
                validationErrors['produto'] = 'Por favor, insira ao menos um produto.'
            }

            if (!formRef.current?.getData().dataemissao) {
                validationErrors['dataemissao'] = 'Por favor, informe a data de emissäo.'
            }

            if (!objCliente) {
                validationErrors['cliente'] = 'Por favor, informe o cliente.'
            }

            formRef.current?.setErrors(validationErrors);

            return;
        }

        setIsLoading(true);
        let vltotal = vlTotalProdutosNota;
        let dtemissao: Dayjs = formRef.current?.getData().dataemissao;
        let dataemissao = new Date(dtemissao.toISOString());
        if (isDialog) {
            if (!selectedId) {
                controller.create({
                    cliente: objCliente!,
                    observacao: "",
                    condicaopagamento: condicaoPagamento!,
                    vltotal: vltotal,
                    listaprodutos: listaProdutosNF,
                    listacontasreceber: listaContasReceber,
                    flsituacao: "A",
                    dataemissao: dataemissao
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
                // controller.update(dadosValidados)
                // .then((result) => {
                //     setIsLoading(false);
                //     if (result instanceof Error) {
                //         toast.error(result.message);
                //     } else {
                //         toast.success('Alterado com sucesso!');
                //         reloadDataTableIfDialog?.();
                //         toggleOpen?.();
                //     }
                // });
            }
        } else {
            if (id === 'novo') {
                controller.create({
                    cliente: objCliente!,
                    observacao: "",
                    condicaopagamento: condicaoPagamento!,
                    vltotal: vltotal,
                    listaprodutos: listaProdutosNF,
                    listacontasreceber: listaContasReceber,
                    flsituacao: "A",
                    dataemissao: dataemissao
                })
                    .then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            toast.error(result.message)
                        } else {
                            toast.success('Cadastrado com sucesso!')
                            if (isSaveAndClose()) {
                                navigate('/compras');
                            }
                        }
                    });
            } else {
                // controller.update(dadosValidados)
                // .then((result) => {
                //     setIsLoading(false);
                //     if (result instanceof Error) {
                //         toast.error(result.message);
                //     } else {
                //         toast.success('Alterado com sucesso!');
                //         if (isSaveAndClose()) {
                //             navigate('/compras')
                //         }
                //     }
                // });
            }
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
                        navigate('/compras');
                    }
                })
        }
    }
    // #endregion

    return (
        <LayoutBase 
            titulo={id === 'novo' ? 'Cadastrar Venda' : 'Visualizar Venda'}
            barraDeFerramentas={
                <DetailTools
                    mostrarBotaoSalvar={false}
                    mostrarBotaoNovo={false}
                    mostrarBotaoSalvarFechar={!isEditing}
                    mostrarBotaoApagar={false}

                    disableButtons={isValidating}

                    onClickSalvarFechar={saveAndClose}
                    onClickApagar={() => handleDelete(Number(id))}
                    onClickVoltar={() => {
                        if (isDialog) {
                            toggleOpen?.();
                        } else {
                            navigate('/vendas');
                        }
                    }}
                />
            }
        >
            <VForm ref={formRef} onSubmit={handleSave}>
                <Box margin={1} display="flex" flexDirection="column" component={Paper} alignItems="center">
                    <Grid item container xs={12} sm={10} md={10} lg={10} xl={8} direction="column" padding={2} spacing={2} alignItems="left">

                        {isLoading && (
                            <Grid item>
                                <LinearProgress variant="indeterminate"/>
                            </Grid>
                        )}

                        <Grid item>
                            <Typography variant="h6">Dados da Nota Fiscal</Typography>
                        </Grid>

                        <Grid container item direction="row" spacing={2} justifyContent="center">

                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <VAutocompleteSearch
                                    size="small"
                                    required
                                    name="cliente"
                                    label={["nmcliente"]}
                                    TFLabel="Cliente"
                                    disabled={isLoading || isEditing}
                                    getAll={controllerClientes.getAll}
                                    onChange={(value) => {
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

                        <Grid container item direction="row" spacing={2} justifyContent="left">
                            <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                                <VDatePicker
                                    disableFuture
                                    disabled={isLoading || listaContasReceber.length > 0}
                                    name="dataemissao"
                                    label="Data de Emissão"
                                />
                            </Grid>
                        </Grid>

                        <Grid item>
                            <Typography variant="h6">Dados do Produto</Typography>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
                                <VAutocompleteSearch
                                    disabled={isLoading || isEditingProduto || listaContasReceber.length > 0}
                                    size="small"
                                    name="produto"
                                    label={["descricao"]}
                                    TFLabel="Produto"
                                    getAll={controllerProdutos.getAll}
                                    onChange={(value) => {
                                        setProduto(value);
                                        formRef.current?.setFieldValue('valor', value.vlvenda);
                                        setVlUnitario(value.vlvenda);
                                        formRef.current?.setFieldError('produto', '');
                                    }}
                                    onInputchange={() => {
                                        formRef.current?.setFieldError('produto', '');
                                    }}
                                    onClickSearch={toggleConsultaProdutosDialogOpen}
                                    isDialogOpen={isConsultaProdutosDialogOpen}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={6} xl={2}>
                                <VNumberInput
                                    disabled={isLoading || listaContasReceber.length > 0}
                                    size="small"
                                    fullWidth
                                    name="qtd"
                                    label="Qtd"
                                    onChange={e => {
                                        setQtd(Number(e.target.value));
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={5} lg={5} xl={2}>
                                <VMoneyInput
                                    disabled={isLoading || listaContasReceber.length > 0}
                                    inputProps={{
                                        readOnly: true
                                    }}
                                    size="small"
                                    fullWidth
                                    name="valor"
                                    label="Valor Uni."
                                    onChange={e => {
                                        setVlUnitario(parseFloat(Number(e.target.value).toFixed(2)));
                                    }}
                                />  
                            </Grid>

                            <Grid item xs={12} sm={12} md={5} lg={5} xl={2}>
                                <VMoneyInput
                                    disabled={isLoading}
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

                            <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                                <Button
                                    disabled={isLoading || listaContasReceber.length > 0}
                                    variant="contained" 
                                    color={isEditingProduto ? "warning" : "success"}
                                    size="large"
                                    onClick={e => {
                                        if (
                                            produto && 
                                            formRef.current?.getData().valor &&
                                            formRef.current?.getData().qtd
                                        ) {
                                            insertProduto();
                                        } else {
                                            console.log(formRef.current?.getData());
                                            const validationErrors: IVFormErrors = {};
                                            if (!produto) {
                                                validationErrors['produto'] = 'Selecione um produto.';
                                            }
                                            if (!formRef.current?.getData().valor) {
                                                validationErrors['valor'] = 'Informe o valor unitário.';
                                            }
                                            if (!formRef.current?.getData().qtd) {
                                                validationErrors['qtd'] = 'Informe a quantidade';
                                            }
                                            formRef.current?.setErrors(validationErrors);
                                            toast.error('Preencha todos os campos do produto.');
                                        }
                                    }}
                                >
                                    <Icon>add</Icon>
                                </Button>
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
                                <VAutocompleteSearch
                                    disabled={isLoading || isEditingProduto || listaContasReceber.length > 0 || listaProdutosNF.length == 0}
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

                            <Grid item xs={2} sm={2} md={2} lg={2} xl={1}>
                                <Button
                                    disabled={isLoading || isEditingProduto || listaContasReceber.length > 0 || listaProdutosNF.length == 0 || !condicaoPagamento}
                                    variant="contained" 
                                    color="primary"
                                    size="large"
                                    fullWidth
                                    onClick={e => {
                                        if (listaProdutosNF.length == 0) {
                                            formRef.current?.setFieldError('produto', 'Insira ao menos um produto.');
                                            toast.error('Insira ao menos um produto.')
                                        } else {
                                            if (window.confirm('Deseja gerar contas a pagar? Esta operação bloqueia os produtos.')) {
                                                gerarContasPagar();
                                            }
                                        }
                                    }}
                                >
                                    GERAR
                                </Button>
                            </Grid>

                            { listaContasReceber.length > 0 && (
                                <Grid item xs={2} sm={2} md={2} lg={2} xl={1}>
                                    <Button
                                        disabled={isEditing || isLoading || isEditingProduto}
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
                            ) }
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={4} xl={6}>
                            <DataTable
                                rowCount={listaProdutosNF.length}
                                headers={headers}
                                rows={listaProdutosNF}
                                rowId="id"
                                footer
                                footerValue={<Typography variant="h6">{calcularFooterValue()}</Typography>}
                                footerLabel={<Typography variant="h6">Total:</Typography>}
                            />
                        </Grid>

                        <Grid item>
                            <Typography variant="h6">Contas a Receber</Typography>
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={4} xl={6}>
                            <DataTable
                                rowCount={listaContasReceber.length}
                                headers={headersContasPagar}
                                rows={listaContasReceber}
                                rowId="nrparcela"
                                footer
                                footerValue={<Typography variant="h6">{calcularFooterValorContasPagar()}</Typography>}
                                footerLabel={<Typography variant="h6">Total:</Typography>}
                            />
                        </Grid>

                        {(id != 'novo') && (
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
                        onClose={toggleConsultaClientesDialogOpen}
                        handleClose={toggleConsultaClientesDialogOpen} 
                        open={isConsultaClientesDialogOpen} 
                        title="Consultar Clientes"
                        fullWidth
                        maxWidth="xl"
                    >
                        <ConsultaClientes 
                            isDialog
                            onSelectItem={(row) => {
                                formRef.current?.setFieldError('cliente', '');
                                formRef.current?.setFieldValue('cliente', row);
                                setObjCliente(row);
                            }}
                            toggleDialogOpen={toggleConsultaClientesDialogOpen}
                        />
                    </CustomDialog>

                    <CustomDialog 
                        onClose={toggleConsultaProdutosDialogOpen}
                        handleClose={toggleConsultaProdutosDialogOpen} 
                        open={isConsultaProdutosDialogOpen} 
                        title="Consultar Produtos"
                        fullWidth
                        maxWidth="xl"
                    >
                        <ConsultaProdutos 
                            isDialog
                            onSelectItem={(row) => {
                                console.log('teste');
                                formRef.current?.setFieldError('produto', '');
                                formRef.current?.setFieldValue('produto', row);
                                setProduto(row);
                            }}
                            toggleDialogOpen={toggleConsultaProdutosDialogOpen}
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
                                formRef.current?.setFieldError('condicaopagamento', '');
                                formRef.current?.setFieldValue('condicaopagamento', row);
                            }}
                            toggleDialogOpen={toggleConsultaCondicoesPagamentoDialogOpen}
                        />
                    </CustomDialog>

                </Box>
            </VForm>
        </LayoutBase>
    )

}