// #region EXTERNAL IMPORTS
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, CircularProgress, Collapse, Grid, Icon, IconButton, InputAdornment, InputLabel, LinearProgress, MenuItem, OutlinedInput, Paper, Select, Typography } from "@mui/material";
import * as yup from 'yup';
import { toast } from "react-toastify";
// #endregion

// #region INTERNAL IMPORTS
import { CustomDialog, DetailTools } from "../../shared/components";
import { LayoutBase } from "../../shared/layouts";
import { IDetalhesProdutos, IProdutos } from "../../shared/interfaces/entities/Produtos";
import { VTextField, VForm, useVForm, IVFormErrors, VAutocompleteSearch, VSelect } from "../../shared/forms"
import { useDebounce } from "../../shared/hooks";
import ControllerProdutos from "../../shared/controllers/ProdutosController";
import { IVariacoes } from "../../shared/interfaces/entities/Variacoes";
import { IFornecedores } from "../../shared/interfaces/entities/Fornecedores";
import { DataTable, IHeaderProps } from "../../shared/components/data-table/DataTable";
import ControllerGrades from "../../shared/controllers/GradesController";
import { ConsultaGrades } from "../grades/ConsultaGrades";
import { IGrades } from "../../shared/interfaces/entities/Grades";
import { ICaracteristicas, TListaCaracteristicas } from "../../shared/interfaces/entities/Caracteristicas";
import ControllerCaracteristicas from "../../shared/controllers/CaracteristicasController";
import ControllerVariacoes from "../../shared/controllers/VariacoesController";
import ControllerFornecedores from "../../shared/controllers/FornecedoresController";
import { ConsultaFornecedores } from "../fornecedores/ConsultaFornecedores";
// #endregion

// #region INTERFACES
interface IFormData {
    gtin: string;
    descricao: string;
    apelido: string | undefined;
    marca: string;
    undmedida: string;
    unidade: number | undefined;
    pesoliq: number | undefined;
    pesobruto: number | undefined;
    ncm: string;
    cfop: string;
    percicmssaida: number | undefined;
    percipi: number | undefined;
    qtdideal: number | undefined;
    qtdmin: number | undefined;
}

interface ICadastroProps {
    isDialog?: boolean;
    toggleOpen?: () => void;
    selectedId?: number;
    reloadDataTableIfDialog?: () => void;
}

// #endregion

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
    gtin: yup.string().required(),
    descricao: yup.string().required(),
    apelido: yup.string(),
    marca: yup.string().required(),
    undmedida: yup.string().required(),
    unidade: yup.number(),
    pesoliq: yup.number(),
    pesobruto: yup.number(),
    ncm: yup.string().required(),
    cfop: yup.string().required(),
    percicmssaida: yup.number(),
    percipi: yup.number(),
    qtdideal: yup.number(),
    qtdmin: yup.number()
})

