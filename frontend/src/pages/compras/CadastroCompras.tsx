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
import { IDetalhesCompras, ICompras, IValidator } from "../../shared/interfaces/entities/Compras";
import { VTextField, VForm, useVForm, IVFormErrors, VAutocompleteSearch, VDatePicker, VNumberTextField, VNumberInput } from "../../shared/forms"
import { useDebounce } from "../../shared/hooks";
import ControllerCompras from "../../shared/controllers/ComprasController";
import { IFornecedores } from "../../shared/interfaces/entities/Fornecedores";
import { ICadastroComprasProps } from "../../shared/interfaces/views/CadastroCompras";
import ControllerFornecedores from "../../shared/controllers/FornecedoresController";
import { ConsultaFornecedores } from "../fornecedores/ConsultaFornecedores";
import ControllerProdutos from "../../shared/controllers/ProdutosController";
import { ConsultaProdutos } from "../produtos/ConsultaProdutos";
import { IProdutosNF } from "../../shared/interfaces/entities/ProdutosNF";
import { DataTable, IHeaderProps } from "../../shared/components/data-table/DataTable";
import { VMoneyInput } from "../../shared/forms/VMoneyInput";
import { CurrencyBitcoin } from "@mui/icons-material";
import ControllerCondicoesPagamento from "../../shared/controllers/CondicoesPagamentoController";
import { ConsultaCondicoesPagamento } from "../condicoesPagamento/ConsultaCondicoesPagamento";
import { IContasPagar } from "../../shared/interfaces/entities/ContasPagar";
import { Dayjs } from "dayjs";
import { IParcelas } from "../../shared/interfaces/entities/Parcelas";
import { ICondicoesPagamento } from "../../shared/interfaces/entities/CondicoesPagamento";
// #endregion

// #region INTERFACES
interface IFormData {
    numnf: string;
    serienf: string;
    modelonf: string;
}
// #endregion

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
    numnf: yup.string().required(),
    serienf: yup.string().required(),
    modelonf: yup.string().required(),
})

