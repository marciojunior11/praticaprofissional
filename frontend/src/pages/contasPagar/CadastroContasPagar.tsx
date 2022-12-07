// #region EXTERNAL IMPORTS
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Chip, CircularProgress, Collapse, Grid, Icon, IconButton, InputAdornment, LinearProgress, Paper, Select, Typography } from "@mui/material";
import * as yup from 'yup';
import { toast } from "react-toastify";
// #endregion

// #region INTERNAL IMPORTS
import { CustomDialog, DetailTools } from "../../shared/components";
import { LayoutBase } from "../../shared/layouts";
import { IDetalhesCompras, ICompras, IValidator } from "../../shared/interfaces/entities/Compras";
import { VTextField, VForm, useVForm, IVFormErrors, VAutocompleteSearch, VDatePicker, VNumberTextField, VAutocomplete, VNumberInput } from "../../shared/forms"
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

export const CadastroContasPagar: React.FC<ICadastroComprasProps> = ({isDialog = false, toggleOpen, selectedRow, reloadDataTableIfDialog}) => {
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
    const [flSituacao, setFlSituacao] = useState('');
    const [flCentroCusto, setFlCentroCusto] = useState('');
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
    const [condicaopagamento, setCondicaoPagamento] = useState<ICondicoesPagamento | null>(null);
    const [vlTotalProdutosNota, setVlTotalProdutosNota] = useState(0);
    const [vlSubTotalNota, setVlSubTotalNota] = useState(0);
    const [vlUnitario, setVlUnitario] = useState(0);
    const [qtd, setQtd] = useState(0);
    // #endregion

    // #region ACTIONS

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
                let nrparcela = id.split('=')[1]
                let nf = id.split('=')[2];
                let serie = id.split('=')[3];
                let modelo = id.split('=')[4];
                let fornecedor: number | string = id.split('=')[5];
                nrparcela = nrparcela.replace(/[^0-9]/g, '');
                console.log(nrparcela);
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
                    setIsLoading(false);
                    if (result instanceof Error) {
                        toast.error(result.message);
                        navigate('/compras');
                    } else {
                        result.datacad = new Date(result.datacad).toLocaleString();
                        result.ultalt = new Date(result.ultalt).toLocaleString();
                        var conta: any = result.listacontaspagar.find(item => item.nrparcela == Number(nrparcela));
                        setFlSituacao(conta.flsituacao);
                        setFlCentroCusto(conta.flcentrocusto);
                        conta = {
                            ...conta,
                            numnf: result.numnf,
                            serienf: result.serienf,
                            modelonf: result.modelonf,
                            dtvencimento: new Date(conta.dtvencimento).toLocaleDateString(),
                            datacad: new Date(conta.datacad).toLocaleString(),
                            ultalt: new Date(conta.ultalt).toLocaleString(),
                        }
                        if (conta.flsituacao == "P") {
                            setFlSituacao(conta.flsituacao);
                        } else if (conta.flsituacao == "A") {
                            if (new Date(conta.dtvencimento) > new Date()) {
                                setFlSituacao(conta.flsituacao);
                            } else if (new Date(conta.dtvencimento) < new Date(new Date().toLocaleDateString())) {
                                setFlSituacao('V');
                            } else {
                                setFlSituacao('VH');
                            }
                        }
                        formRef.current?.setData(conta);
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
    // #endregion

    return (
        <LayoutBase 
            titulo={id === 'novo' ? 'Cadastrar Conta' : 'Visualizar Conta'}
            barraDeFerramentas={
                <DetailTools
                    mostrarBotaoSalvar={false}
                    mostrarBotaoNovo={false}
                    mostrarBotaoSalvarFechar={!isEditing}
                    mostrarBotaoApagar={false}

                    disableButtons={isValidating}

                    onClickSalvarFechar={saveAndClose}
                    onClickVoltar={() => {
                        if (isDialog) {
                            toggleOpen?.();
                        } else {
                            navigate('/contaspagar');
                        }
                    }}
                />
            }
        >
            <VForm ref={formRef} onSubmit={() => {}}>
                <Box margin={1} display="flex" flexDirection="column" component={Paper} alignItems="center">
                    
                    <Grid item container xs={12} sm={10} md={10} lg={10} xl={8} direction="column" padding={2} spacing={2} alignItems="left">
                        {isLoading && (
                            <Grid item>
                                <LinearProgress variant="indeterminate"/>
                            </Grid>
                        )}

                        <Grid container item direction="row" spacing={2} justifyContent="left">
                            <Grid item xs={12} sm={12} md={4} lg={3} xl={2}>
                                <Typography variant="h6">Situação</Typography>
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={3} xl={2}>
                                {(flSituacao === 'A') && (
                                    <Chip label="ABERTA" color="info"/>
                                )}
                                {(flSituacao === 'V') && (
                                    <Chip label="VENCIDA" color="error"/>
                                )}
                                {flSituacao === 'P' && (
                                    <Chip label="RECEBIDA" color="success"/>
                                )}
                                {flSituacao === 'VH' && (
                                    <Chip label="VENCE HOJE" color="warning"/>
                                )}
                            </Grid>

                            <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
                                <Typography variant="h6">Centro de Custo</Typography>
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={3} xl={2}>
                                {flCentroCusto == 'C' ? (
                                    <Chip label="COMPRAS" color="primary"/>
                                ) : flCentroCusto == 'V' ? (
                                    <Chip label="VENDAS" color="primary"/>
                                ) : `SEM CENTRO DE CUSTO`}
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2} justifyContent="left">
                            <Grid item xs={12} sm={12} md={4} lg={3} xl={2}>
                                <VNumberInput
                                    readOnly={isEditing}
                                    disabled={isLoading}
                                    size="small"
                                    fullWidth
                                    name="nrparcela"
                                    label="Nr. Parcela"
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={8} lg={9} xl={10}>
                                    <VTextField
                                        inputProps={{
                                            readOnly: isEditing
                                        }}
                                        size="small"
                                        disabled={isLoading}
                                        fullWidth
                                        name="fornecedor.razsocial"
                                        label="Fornecedor"
                                    />
                                </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2} justifyContent="center">
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <VTextField
                                        inputProps={{
                                            readOnly: isEditing
                                        }}
                                        size="small"
                                        disabled={isLoading}
                                        fullWidth
                                        name="numnf"
                                        label="NF"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <VTextField
                                        inputProps={{
                                            readOnly: isEditing
                                        }}
                                        size="small"
                                        disabled={isLoading}
                                        fullWidth
                                        name="serienf"
                                        label="Série"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <VTextField
                                        inputProps={{
                                            readOnly: isEditing
                                        }}
                                        size="small"
                                        disabled={isLoading}
                                        fullWidth
                                        name="modelonf"
                                        label="Modelonf"
                                    />
                                </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2} justifyContent="center">
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <VTextField
                                        inputProps={{
                                            readOnly: isEditing
                                        }}
                                        size="small"
                                        disabled={isLoading}
                                        fullWidth
                                        name="dtvencimento"
                                        label="Dt. Vencimento"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <VTextField
                                        inputProps={{
                                            readOnly: isEditing
                                        }}
                                        size="small"
                                        disabled={isLoading}
                                        fullWidth
                                        name="formapagamento.descricao"
                                        label="Forma de Pagamento"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <VMoneyInput
                                        readOnly={isEditing}
                                        size="small"
                                        disabled={isLoading}
                                        fullWidth
                                        name="vltotal"
                                        label="Vl. Total"
                                    />
                                </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2} justifyContent="center">
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <VTextField
                                        multiline
                                        inputProps={{
                                            readOnly: isEditing
                                        }}
                                        size="small"
                                        disabled={isLoading}
                                        fullWidth
                                        name="observacao"
                                        label="Observação"
                                    />
                                </Grid>
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

                </Box>
            </VForm>
        </LayoutBase>
    )

}