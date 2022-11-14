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
import { VTextField, VForm, useVForm, IVFormErrors, VAutocompleteSearch, VDatePicker } from "../../shared/forms"
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
import { VNumberInput } from "../../shared/forms/VNumberInput";
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

export const CadastroCompras: React.FC<ICadastroComprasProps> = ({isDialog = false, toggleOpen, selectedRow, reloadDataTableIfDialog}) => {
    // #region CONTROLLERS
    const controller = new ControllerCompras();
    const controllerFornecedores = new ControllerFornecedores();
    const controllerProdutos = new ControllerProdutos();
    // #endregion
   
    // #region HOOKS
    const { nf = ''} = useParams<'nf'>();
    const { serie = ''} = useParams<'serie'>();
    const { modelo = ''} = useParams<'modelo'>();
    const { fornecedor = ''} = useParams<'fornecedor'>();
    const id = (nf != '' && serie != '' && modelo != '' && fornecedor != '') ? `nf=${nf}_serie=${serie}_modelo=${modelo}_fornecedor=${fornecedor}` : 'novo';
    const navigate = useNavigate();
    const { formRef, save, saveAndNew, saveAndClose, isSaveAndNew, isSaveAndClose } = useVForm();
    const { debounce } = useDebounce();
    // #endregion

    // #region STATES
    const [isConsultaFornecedoresDialogOpen, setIsConsultaFornecedoresDialogOpen] = useState(false);
    const [isConsultaProdutosDialogOpen, setIsConsultaProdutosDialogOpen] = useState(false);
    const [listaProdutosNF, setListaProdutosNF] = useState<IProdutosNF[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isValidating, setIsValidating] = useState<boolean>(false);
    const [isValid, setIsValid] = useState(false);
    const [numnf, setNumNf] = useState("");
    const [serienf, setSerieNf] = useState("");
    const [modelonf, setModeloNf] = useState("");
    const [objFornecedor, setObjFornecedor] = useState<IFornecedores | null>(null);
    const [compraOriginal, setCompraOriginal] = useState<ICompras | null>(null);
    const [produto, setProduto] = useState<IProdutosNF | null>(null);
    const [vlTotalProdutosNota, setVlTotalProdutosNota] = useState(0);
    const [vlSubTotalNota, setVlSubTotalNota] = useState(0);
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

    const headers: IHeaderProps[] = [
        {
            label: "ID",
            name: "id",  
        },
        {
            label: "Descrição",
            name: "descricao",  
        },
        {
            label: "UND",
            name: "undmedida",  
        },
        {
            label: "Quantidade",
            name: "qtd",  
        },
        {
            label: "Valor unitário",
            name: "vlcompra",  
        },
        {
            label: "Custo",
            name: "vlcusto",  
        },
        {
            label: "Total",
            name: "vltotal",  
        },
        {
            label: "Ações",
            name: " ",
            align: "right",
            render: (row: IProdutosNF) => {
                return (
                    <>
                        <IconButton
                            color="error" 
                            size="small" 
                            onClick={() => {
                                if (window.confirm('Deseja excluir este produto?')) {
                                    const mArray = listaProdutosNF.slice();
                                    const index = mArray.findIndex(item => item.id == row.id);
                                    delete mArray[index];
                                    mArray.length = listaProdutosNF.length-1;
                                    setListaProdutosNF(mArray);
                                }
                            }}
                        >
                            <Icon>delete</Icon>
                        </IconButton>
                    </>
                )
            }
        }
    ];

    // useEffect(() => {
    //     console.log('aqui');
    //     updateCustoProdutos(); 
    // }, [listaProdutosNF])

    useEffect(() => {
        formRef.current?.setFieldValue('total', String(vlUnitario * qtd));        
    }, [vlUnitario, qtd])

    // const updateCustoProdutos = () => {
    //     console.log("update");
    //     let mArray: IProdutosNF[] = [];
    //     let listaProdutosNFAux = listaProdutosNF.slice();
    //     let vlTotalNota = 0;
    //     listaProdutosNFAux.forEach(item => {
    //         let percProduto = ((item.vlcompra*100)/vlTotalProdutosNota)/100;
    //         let custo = (item.vlfrete + item.vlpedagio + item.vloutrasdespesas)*percProduto;
    //         custo = custo + item.vlcompra;
    //         let mItem = {
    //             ...item,
    //             vlcusto: custo,
    //             lucro: item.vlvenda - custo,
    //             vltotal: custo * item.qtd
    //         };
    //         vlTotalNota += custo * item.qtd;
    //         mArray.push(mItem);
    //     })
    //     setListaProdutosNF(mArray);
    //     setVlSubTotalNota(vlTotalNota);
    // }

    const insertProduto = () => {
        var listaProdutos = listaProdutosNF.slice();
        var mProduto = listaProdutos.find(item => item.id == produto?.id);
        if (mProduto) {
            toast.error('Este produto já está na lista.')
            const validationErrors: IVFormErrors = {};
            validationErrors['produto'] = 'Este produto já está na lista.';
            formRef.current?.setErrors(validationErrors);
        } else {
            let totalProdutosNota = vlTotalProdutosNota + vlUnitario;
            setVlTotalProdutosNota(totalProdutosNota);
            var item: IProdutosNF;
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
            listaProdutos.push(item);
            var vlTotalNota = 0;
            var vlfrete = Number(formRef.current?.getData().vlfrete);
            var vlpedagio = Number(formRef.current?.getData().vlpedagio);
            var vloutrasdespesas = Number(formRef.current?.getData().vloutrasdespesas);
            listaProdutos.map(produto => {
                let percProduto = ((produto.vlcompra*100)/totalProdutosNota)/100;
                let custo = (vlfrete + vlpedagio + vloutrasdespesas)*percProduto;
                custo = custo / produto.qtd;
                produto.vlcusto = produto.vlcompra + custo;
                produto.lucro = produto.vlcompra - custo;
                produto.vltotal = produto.vlcusto * produto.qtd;
                vlTotalNota = vlTotalNota + produto.vltotal;
            })
            setVlSubTotalNota(vlTotalNota);
            setListaProdutosNF(listaProdutos);
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
                controller.getOne({
                    numnf: nf,
                    serienf: serie,
                    modelonf: modelo,
                    idfornecedor: Number(fornecedor)
                })
                .then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        toast.error(result.message);
                        navigate('/compras');
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
        debounce(() => {
            if (
                numnf != "" &&
                serienf != "" &&
                modelonf != "" &&
                objFornecedor &&
                (
                    dados.numnf != numnf &&
                    dados.serienf != serienf &&
                    dados.modelonf != modelonf &&
                    dados.idfornecedor != objFornecedor.id
                )
            ) {
                setIsValidating(true);
                debounce(() => {
                    controller.validate({
                        numnf: numnf,
                        serienf: serienf,
                        modelonf: modelonf,
                        idfornecedor: objFornecedor.id
                    })
                        .then((result) => {
                            setIsValidating(false);
                            if (result instanceof Error) {
                                toast.error(result.message);
                            } else {
                                setIsValid(result);
                                if (result === false) {
                                    const validationErrors: IVFormErrors = {};
                                    validationErrors['numnf'] = 'Esta nota fiscal já está cadastrada.';
                                    validationErrors['modelonf'] = 'Esta nota fiscal já está cadastrada.';
                                    validationErrors['serienf'] = 'Esta nota fiscal já está cadastrada.';
                                    validationErrors['fornecedor'] = 'Esta nota fiscal já está cadastrada.';
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
        formValidationSchema
            .validate(dados, { abortEarly: false })
                .then((dadosValidados) => {
                    if(isValid) {
                        setIsLoading(true);
                        if (isDialog) {
                            if (!selectedRow) {
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
                                controller.update(dadosValidados)
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
                                                navigate('/compras');
                                            }
                                        }
                                    });
                            } else {
                                controller.update(dadosValidados)
                                .then((result) => {
                                    setIsLoading(false);
                                    if (result instanceof Error) {
                                        toast.error(result.message);
                                    } else {
                                        toast.success('Alterado com sucesso!');
                                        if (isSaveAndClose()) {
                                            navigate('/compras')
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
            titulo={id === 'novo' ? 'Cadastrar Compra' : 'Editar Compra'}
            barraDeFerramentas={
                <DetailTools
                    mostrarBotaoSalvar={false}
                    mostrarBotaoSalvarFechar
                    mostrarBotaoApagar={id !== 'novo' && !isDialog}

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
                                <VTextField
                                    size="small"
                                    required
                                    fullWidth
                                    name="numnf"
                                    label="Número"
                                    //disabled={isLoading || isValid}
                                    InputProps={{
                                        readOnly: isValid,
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                { (isValidating && formRef.current?.getData().numnf) && (
                                                    <Box sx={{ display: 'flex' }}>
                                                        <CircularProgress size={24}/>
                                                    </Box>
                                                ) }
                                                { (isValid && formRef.current?.getData().numnf) && (
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
                                        setNumNf(e.target.value);
                                        formRef.current?.setFieldError('numnf', '');
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={12} lg={12} xl={4}>
                                <VTextField
                                    size="small"
                                    required
                                    fullWidth
                                    name="serienf"
                                    label="Série"
                                    //disabled={isLoading || isValid}
                                    InputProps={{
                                        readOnly: isValid,
                                        endAdornment: (
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
                                        )
                                    }}
                                    onChange={(e) => {
                                        setIsValid(false);
                                        setIsValidating(false);
                                        setSerieNf(e.target.value);
                                        formRef.current?.setFieldError('serienf', '');
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={12} lg={12} xl={4}>
                                <VTextField
                                    size="small"
                                    required
                                    fullWidth
                                    name="modelonf"
                                    label="Modelo"
                                    //disabled={isLoading || isValid}
                                    InputProps={{
                                        readOnly: isValid,
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                { (isValidating && formRef.current?.getData().modelonf) && (
                                                    <Box sx={{ display: 'flex' }}>
                                                        <CircularProgress size={24}/>
                                                    </Box>
                                                ) }
                                                { (isValid && formRef.current?.getData().modelonf) && (
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
                                    //disabled={isLoading || isValid}
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
                                    //disabled={isLoading || !isValid}
                                    name="dataemissao"
                                    label="Data de Emissão"
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                                <VDatePicker
                                    //disabled={isLoading || !isValid}
                                    name="dataentrada"
                                    label="Data de Entrada"
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2} justifyContent="left">
                            <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                                <VNumberInput
                                    //disabled={isLoading || !isValid}
                                    size="small"
                                    fullWidth
                                    name="vlfrete"
                                    label="Valor do Frete"
                                    prefix="R$"
                                />
                                {/* <VTextField
                                    //disabled={isLoading || !isValid}
                                    type="number"
                                    size="small"
                                    fullWidth
                                    name="vlfrete"
                                    label="Valor do Frete"
                                    defaultValue={0}
                                />                                 */}
                            </Grid>

                            <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                                <VTextField
                                    //disabled={isLoading || !isValid}
                                    type="number"
                                    size="small"
                                    fullWidth
                                    name="vlpedagio"
                                    label="Valor do Pedágio"
                                />                                
                            </Grid>

                            <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                                <VTextField
                                    //disabled={isLoading || !isValid}
                                    type="number"
                                    size="small"
                                    fullWidth
                                    name="vloutrasdespesas"
                                    label="Outras Despesas"
                                />                                
                            </Grid>
                        </Grid>

                        <Grid item>
                            <Typography variant="h6">Dados do Produto</Typography>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
                                <VAutocompleteSearch
                                    //disabled={isLoading || !isValid}
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
                                <VTextField
                                    //disabled={isLoading || !isValid}
                                    type="number"
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
                                <VTextField
                                    //disabled={isLoading || !isValid}
                                    type="number"
                                    size="small"
                                    fullWidth
                                    name="valor"
                                    label="Valor"
                                    onChange={e => {
                                        setVlUnitario(Number(e.target.value));
                                    }}
                                />  
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={6} xl={2}>
                                <VTextField
                                    //disabled={isLoading || !isValid}
                                    inputProps={{
                                        readOnly: true
                                    }}
                                    type="number"
                                    size="small"
                                    fullWidth
                                    name="total"
                                    label="Total"
                                />  
                            </Grid>

                            <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                                <Button
                                    //disabled={isLoading || !isValid}
                                    variant="contained" 
                                    color="success"
                                    size="large"
                                    onClick={e => {
                                        if (produto && formRef.current?.getData().valor != "" && formRef.current?.getData().qtd != "") {
                                            insertProduto();
                                        } else {
                                            const validationErrors: IVFormErrors = {};
                                            if (!produto) {
                                                validationErrors['produto'] = 'Selecione um produto.';
                                            }
                                            if (formRef.current?.getData().valor != "") {
                                                validationErrors['valor'] = 'Informe o valor unitário.';
                                            }
                                            if (formRef.current?.getData().qtd != "") {
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

                        <Grid item xs={12} sm={12} md={6} lg={4} xl={6}>
                            <DataTable
                                rowCount={listaProdutosNF.length}
                                headers={headers}
                                rows={listaProdutosNF}
                                rowId="id"
                                footer
                                footerValue={String(vlSubTotalNota)}
                                footerLabel="Total"
                            />
                        </Grid>

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

                </Box>
            </VForm>
        </LayoutBase>
    )

}