export const CadastroCompras: React.FC<ICadastroComprasProps> = ({isDialog = false, toggleOpen, selectedRow, reloadDataTableIfDialog}) => {
    // #region CONTROLLERS
    const controller = new ControllerCompras();
    const controllerFornecedores = new ControllerFornecedores();
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
    const [isConsultaFornecedoresDialogOpen, setIsConsultaFornecedoresDialogOpen] = useState(false);
    const [isConsultaProdutosDialogOpen, setIsConsultaProdutosDialogOpen] = useState(false);
    const [isConsultaCondicoesPagamentoDialogOpen, setIsConsultaCondicoesPagamentoDialogOpen] = useState(false);
    const [listaProdutosNF, setListaProdutosNF] = useState<IProdutosNF[]>([]);
    const [listaContasPagar, setListaContasPagar] = useState<IContasPagar[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isValidating, setIsValidating] = useState<boolean>(false);
    const [isEditingProduto, setIsEditingProduto] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [numnf, setNumNf] = useState("");
    const [serienf, setSerieNf] = useState("");
    const [modelonf, setModeloNf] = useState("");
    const [objFornecedor, setObjFornecedor] = useState<IFornecedores | null>(null);
    const [compraOriginal, setCompraOriginal] = useState<ICompras | null>(null);
    const [produto, setProduto] = useState<IProdutosNF | null>(null);
    const [condicaoPagamento, setCondicaoPagamento] = useState<ICondicoesPagamento | null>(null);
    const [vlTotalProdutosNota, setVlTotalProdutosNota] = useState(0);
    const [vlTotalNota, setVlTotalNota] = useState(0);
    const [vlUnitario, setVlUnitario] = useState(0);
    const [qtd, setQtd] = useState(0);
    // #endregion

    // #region ACTIONS
    const toggleConsultaFornecedoresDialogOpen = () => {
        setIsConsultaFornecedoresDialogOpen(oldValue => !oldValue);
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
            name: "vlcompra",
            align: "center",
            render: (row: IProdutosNF) => {
                return (
                    new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }).format(row.vlcompra)
                )
            }  
        },
        {
            label: "Custo",
            name: "vlcusto",  
            align: "center",
            render: (row: IProdutosNF) => {
                return (
                    new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }).format(row.vlcusto)
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
                            disabled={isEditingProduto || listaContasPagar.length > 0} 
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
                            disabled={isEditingProduto || listaContasPagar.length > 0} 
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

        var vlfrete = formRef.current?.getData().vlfrete;
        var vlpedagio = formRef.current?.getData().vlpedagio;
        var vloutrasdespesas = formRef.current?.getData().vloutrasdespesas;
        vlfrete = !vlfrete ? 0 : vlfrete;
        vlpedagio = !vlpedagio ? 0 : vlpedagio;
        vloutrasdespesas = !vloutrasdespesas ? 0 : vloutrasdespesas;

        vlfrete = !vlfrete ? 0 : vlfrete;
        vlpedagio = !vlpedagio ? 0 : vlpedagio;
        vloutrasdespesas = !vloutrasdespesas ? 0 : vloutrasdespesas;

        total = total + vlfrete + vlpedagio + vloutrasdespesas;
        return new Intl.NumberFormat('pr-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(total);
    }

    const calcularFooterValorContasPagar = (): string => {
        var total = 0;
        listaContasPagar.forEach(item => {
            total = total + item.vltotal
        })
        return new Intl.NumberFormat('pr-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(total);
    }

    const gerarContasPagar = () => {
        const listaParcelas = condicaoPagamento?.listaparcelas;
        const mArray: Array<IContasPagar> = [];
        const dataEmissao: Dayjs = formRef.current?.getData().dataemissao;
        const dtemissao = new Date(dataEmissao.toISOString());

        var totalNota = vlTotalProdutosNota;
        var totalContasPagar = 0;

        var vlfrete = formRef.current?.getData().vlfrete;
        var vlpedagio = formRef.current?.getData().vlpedagio;
        var vloutrasdespesas = formRef.current?.getData().vloutrasdespesas;
        vlfrete = !vlfrete ? 0 : vlfrete;
        vlpedagio = !vlpedagio ? 0 : vlpedagio;
        vloutrasdespesas = !vloutrasdespesas ? 0 : vloutrasdespesas;

        totalNota = totalNota + vlfrete + vlpedagio + vloutrasdespesas;

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
            let contapagar: IContasPagar = {
                nrparcela: item.numero,
                percparcela: item.percentual,
                dtvencimento: dtvencimento,
                vltotal: parseFloat(Number(valor).toFixed(2)),
                txdesc: condicaoPagamento!.txdesc,
                txmulta: condicaoPagamento!.txmulta,
                txjuros: condicaoPagamento!.txjuros,
                observacao: `Conta a Pagar Parcela ${item.numero} de ${index + 1} referente ao mês ${dtvencimento.getMonth()}/${dtvencimento.getFullYear()}`,
                fornecedor: objFornecedor!,
                flcentrocusto: 'C',
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
        console.log(mArray);
        setListaContasPagar(mArray);
    }

    const insertProduto = (isDeleting: boolean = false, index?: number) => {
        console.log('produto', produto);
        var totalProdutosNota = vlTotalProdutosNota;
        if (isEditingProduto) {
            totalProdutosNota = totalProdutosNota - (produto!.vlcompra * produto!.qtd);
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
                totalProdutosNota = totalProdutosNota - (produto.vlcompra * produto.qtd);
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
                    vlcompra: vlUnitario,
                    vlvenda: produto!.vlvenda,
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
            var vlfrete = formRef.current?.getData().vlfrete;
            var vlpedagio = formRef.current?.getData().vlpedagio;
            var vloutrasdespesas = formRef.current?.getData().vloutrasdespesas;
            vlfrete = !vlfrete ? 0 : vlfrete;
            vlpedagio = !vlpedagio ? 0 : vlpedagio;
            vloutrasdespesas = !vloutrasdespesas ? 0 : vloutrasdespesas;
            var percTotal = 0;
            listaProdutos.map((produto, index) => {
                console.log("___________");
                console.log('PRODUTO ', index+1);
                let totaldespesas = vlfrete + vlpedagio + vloutrasdespesas;
                console.log(`total despesas: ${totaldespesas}`);
                let percProduto = parseFloat((produto.vlcompra * qtd * 100 / totalProdutosNota / 100).toFixed(2));
                percTotal = percTotal + (percProduto * 100);
                if ((index + 1 == listaProdutos.length) && percTotal < 100) {
                    percProduto = percProduto + ((100 - percTotal)/100);
                    percTotal = percTotal + (100 - percTotal);
                }
                console.log(`percproduto: ${percProduto}`);
                console.log(`perctotal: ${percTotal}`);
                let custo = parseFloat(((vlfrete + vlpedagio + vloutrasdespesas)*percProduto).toFixed(2));
                console.log(`custo total: ${custo}`);
                custo = parseFloat((custo / produto.qtd).toFixed(2));
                console.log(`custo produto: ${custo}`);
                produto.vlcusto = parseFloat((produto.vlcompra + custo).toFixed(2));
                console.log(`vlcusto: ${produto.vlcusto}`);
                produto.lucro = parseFloat((produto.vlvenda - produto.vlcompra).toFixed(2));
                console.log(`lucro: ${produto.lucro}`);
                produto.vltotal = parseFloat((produto.vlcusto * produto.qtd).toFixed(2));
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
            if (selectedRow) {
                setIsLoading(true);
                controller.getOne(selectedRow)
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
                            setNumNf(result.numnf);
                            setSerieNf(result.serienf);
                            setModeloNf(result.modelonf);
                            setObjFornecedor(result.fornecedor);
                            setCompraOriginal(result);
                        }
                    })
            } else {
                formRef.current?.setData({

                });
            }
        } else {
            if (id !== 'novo') {
                setIsLoading(true);
                let nf = id.split('=')[1];
                let serie = id.split('=')[2];
                let modelo = id.split('=')[3];
                let fornecedor: number | string = id.split('=')[4];
                nf = nf.replace(/[^0-9]/g, '');
                serie = serie.replace(/[^0-9]/g, '');
                modelo = modelo.replace(/[^0-9]/g, '');
                fornecedor = Number(fornecedor.replace(/[^0-9]/g, ''));
                controller.getOne({
                    numnf: nf,
                    serienf: serie,
                    modelonf: modelo,
                    idfornecedor: fornecedor
                })
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
                        setListaContasPagar(result.listacontaspagar);
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

    useEffect(() => {
        if (
            numnf != "" &&
            modelonf != "" &&
            serienf != "" &&
            objFornecedor
        ) {
            validate({
                numnf: numnf,
                modelonf: modelonf,
                serienf: serienf,
                idfornecedor: objFornecedor.id
            });
        }
    }, [numnf, serienf, modelonf, objFornecedor]);

    const validate = (dados: IValidator) => {
        if (!isEditing) {
            debounce(() => {
                setIsValidating(true);
                debounce(() => {
                    controller.validate(dados)
                        .then((result) => {
                            setIsValidating(false);
                            if (result instanceof Error) {
                                toast.error(result.message);
                            } else {
                                setIsValid(result);
                                if (result === false) {
                                    const validationErrors: IVFormErrors = {};
                                    toast.error('Verifique os campos chave da nota fiscal.')
                                    validationErrors['numnf'] = 'Esta nota fiscal já está cadastrada.';
                                    validationErrors['modelonf'] = 'Esta nota fiscal já está cadastrada.';
                                    validationErrors['serienf'] = 'Esta nota fiscal já está cadastrada.';
                                    validationErrors['fornecedor'] = 'Esta nota fiscal já está cadastrada.';
                                    formRef.current?.setErrors(validationErrors);
                                }
                            }
                        })
                });        
            })
        }
    }

    const handleSave = (dados: IFormData) => {
        console.log(condicaoPagamento);
        var errors = false;
        if (listaContasPagar.length == 0) {
            errors = true;
        }
        if (listaProdutosNF.length == 0) {
            errors = true;
        }
        if (!formRef.current?.getData().dataemissao) {
            errors = true;
        }
        if (!formRef.current?.getData().dataentrada) {
            errors = true;
        }
        if (!objFornecedor) {
            errors = true;
        }
        if (errors) {
            setIsValid(false);
        }
        formValidationSchema
            .validate(dados, { abortEarly: false })
                .then((dadosValidados) => {
                    if(isValid) {
                        setIsLoading(true);
                        let vlfrete = formRef.current?.getData().vlfrete;
                        let vlpedagio = formRef.current?.getData().vlpedagio;
                        let vloutrasdespesas = formRef.current?.getData().vloutrasdespesas;
                        let vltotal = vlTotalProdutosNota + vlfrete + vlpedagio + vloutrasdespesas;
                        let dtemissao: Dayjs = formRef.current?.getData().dataemissao;
                        let dtentrada: Dayjs = formRef.current?.getData().dataentrada;
                        let dataemissao = new Date(dtemissao.toISOString());
                        let dataentrada = new Date(dtentrada.toISOString());
                        if (isDialog) {
                            if (!selectedRow) {
                                controller.create({
                                    numnf: dadosValidados.numnf,
                                    serienf: dadosValidados.serienf,
                                    modelonf: dadosValidados.modelonf,
                                    fornecedor: objFornecedor!,
                                    observacao: "",
                                    condicaopagamento: condicaoPagamento!,
                                    listaprodutos: listaProdutosNF,
                                    listacontaspagar: listaContasPagar,
                                    vlfrete: vlfrete,
                                    vlpedagio: vlpedagio,
                                    vloutrasdespesas: vloutrasdespesas,
                                    vltotal: vltotal,
                                    flsituacao: "A",
                                    dataemissao: dataemissao,
                                    dataentrada: dataentrada,
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
                                    numnf: dadosValidados.numnf,
                                    serienf: dadosValidados.serienf,
                                    modelonf: dadosValidados.modelonf,
                                    fornecedor: objFornecedor!,
                                    observacao: "",
                                    condicaopagamento: condicaoPagamento!,
                                    listaprodutos: listaProdutosNF,
                                    listacontaspagar: listaContasPagar,
                                    vltotal: vltotal,
                                    vlfrete: vlfrete,
                                    vlpedagio: vlpedagio,
                                    vloutrasdespesas: vloutrasdespesas,
                                    flsituacao: "A",
                                    dataemissao: dataemissao,
                                    dataentrada: dataentrada,
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
                    } else {
                        toast.error('Verifique os campos');
                    }
                })
                .catch((errors: yup.ValidationError) => {
                    const validationErrors: IVFormErrors = {}

                    toast.error('Verifique os erros.');

                    if (listaContasPagar.length == 0) {
                        validationErrors['condicaopagamento'] = 'Por favor, gere as contas a pagar antes de salvar.'
                    }

                    if (listaProdutosNF.length == 0) {
                        validationErrors['produto'] = 'Por favor, insira ao menos um produto.'
                    }

                    if (!formRef.current?.getData().dataemissao) {
                        validationErrors['dataemissao'] = 'Por favor, informe a data de emissäo.'
                    }

                    if (!formRef.current?.getData().dataemissao) {
                        validationErrors['dataentrada'] = 'Por favor, informe a data de entrada da mercadoria.'
                    }

                    if (!objFornecedor) {
                        validationErrors['fornecedor'] = 'Por favor, informe o fornecedor.'
                    }

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
            controller.delete({
                numnf: numnf,
                serienf: serienf,
                modelonf: modelonf,
                idfornecedor: objFornecedor?.id
            })
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
            titulo={id === 'novo' ? 'Cadastrar Compra' : 'Visualizar Compra'}
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
                            navigate('/compras');
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
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={4}>
                                <VNumberTextField
                                    readOnly={isValid || isEditing}
                                    inputProps={(
                                        <InputAdornment position="end">
                                            { (isValidating && formRef.current?.getData().serienf) && (
                                                <Box sx={{ display: 'flex' }}>
                                                    <CircularProgress size={24}/>
                                                </Box>
                                            ) }
                                            { (isValid && formRef.current?.getData().serienf) && (
                                                <Box sx={{ display: 'flex' }}>
                                                    <Icon color="success">done</Icon>
                                                </Box>
                                            ) }
                                        </InputAdornment>
                                    )}
                                    size="small"
                                    required
                                    fullWidth
                                    name="numnf"
                                    label="Número"
                                    disabled={isLoading}
                                    onChange={(e) => {
                                        setIsValid(false);
                                        setIsValidating(false);
                                        setNumNf(e.target.value);
                                        formRef.current?.setFieldError('numnf', '');
                                        formRef.current?.setFieldError('serienf', '');
                                        formRef.current?.setFieldError('modelonf', '');
                                        formRef.current?.setFieldError('fornecedor', '');
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={12} lg={12} xl={4}>
                                <VNumberTextField
                                    inputProps={(
                                        <InputAdornment position="end">
                                            { (isValidating && formRef.current?.getData().serienf) && (
                                                <Box sx={{ display: 'flex' }}>
                                                    <CircularProgress size={24}/>
                                                </Box>
                                            ) }
                                            { (isValid && formRef.current?.getData().serienf) && (
                                                <Box sx={{ display: 'flex' }}>
                                                    <Icon color="success">done</Icon>
                                                </Box>
                                            ) }
                                        </InputAdornment>
                                    )}
                                    size="small"
                                    required
                                    fullWidth
                                    name="serienf"
                                    label="Série"
                                    disabled={isLoading}
                                    readOnly={isValid || isEditing}
                                    onChange={(e) => {
                                        setIsValid(false);
                                        setIsValidating(false);
                                        setSerieNf(e.target.value);
                                        formRef.current?.setFieldError('serienf', '');
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={12} lg={12} xl={4}>
                                <VNumberTextField
                                    readOnly={isValid || isEditing}
                                    size="small"
                                    required
                                    fullWidth
                                    name="modelonf"
                                    label="Modelo"
                                    //disabled={isLoading || isValid}
                                    inputProps={(
                                        <InputAdornment position="end">
                                            { (isValidating && formRef.current?.getData().serienf) && (
                                                <Box sx={{ display: 'flex' }}>
                                                    <CircularProgress size={24}/>
                                                </Box>
                                            ) }
                                            { (isValid && formRef.current?.getData().serienf) && (
                                                <Box sx={{ display: 'flex' }}>
                                                    <Icon color="success">done</Icon>
                                                </Box>
                                            ) }
                                        </InputAdornment>
                                    )}
                                    onChange={(e) => {
                                        setIsValid(false);
                                        setIsValidating(false);
                                        setModeloNf(e.target.value);
                                        formRef.current?.setFieldError('modelonf', '');
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <VAutocompleteSearch
                                    size="small"
                                    required
                                    name="fornecedor"
                                    label={["razsocial"]}
                                    TFLabel="Fornecedor"
                                    disabled={isLoading || isValid || isEditing}
                                    getAll={controllerFornecedores.getAll}
                                    onChange={(value) => {
                                        setObjFornecedor(value);
                                        formRef.current?.setFieldError('fornecedor', '');
                                    }}
                                    onInputchange={() => {
                                        formRef.current?.setFieldError('fornecedor', '');
                                    }}
                                    onClickSearch={toggleConsultaFornecedoresDialogOpen}
                                    isDialogOpen={isConsultaFornecedoresDialogOpen}
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2} justifyContent="left">
                            <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                                <VDatePicker
                                    disableFuture
                                    disabled={isLoading || !isValid || listaContasPagar.length > 0}
                                    name="dataemissao"
                                    label="Data de Emissão"
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                                <VDatePicker
                                    disableFuture
                                    disabled={isLoading || !isValid || listaContasPagar.length > 0}
                                    name="dataentrada"
                                    label="Data de Entrada"
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2} justifyContent="left">
                            <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                                <VMoneyInput
                                    disabled={isLoading || !isValid || listaContasPagar.length > 0}
                                    size="small"
                                    fullWidth
                                    name="vlfrete"
                                    label="Valor do frete"
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                                <VMoneyInput
                                    disabled={isLoading || !isValid || listaContasPagar.length > 0}
                                    size="small"
                                    fullWidth
                                    name="vlpedagio"
                                    label="Valor do pedágio"
                                />                              
                            </Grid>

                            <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                                <VMoneyInput
                                    disabled={isLoading || !isValid || listaContasPagar.length > 0}
                                    size="small"
                                    fullWidth
                                    name="vloutrasdespesas"
                                    label="Outras despesas"
                                />                               
                            </Grid>
                        </Grid>

                        <Grid item>
                            <Typography variant="h6">Dados do Produto</Typography>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
                                <VAutocompleteSearch
                                    disabled={isLoading || !isValid || isEditingProduto || listaContasPagar.length > 0}
                                    size="small"
                                    name="produto"
                                    label={["descricao"]}
                                    TFLabel="Produto"
                                    getAll={controllerProdutos.getAll}
                                    onChange={(value) => {
                                        setProduto(value);
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
                                    disabled={isLoading || !isValid || listaContasPagar.length > 0}
                                    size="small"
                                    fullWidth
                                    name="qtd"
                                    label="Qtd"
                                    onChange={e => {
                                        setQtd(Number(e.target.value));
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={6} xl={2}>
                                <VMoneyInput
                                    disabled={isLoading || !isValid || listaContasPagar.length > 0}
                                    size="small"
                                    fullWidth
                                    name="valor"
                                    label="Valor Uni."
                                    onChange={e => {
                                        setVlUnitario(parseFloat(Number(e.target.value).toFixed(2)));
                                    }}
                                />  
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={6} xl={2}>
                                <VMoneyInput
                                    disabled={isLoading || !isValid}
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
                                    disabled={isLoading || !isValid || listaContasPagar.length > 0}
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
                                    disabled={isLoading || !isValid || isEditingProduto || listaContasPagar.length > 0 || listaProdutosNF.length == 0}
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
                                    disabled={isLoading || !isValid || isEditingProduto || listaContasPagar.length > 0 || listaProdutosNF.length == 0 || !condicaoPagamento}
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

                            { listaContasPagar.length > 0 && (
                                <Grid item xs={2} sm={2} md={2} lg={2} xl={1}>
                                    <Button
                                        disabled={isEditing || isLoading || isEditingProduto}
                                        variant="contained" 
                                        color="error"
                                        size="large"
                                        fullWidth
                                        onClick={e => {
                                            setListaContasPagar([]);
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
                            <Typography variant="h6">Contas a Pagar</Typography>
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={4} xl={6}>
                            <DataTable
                                rowCount={listaContasPagar.length}
                                headers={headersContasPagar}
                                rows={listaContasPagar}
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
                        onClose={toggleConsultaFornecedoresDialogOpen}
                        handleClose={toggleConsultaFornecedoresDialogOpen} 
                        open={isConsultaFornecedoresDialogOpen} 
                        title="Consultar Fornecedores"
                        fullWidth
                        maxWidth="xl"
                    >
                        <ConsultaFornecedores 
                            isDialog
                            onSelectItem={(row) => {
                                formRef.current?.setFieldError('fornecedor', '');
                                formRef.current?.setFieldValue('fornecedor', row);
                                setObjFornecedor(row);
                            }}
                            toggleDialogOpen={toggleConsultaFornecedoresDialogOpen}
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