export const CadastroProdutos: React.FC<ICadastroProps> = ({isDialog = false, toggleOpen, selectedId, reloadDataTableIfDialog}) => {
    // #region CONTROLLERS
        const controller = new ControllerProdutos();
        const controllerGrades = new ControllerGrades();
        const controllerCaracteristicas = new ControllerCaracteristicas();
        const controllerVariacoes = new ControllerVariacoes();
        const controllerFornecedores = new ControllerFornecedores();
    // #endregion

    // #region HOOKS
    const { id = 'novo' } = useParams<'id'>();
    const navigate = useNavigate();
    const { formRef, save, saveAndNew, saveAndClose, isSaveAndNew, isSaveAndClose } = useVForm();
    const { debounce } = useDebounce();
    // #endregion

    // #region STATES
    const [isLoading, setIsLoading] = useState(false);
    const [isValidating, setIsValidating] = useState<any>(null);
    const [isValid, setIsValid] = useState(false);
    const [descricao, setDescricao] = useState("");
    const [produtoOriginal, setProdutoOriginal] = useState<IDetalhesProdutos | null>(null);
    const [listaVariacoes, setListaVariacoes] = useState<IVariacoes[]>([]);
    const [fornecedor, setFornecedor] = useState<IFornecedores | null>(null);
    const [isConsultaGradesDialogOpen, setIsConsultaGradesDialogOpen] = useState(false);
    const [isConsultaFornecedoresDialogOpen, setIsConsultaFornecedoresDialogOpen] = useState(false);
    const [idGrade, setIdGrade] = useState<number | undefined>();
    const [idCaracteristica, setIdCaracteristica] = useState<number | undefined>();
    const [idVariacao, setIdVariacao] = useState<number | undefined>();
    const [selectCaracteristicas, setSelectCaracteristicas] = useState<ICaracteristicas[]>([]);
    const [selectVariacoes, setSelectVariacoes] = useState<IVariacoes[]>([]);
    // #endregion

    // #region ACTIONS
    const toggleConsultaGradesDialogOpen = () => {
        setIsConsultaGradesDialogOpen(oldValue => !oldValue);
    }

    const toggleConsultaFornecedoresDialogOpen = () => {
        setIsConsultaFornecedoresDialogOpen(oldValue => !oldValue);
    }

    const headers: IHeaderProps[] = [
        {
            label: "ID",
            name: "id"
        },
        {
            label: "Descrição",
            name: "descricao"
        },
        {
            label: "Característica",
            name: "caracteristica.descricao"
        },
        {
            label: "Ações",
            name: " ",
            align: "right",
            render: (row) => {
                return (
                    <>
                        <IconButton
                            color="error" 
                            size="small" 
                            onClick={() => {
                                if (window.confirm('Deseja excluir esta parcela?')) {
                                    const mArray = listaVariacoes.slice();
                                    const index = mArray.findIndex(item => item.id == row.id);
                                    delete mArray[index];
                                    mArray.length = listaVariacoes.length-1;
                                    setListaVariacoes(mArray);
                                }
                            }}
                        >
                            <Icon>delete</Icon>
                        </IconButton>
                    </>
                )
            }
        }
    ]

    useEffect(() => {
        if (idGrade) {
            setIsLoading(true)
            controllerCaracteristicas.getByGrade(idGrade)
                .then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        toast.error(result.message);
                    } else {
                        var listaAux = result.data;
                        var listacaracteristicas = listaAux.filter(item => item.grade.id == idGrade);
                        setSelectCaracteristicas(listacaracteristicas);
                    }
                })
        }
    }, [idGrade]);

    useEffect(() => {
        if (idCaracteristica) {
            setIsLoading(true)
            controllerVariacoes.getByCaracteristica(idCaracteristica)
                .then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        toast.error(result.message);
                    } else {
                        var listaAux = result.data;
                        var listavariacoes = listaAux.filter(item => item.caracteristica.id == idCaracteristica);
                        setSelectVariacoes(listavariacoes);
                    }
                })
        }
    }, [idCaracteristica]);

    useEffect(() => {
        if (isDialog) {
            if (selectedId !== 0) {
                setIsLoading(true);
                controller.getOne(Number(selectedId))
                    .then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            toast.error(result.message);
                            navigate('/produtos');
                        } else {
                            result.datacad = new Date(result.datacad).toLocaleString();
                            result.ultalt = new Date(result.ultalt).toLocaleString();
                            setListaVariacoes(result.listavariacoes);
                            formRef.current?.setData(result);
                            setIsValid(true);
                            setDescricao(result.descricao);
                            setProdutoOriginal(result);
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
                controller.getOne(Number(id))
                    .then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            toast.error(result.message);
                            navigate('/produtos');
                        } else {
                            setListaVariacoes(result.listavariacoes);
                            result.datacad = new Date(result.datacad).toLocaleString();
                            result.ultalt = new Date(result.ultalt).toLocaleString();
                            formRef.current?.setData(result);
                            setIsValid(true);
                            setDescricao(result.descricao);
                            setProdutoOriginal(result);
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
        if (descricao != "") validate(descricao);
    }, [descricao]);

    const validate = (filter: string) => {
        debounce(() => {
            if (!isValid && filter != "" && (filter.toUpperCase() != produtoOriginal?.descricao)) {
                setIsValidating(true);
                debounce(() => {
                    controller.validate({
                        descricao: filter
                    })
                        .then((result) => {
                            setIsValidating(false);
                            if (result instanceof Error) {
                                toast.error(result.message);
                            } else {
                                setIsValid(result);
                                if (result === false) {
                                    const validationErrors: IVFormErrors = {};
                                    validationErrors['descricao'] = 'Esse produto já está cadastrado.';
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

    const insertVariacao = (idVariacao: number) => {
        let variacao = selectVariacoes.find(item => item.id == idVariacao);
        if (variacao) {
            let variacaoAux = listaVariacoes.find(item => item.id == variacao?.id);
            if (variacaoAux) {
                toast.error('Esta variação já foi selecionada.')
                const validationErrors: IVFormErrors = {};
                validationErrors['variacao'] = 'Esta variação já foi selecionada.';
                formRef.current?.setErrors(validationErrors);
            } else {
                variacaoAux = listaVariacoes.find(item => item.caracteristica.id == variacao?.caracteristica.id);
                if (variacaoAux) {
                    toast.error('Já existe uma variação com a característica selecionada.');
                    const validationErrors: IVFormErrors = {};
                    validationErrors['caracteristica'] = 'Verifique a caracteristica';
                    formRef.current?.setErrors(validationErrors);
                } else {
                    setListaVariacoes([
                        ...listaVariacoes,
                        variacao
                    ]);
                    formRef.current?.setFieldValue('grade', null);
                    formRef.current?.setFieldValue('caracteristica', '');
                    formRef.current?.setFieldValue('variacao', '');
                    setIdVariacao(undefined);
                    setIdCaracteristica(undefined);
                    setIdGrade(undefined);
                    setSelectVariacoes([]);
                    setSelectCaracteristicas([]);
                }
            }
        }
    }

    const handleSave = (dados: IFormData) => {
        formValidationSchema
            .validate(dados, { abortEarly: false })
                .then((dadosValidados) => {
                    var errors = false;
                    if (!formRef.current?.getData().fornecedor) {
                        errors = true;
                    }
                    if (listaVariacoes.length == 0) {
                        errors = true;
                    }
                    if (errors) {
                        setIsValid(false);
                    }
                    if(isValid) {
                        setIsLoading(true);
                        if (isDialog) {
                            if (selectedId === 0) {
                                controller.create({
                                    ...dadosValidados,
                                    vlcusto: 0,
                                    vlcompra: 0,
                                    vlvenda: 0,
                                    lucro: 0,
                                    cargatribut: 0,
                                    vlfrete: 0,
                                    qtdatual: 0,
                                    fornecedor: formRef.current?.getData().fornecedor,
                                    listavariacoes: listaVariacoes
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
                                                    navigate('/produtos')
                                                } 
                                            } else if (isSaveAndNew()) {
                                                setIsValidating('');
                                                setIsValid(false);
                                                navigate('/produtos/cadastro/novo');
                                                formRef.current?.setData({
                                                    descricao: ''
                                                });
                                            } else {
                                                setIsValidating(null);
                                                navigate(`/produtos/cadastro/${result}`);
                                            }
                                        }
                                    });
                            } else {
                                controller.update(Number(selectedId), {
                                    ...dadosValidados,
                                    vlcusto: 0,
                                    vlcompra: 0,
                                    vlvenda: 0,
                                    lucro: 0,
                                    cargatribut: 0,
                                    vlfrete: 0,
                                    qtdatual: 0,
                                    fornecedor: formRef.current?.getData().fornecedor,
                                    listavariacoes: listaVariacoes
                                })
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
                                                    navigate('/produtos')
                                                } 
                                            } else {
                                                setIsValidating(null);
                                            }
                                        }
                                    });
                            }
                        } else {
                            if (id === 'novo') {
                                controller.create({
                                    ...dadosValidados,
                                    vlcusto: 0,
                                    vlcompra: 0,
                                    vlvenda: 0,
                                    lucro: 0,
                                    cargatribut: 0,
                                    vlfrete: 0,
                                    qtdatual: 0,
                                    fornecedor: formRef.current?.getData().fornecedor,
                                    listavariacoes: listaVariacoes
                                })
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
                                                    navigate('/produtos')
                                                }
                                                ;  
                                            } else if (isSaveAndNew()) {
                                                setIsValidating('');
                                                setIsValid(false);
                                                navigate('/produtos/cadastro/novo');
                                                formRef.current?.setData({
                                                    descricao: ''
                                                });
                                            } else {
                                                setIsValidating(null);
                                                navigate(`/produtos/cadastro/${result}`);
                                            }
                                        }
                                    });
                            } else {
                                controller.update(Number(id), {
                                    ...dadosValidados,
                                    vlcusto: 0,
                                    vlcompra: 0,
                                    vlvenda: 0,
                                    lucro: 0,
                                    cargatribut: 0,
                                    vlfrete: 0,
                                    qtdatual: 0,
                                    fornecedor: formRef.current?.getData().fornecedor,
                                    listavariacoes: listaVariacoes
                                })
                                    .then((result) => {
                                        setIsLoading(false);
                                        if (result instanceof Error) {
                                            toast.error(result.message);
                                        } else {
                                            toast.success('Alterado com sucesso!');
                                            if (isSaveAndClose()) {
                                                navigate('/produtos')
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

                    if (!formRef.current?.getData().fornecedor) {
                        validationErrors['fornecedor'] = 'O campo é obrigatório'
                    }
                    if (listaVariacoes.length == 0) {
                        if (!idGrade) {
                            validationErrors['grade'] = 'Selecione uma grade.'
                        } else if (!idCaracteristica) {
                            validationErrors['caracteristica'] = 'Selecione uma característica.'
                        } else if (!idVariacao) {
                            validationErrors['variacao'] = 'Selecione uma variação.'
                        }
                        toast.error("Selecione pelo menos uma variação para o produto.");
                    }

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
            titulo={id === 'novo' ? 'Cadastrar Produto' : 'Editar Produto'}
            barraDeFerramentas={
                <DetailTools
                    mostrarBotaoSalvarFechar
                    mostrarBotaoSalvar={id == 'novo' && !isDialog}
                    mostrarBotaoSalvarNovo={id == 'novo' && !isDialog}
                    mostrarBotaoApagar={id !== 'novo' && !isDialog}
                    mostrarBotaoNovo={id !== 'novo' && !isDialog}

                    disableButtons={isValidating}
                    
                    onClickSalvar={save}
                    onClickSalvarNovo={saveAndNew}
                    onClickSalvarFechar={saveAndClose}
                    onClickApagar={() => handleDelete(Number(id))}
                    onClickNovo={() => navigate('/produtos/cadastro/novo') }
                    onClickVoltar={() => {
                        if (isDialog) toggleOpen?.()
                        else navigate('/produtos');
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
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <VTextField 
                                    size="small"
                                    required
                                    fullWidth
                                    name='gtin' 
                                    label="GTIN"
                                    disabled={isLoading}                             
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <VTextField 
                                    size="small"
                                    required
                                    fullWidth
                                    name='descricao' 
                                    label="Descrição"
                                    disabled={isLoading}                             
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                { (isValidating && formRef.current?.getData().descricao) && (
                                                    <Box sx={{ display: 'flex' }}>
                                                        <CircularProgress size={24}/>
                                                    </Box>
                                                ) }
                                                { (isValid && formRef.current?.getData().descricao) && (
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
                                        formRef.current?.setFieldError('descricao', '');
                                        validate(e.target.value);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <VTextField 
                                    size="small"
                                    fullWidth
                                    name='apelido' 
                                    label="Apelido"
                                    disabled={isLoading}                             
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <VTextField 
                                    size="small"
                                    required
                                    fullWidth
                                    name='marca' 
                                    label="Marca"
                                    disabled={isLoading}                             
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <VAutocompleteSearch
                                    size="small"
                                    required
                                    name="fornecedor"
                                    label={["razsocial"]}
                                    TFLabel="Fornecedor"
                                    getAll={controllerFornecedores.getAll}
                                    onChange={(value) => {
                                        setFornecedor(value);
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

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <VTextField 
                                    size="small"
                                    required
                                    fullWidth
                                    name='undmedida' 
                                    label="Unidade de Medida"
                                    disabled={isLoading}                             
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <VTextField 
                                    type="number"
                                    size="small"
                                    fullWidth
                                    name='unidade' 
                                    label="Unidade"
                                    disabled={isLoading}                             
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <VTextField
                                    type="number"
                                    size="small"
                                    fullWidth
                                    name='pesobruto' 
                                    label="Peso Bruto"
                                    disabled={isLoading}                             
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <VTextField 
                                    type="number"
                                    size="small"
                                    fullWidth
                                    name='pesoliq' 
                                    label="Peso Líquido"
                                    disabled={isLoading}                             
                                />
                            </Grid>
                        </Grid>

                        <Grid item>
                            <Typography variant="h6">Dados Fiscais</Typography>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <VTextField 
                                    size="small"
                                    required
                                    fullWidth
                                    name='ncm' 
                                    label="NCM"
                                    disabled={isLoading}                             
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <VTextField 
                                    size="small"
                                    required
                                    fullWidth
                                    name='cfop' 
                                    label="CFOP"
                                    disabled={isLoading}                             
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <VTextField 
                                    type="number"
                                    size="small"
                                    fullWidth
                                    name='percicmssaida' 
                                    label="ICMS Saída %"
                                    disabled={isLoading}                             
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <VTextField 
                                    type="number"
                                    size="small"
                                    fullWidth
                                    name='percipi' 
                                    label="IPI %"
                                    disabled={isLoading}                             
                                />
                            </Grid>
                        </Grid>

                        <Grid item>
                            <Typography variant="h6">Dados de Estoque</Typography>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <VTextField 
                                    type="number"
                                    size="small"
                                    fullWidth
                                    name='qtdideal' 
                                    label="Qtd. Ideal"
                                    disabled={isLoading}                             
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <VTextField 
                                    type="number"
                                    size="small"
                                    fullWidth
                                    name='qtdmin' 
                                    label="Qtd. Mínima"
                                    disabled={isLoading}                             
                                />
                            </Grid>
                        </Grid>

                        <Grid item>
                            <Typography variant="h6">Dados de Grades</Typography>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <VAutocompleteSearch
                                    size="small"
                                    required
                                    name="grade"
                                    label={["descricao"]}
                                    TFLabel="Grade"
                                    getAll={controllerGrades.getAll}
                                    onInputchange={() => {
                                        formRef.current?.setFieldError('caracteristica', '');
                                        formRef.current?.setFieldError('variacao', '');
                                        formRef.current?.setFieldValue('grade', null);
                                        formRef.current?.setFieldValue('caracteristica', '');
                                        formRef.current?.setFieldValue('variacao', '');
                                        setSelectVariacoes([]);
                                        setSelectCaracteristicas([]);
                                    }}
                                    onChange={(value) => {
                                        formRef.current?.setFieldError('caracteristica', '');
                                        formRef.current?.setFieldError('variacao', '');
                                        if (!value) {
                                            formRef.current?.setFieldValue('grade', null);
                                            formRef.current?.setFieldValue('caracteristica', '');
                                            formRef.current?.setFieldValue('variacao', '');
                                            setIdVariacao(undefined);
                                            setIdCaracteristica(undefined);
                                            setIdGrade(undefined);
                                            setSelectVariacoes([]);
                                            setSelectCaracteristicas([]);
                                        } else {
                                            setIdGrade(value.id);
                                        }
                                    }}
                                    onClickSearch={() => {
                                        toggleConsultaGradesDialogOpen();
                                    }}
                                    isDialogOpen={isConsultaGradesDialogOpen}
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <InputLabel id="lblcaracteristica">Característica</InputLabel>
                                <VSelect
                                    defaultValue=" "
                                    name="caracteristica"
                                    labelId="lblcaracteristica"
                                    disabled={!idGrade}
                                    size="small"
                                    fullWidth
                                    onChange={(e) => {
                                        formRef.current?.setFieldError('variacao', '');
                                        if (!e.target.value) {
                                            formRef.current?.setFieldValue('grade', null);
                                            formRef.current?.setFieldValue('caracteristica', '');
                                            formRef.current?.setFieldValue('variacao', '');
                                        } else {
                                            setIdCaracteristica(Number(e.target.value))
                                        }
                                    }}
                                >
                                    {selectCaracteristicas.map(item => {
                                        return (
                                            <MenuItem value={item.id}>{item.descricao}</MenuItem>
                                        )
                                    })}
                                </VSelect>
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2} alignItems="end">
                            <Grid item xs={10} sm={10} md={6} lg={6} xl={6}>
                                <InputLabel id="lblvariacao">Variação</InputLabel>
                                <VSelect
                                    name="variacao"
                                    labelId="lblvariacao"
                                    disabled={!idCaracteristica}
                                    placeholder="Variação"
                                    size="small"
                                    fullWidth
                                    onChange={(e) => {
                                        setIdVariacao(Number(e.target.value));
                                    }}
                                    label="Variação"
                                >
                                    {selectVariacoes.map(item => {
                                        return (
                                            <MenuItem value={item.id}>{item.descricao}</MenuItem>
                                        )
                                    })}
                                </VSelect>                            
                            </Grid>
                            <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                                <Button
                                    variant="contained" 
                                    color="success"
                                    size="large"
                                    onClick={e => {
                                        if (idVariacao) {
                                            insertVariacao(idVariacao);
                                        } else {
                                            const validationErrors: IVFormErrors = {};
                                            if (!idGrade) {
                                                toast.error("Selecione uma grade");
                                                validationErrors['grade'] = 'Selecione uma grade.';
                                            } else if (!idCaracteristica) {
                                                toast.error("Selecione uma característica");
                                                validationErrors['caracteristica'] = 'Selecione uma característica.';
                                            } else if (!idVariacao) {
                                                toast.error("Selecione uma variação");
                                                validationErrors['variacao'] = 'Selecione uma variação.';
                                            }
                                            formRef.current?.setErrors(validationErrors);
                                        }
                                    }}
                                >
                                    <Icon>add</Icon>
                                </Button>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={4} xl={6}>
                            <DataTable
                                rowCount={listaVariacoes.length}
                                headers={headers}
                                rows={listaVariacoes}
                                rowId="id"
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
                                setIdGrade(row.id);

                                formRef.current?.setFieldError('caracteristica', '');
                                formRef.current?.setFieldError('variacao', '');
                                setIdVariacao(undefined);
                                setIdCaracteristica(undefined);
                                setSelectVariacoes([]);
                                setSelectCaracteristicas([]);
                            }}
                            toggleDialogOpen={toggleConsultaGradesDialogOpen}
                        />
                    </CustomDialog>

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
                                setFornecedor(row);
                            }}
                            toggleDialogOpen={toggleConsultaFornecedoresDialogOpen}
                        />
                    </CustomDialog>

                </Box>
            </VForm>
        </LayoutBase>
    )

}