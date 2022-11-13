// #region EXTERNAL IMPORTS
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, CircularProgress, Collapse, Divider, FormHelperText, Grid, Icon, IconButton, InputAdornment, LinearProgress, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography } from "@mui/material";
import * as yup from 'yup';
import { toast } from "react-toastify";
// #endregion

// #region INTERNAL IMPORTS
import { CustomDialog, DetailTools } from "../../shared/components";
import { LayoutBase } from "../../shared/layouts";
import { VTextField, VForm, useVForm, IVFormErrors, VAutocompleteSearch, VSelect } from "../../shared/forms"
import { useDebounce } from "../../shared/hooks";
import { IDetalhesParcelas, IParcelas, TListaParcelas } from "../../shared/interfaces/entities/Parcelas";
import { Environment } from "../../shared/environment";
import { CadastroPaises } from "../paises/CadastroPaises";
import { ConsultaFormasPagamento } from "../formasPagamento/ConsultaFormasPagamento";
import { DataTable, IHeaderProps } from "../../shared/components/data-table/DataTable";
import { ICondicoesPagamento, IDetalhesCondicoesPagamento } from "../../shared/interfaces/entities/CondicoesPagamento";
import ControllerCondicoesPagamento from "../../shared/controllers/CondicoesPagamentoController";
import ControllerFormasPagamento from "../../shared/controllers/FormasPagamentoController";
import { ICadastroProps } from "../../shared/interfaces/views/Cadastro";
// #endregion

// #region INTERFACES
interface IFormData {
    descricao: string;
    txdesc: number;
    txmulta: number;
    txjuros: number;
}

// #endregion


const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
    descricao: yup.string().required(),
    txdesc: yup.number().required(),
    txmulta: yup.number().required(),
    txjuros: yup.number().required(),
})

export const CadastroCondicoesPagamento: React.FC<ICadastroProps> = ({isDialog = false, toggleOpen, selectedId, reloadDataTableIfDialog}) => {
    // #region CONTROLLERS
        const controller = new ControllerCondicoesPagamento();
        const controllerFormasPagamento = new ControllerFormasPagamento();
    // #endregion

    // #region HOOKS
    const { id = 'novo' } = useParams<'id'>();
    const navigate = useNavigate();
    const { debounce } = useDebounce();
    const { formRef, save, saveAndNew, saveAndClose, isSaveAndNew, isSaveAndClose } = useVForm();
    // #endregion

    // #region STATES
    const [obj, setObj] = useState<ICondicoesPagamento | null>(null);
    const [listaparcelas, setListaParcelas] = useState<IParcelas[]>([]);
    const [parcela, setParcela] = useState<IParcelas | null>(null);
    const [isConsultaFormasPgtoDialogOpen, setIsConsultaFormasPgtoDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isValidating, setIsValidating] = useState<any>(null);
    const [isValid, setIsValid] = useState(false);
    const [isValidParcelas, setIsValidParcelas] = useState(false);
    const [isEditingParcela, setIsEditingParcela] = useState(false);
    const [parcelaSelected, setParcelaSelected] = useState<IParcelas | null>(null);
    const [descricao, setDescricao] = useState("");
    const [condicaoPagamentoOriginal, setCondicaoPagamentoOriginal] = useState<IDetalhesCondicoesPagamento | null>(null);
    // #endregion

    // #region ACTIONS
    const headers: IHeaderProps[] = [
        {
            label: "Número",
            name: "numero"
        },
        {
            label: "Dias",
            name: "dias"
        },
        {
            label: "Percentual",
            name: "percentual"
        },
        {
            label: "Forma de Pagamento",
            name: "formapagamento.descricao"
        },
        {
            label: "Ações",
            name: " ",
            align: "right",
            render: (row) => {
                return (
                    <>
                        <IconButton
                            disabled={isEditingParcela} 
                            color="error" 
                            size="small" 
                            onClick={() => {
                                if (window.confirm('Deseja excluir esta parcela?')) {
                                    const mArray = listaparcelas.slice();
                                    delete mArray[row.numero-1];
                                    mArray.length = listaparcelas.length-1;
                                    setListaParcelas(mArray);
                                }
                            }}
                        >
                            <Icon>delete</Icon>
                        </IconButton>
                        <IconButton
                            disabled={isEditingParcela} 
                            color="primary" 
                            size="small"
                            onClick={() => {
                                setIsEditingParcela(true);
                                setParcelaSelected(row);
                            }}
                        >
                            <Icon>edit</Icon>
                        </IconButton>
                    </>
                )
            }
        }
    ]

    const toggleConsultaFormasPgtoDialogOpen = () => {
        setIsConsultaFormasPgtoDialogOpen(oldValue => !oldValue);
    }

    useEffect(() => {
        if (isEditingParcela) {
            formRef.current?.setFieldValue('parcela.dias', parcelaSelected?.dias);
            formRef.current?.setFieldValue('parcela.percentual', parcelaSelected?.percentual);
            formRef.current?.setFieldValue('parcela.formapagamento', parcelaSelected?.formapagamento);
        } else {
            formRef.current?.setFieldValue('parcela.dias', '');
            formRef.current?.setFieldValue('parcela.percentual', '');
            formRef.current?.setFieldValue('parcela.formapagamento', null);
        }
    }, [isEditingParcela])

    useEffect(() => {
        if (isDialog) {
            if (selectedId !== 0) {
                setIsLoading(true);
                controller.getOne(Number(selectedId))
                    .then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            toast.error(result.message);
                            navigate('/condicoespagamento');
                        } else {
                            result.datacad = new Date(result.datacad).toLocaleString();
                            result.ultalt = new Date(result.ultalt).toLocaleString();
                            formRef.current?.setData(result);
                            setIsValid(true);
                            setIsValidParcelas(true);
                            setCondicaoPagamentoOriginal(result);
                            setDescricao(result.descricao);
                            setListaParcelas(result.listaparcelas);
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
                            navigate('/condicoespagamento');
                        } else {
                            result.datacad = new Date(result.datacad).toLocaleString();
                            result.ultalt = new Date(result.ultalt).toLocaleString();
                            formRef.current?.setData(result);
                            setIsValid(true);
                            setIsValidParcelas(true);
                            setCondicaoPagamentoOriginal(result);
                            setDescricao(result.descricao);
                            setListaParcelas(result.listaparcelas);
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

    const insertParcela = () => {
        var totalPercParcelas: number = 0;
        listaparcelas.forEach((parcela) => totalPercParcelas += Number(parcela.percentual));
        totalPercParcelas += Number(formRef.current?.getData().parcela.percentual);
        if (isEditingParcela && parcelaSelected) {
            totalPercParcelas -= parcelaSelected?.percentual;
        }
        if ((totalPercParcelas > 100) || (formRef.current?.getData().parcela.percentual <= 0) || (formRef.current?.getData().parcela.dias < 0)) {
            const validationErrors: IVFormErrors = {};
            if (totalPercParcelas > 100) {
                toast.error('A soma do percentual total de parcelas não pode ser maior que 100%. Por favor, verifique.', { autoClose:  15000});
                validationErrors['parcela.percentual'] = 'Percentual inválido';
            }
            if (formRef.current?.getData().parcela.percentual <= 0) {
                toast.error('O percentual deve ser maior que zero. Por favor verifique.', { autoClose:  15000});
                validationErrors['parcela.percentual'] = 'Percentual inválido';
            }
            if (formRef.current?.getData().parcela.dias < 0) {
                toast.error('O número de dias deve ser inteiro e maior que zero. Por favor verifique.', { autoClose:  15000});
                validationErrors['parcela.dias'] = 'Número de dias inválido';
            }
            formRef.current?.setErrors(validationErrors);
        }
        else {
            if (isEditingParcela) {
                const newArray = listaparcelas.map((item) => {
                    if (item.numero == parcelaSelected?.numero) {
                        return {
                            ...item,
                            dias: formRef.current?.getData().parcela.dias,
                            percentual: formRef.current?.getData().parcela.percentual,
                            formapagamento: formRef.current?.getData().parcela.formapagamento
                        }
                    }
                    return item;
                })
                setIsEditingParcela(false);
                setListaParcelas(newArray);
            } else {
                let data = new Date();
                setListaParcelas([
                    ...listaparcelas,
                    {
                        numero: listaparcelas.length + 1,
                        dias: formRef.current?.getData().parcela.dias,
                        percentual: formRef.current?.getData().parcela.percentual,
                        formapagamento: formRef.current?.getData().parcela.formapagamento,
                        datacad: data.toLocaleString(),
                        ultalt: data.toLocaleString()
                    }
                ]);
            }
            formRef.current?.setFieldValue('parcela.dias', '');
            formRef.current?.setFieldValue('parcela.percentual', '');
            formRef.current?.setFieldValue('parcela.formapagamento', null);
            if (totalPercParcelas == 100) setIsValidParcelas(true);
        }
    }

    const validate = (filter: string) => {
        debounce(() => {
            if (!isValid && filter != "" && (filter.toUpperCase() != condicaoPagamentoOriginal?.descricao)) {
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
                                    validationErrors['descricao'] = 'Essa condição de pagamento já está cadastrada.';
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
                    if(isValid && isValidParcelas) {
                        setIsLoading(true);
                        if (isDialog) {
                            if (selectedId === 0) {
                                controller.create({
                                    ...dadosValidados,
                                    listaparcelas
                                })
                                    .then((result) => {
                                        setIsLoading(false);
                                        if (result instanceof Error) {
                                            toast.error(result.message)
                                        } else {
                                            toast.success('Cadastrado com sucesso!');
                                            reloadDataTableIfDialog?.();
                                            toggleOpen?.();
                                        }
                                    });
                            } else {
                                controller.update(Number(id), {
                                    ...dadosValidados,
                                    listaparcelas,
                                    flsituacao: formRef.current?.getData().flsituacao
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
                                    listaparcelas
                                })
                                    .then((result) => {
                                        setIsLoading(false);
                                        if (result instanceof Error) {
                                            toast.error(result.message)
                                        } else {
                                            toast.success('Cadastrado com sucesso!')
                                            if (isSaveAndClose()) {
                                                navigate('/condicoespagamento');
                                            } else if (isSaveAndNew()) {
                                                setIsValidating('');
                                                setIsValid(false);
                                                navigate('/condicoespagamento/cadastro/novo');
                                                formRef.current?.setData({
                                                    descricao: ''
                                                });
                                            } else {
                                                setIsValidating(null);
                                                navigate(`/condicoespagamento/cadastro/${result}`);
                                            }
                                        }
                                    });
                            } else {
                                controller.update(Number(id), {
                                    ...dadosValidados,
                                    listaparcelas,
                                    flsituacao: formRef.current?.getData().flsituacao
                                })
                                    .then((result) => {
                                        setIsLoading(false);
                                        if (result instanceof Error) {
                                            toast.error(result.message);
                                        } else {
                                            toast.success('Alterado com sucesso!');
                                            if (isSaveAndClose()) {
                                                navigate('/condicoespagamento')
                                            } else {
                                                setIsValidating(null);
                                            }
                                        }
                                    });
                            }
                        }
                    } else {
                        if (!isValid) toast.error('Verifique os campos.');
                        if (!isValidParcelas) toast.error('Verifique a porcentagem total das parcelas.')
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

    return (
        <LayoutBase 
            titulo={id === 'novo' ? 'Cadastrar Condição de Pagamento' : 'Editar Condição de Pagamento'}
            barraDeFerramentas={
                <DetailTools
                    mostrarBotaoSalvarFechar
                    mostrarBotaoSalvarNovo={id == 'novo' && !isDialog}
                    mostrarBotaoApagar={id !== 'novo' && !isDialog}
                    mostrarBotaoNovo={id !== 'novo' && !isDialog}
                    
                    disableButtons={isValidating}

                    onClickSalvar={save}
                    onClickSalvarNovo={saveAndNew}
                    onClickSalvarFechar={saveAndClose}
                    onClickApagar={() => handleDelete(Number(id))}
                    onClickNovo={() => navigate('/condicoespagamento/cadastro/novo') }
                    onClickVoltar={() => {
                        if (isDialog) {
                            toggleOpen?.();
                        } else {
                            navigate('/condicoespagamento');
                        }
                    }}
                />
            }
        >
            <VForm ref={formRef} onSubmit={handleSave}>
                <Box margin={1} display="flex" flexDirection="column" component={Paper} variant="outlined" alignItems="center">
                    <Grid item container xl={8} direction="column" padding={2} spacing={2} alignItems="left">

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


                        <Grid container item direction="row" spacing={2} justifyContent="center">
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={12}>
                                <VTextField
                                    size="small"
                                    required
                                    fullWidth
                                    name="descricao"
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
                                    onChange={(e) => {
                                        setIsValid(false);
                                        setIsValidating(false);
                                        formRef.current?.setFieldError('descricao', '');
                                        validate(e.target.value);
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2} justifyContent="center">
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                                <VTextField
                                    type="number"
                                    inputMode="decimal"
                                    size="small"
                                    required
                                    fullWidth
                                    name="txdesc"
                                    label="Desconto"
                                    disabled={isLoading}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                                <VTextField
                                    type="number"
                                    inputMode="decimal"
                                    size="small"
                                    required
                                    fullWidth
                                    name="txmulta"
                                    label="Multa"
                                    disabled={isLoading}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                                <VTextField
                                    type="number"
                                    inputMode="decimal"
                                    size="small"
                                    required
                                    fullWidth
                                    name="txjuros"
                                    label="Juros"
                                    disabled={isLoading}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Grid item>
                            <Divider orientation="horizontal"/>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6">Dados da Parcela</Typography>
                        </Grid>

                        <Grid container item direction="row" spacing={2} justifyContent="center" alignItems="start">
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                <VTextField
                                    type="number"
                                    size="small"
                                    required
                                    fullWidth
                                    name="parcela.dias"
                                    label="Dias"
                                    disabled={isLoading}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                <VTextField
                                    type="number"
                                    inputMode="decimal"
                                    size="small"
                                    required
                                    fullWidth
                                    name="parcela.percentual"
                                    label="Percentual"
                                    disabled={isLoading}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={6}>
                                <VAutocompleteSearch
                                    size="small"
                                    required
                                    name="parcela.formapagamento"
                                    label={["descricao"]}
                                    TFLabel="Forma de Pagamento"
                                    getAll={controllerFormasPagamento.getAll}
                                    onClickSearch={() => {
                                        toggleConsultaFormasPgtoDialogOpen();
                                    }}
                                    isDialogOpen={isConsultaFormasPgtoDialogOpen}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={1}>
                                <Button
                                    variant="contained" 
                                    color={ isEditingParcela ? "warning" : "success"} 
                                    size="large"
                                    onClick={e => {
                                        if (!!formRef.current?.getData().parcela.dias && !!formRef.current?.getData().parcela.percentual && !!formRef.current?.getData().parcela.formapagamento) {
                                            insertParcela();
                                        } else {
                                            const validationErrors: IVFormErrors = {};
                                            if (!formRef.current?.getData().parcela.dias) validationErrors['parcela.dias'] = 'O campo é obrigatório';
                                            if (!formRef.current?.getData().parcela.percentual) validationErrors['parcela.percentual'] = 'O campo é obrigatório';
                                            if (!formRef.current?.getData().parcela.formapagamento) validationErrors['parcela.formapagamento'] = 'O campo é obrigatório';
                                            formRef.current?.setErrors(validationErrors);                                                   
                                        }
                                    }}
                                >
                                    <Icon>{isEditingParcela ? "check" : "add"}</Icon>
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={1}>
                                <Button
                                    variant="contained" 
                                    color="error"
                                    size="large"
                                    onClick={(e) => {
                                        const validationErrors: IVFormErrors = {};
                                        validationErrors['parcela.dias'] = '';
                                        validationErrors['parcela.percentual'] = '';
                                        formRef.current?.setErrors(validationErrors);
                                        if (isEditingParcela) setIsEditingParcela(false);
                                        formRef.current?.setFieldValue('parcela.dias', '');
                                        formRef.current?.setFieldValue('parcela.percentual', '');
                                        formRef.current?.setFieldValue('parcela.formapagamento', null);
                                    }}
                                >
                                    <Icon>close</Icon>
                                </Button>
                            </Grid>
                        </Grid>

                        <Grid item>
                            <Divider orientation="horizontal"/>
                        </Grid>
                        <Grid container item direction="row" spacing={2} alignItems="baseline">
                            <Grid item>
                                <Typography variant="h6">Parcelas</Typography>
                            </Grid>
                        </Grid>
                        <Grid container item direction="row" spacing={2} justifyContent="center" alignItems="center">
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={12}>
                                <DataTable
                                    rowCount={listaparcelas.length}
                                    headers={headers}
                                    rowId="numero"
                                    rows={listaparcelas}
                                />
                                {/* <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: "auto" }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Número</TableCell>
                                                <TableCell>Dias</TableCell>
                                                <TableCell>Percentual</TableCell>
                                                <TableCell>Forma de pagamento</TableCell>
                                                <TableCell align="right">Ações</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {listaparcelas?.map(row => (
                                                <TableRow key={row.numero}>
                                                    <TableCell >{row.numero}</TableCell>
                                                    <TableCell>{row.dias}</TableCell>
                                                    <TableCell>{row.percentual+"%"}</TableCell>
                                                    <TableCell>{row.formapagamento.descricao}</TableCell>
                                                    <TableCell align="right">
                                                        <IconButton
                                                            disabled={isEditingParcela} 
                                                            color="error" 
                                                            size="small" 
                                                            onClick={() => {
                                                                if (window.confirm('Deseja excluir esta parcela?')) {
                                                                    const mArray = listaparcelas.slice();
                                                                    delete mArray[row.numero-1];
                                                                    mArray.length = listaparcelas.length-1;
                                                                    setListaParcelas(mArray);
                                                                }
                                                            }}
                                                        >
                                                            <Icon>delete</Icon>
                                                        </IconButton>
                                                        <IconButton
                                                            disabled={isEditingParcela} 
                                                            color="primary" 
                                                            size="small"
                                                            onClick={() => {
                                                                setIsEditingParcela(true);
                                                                setParcelaSelected(row);
                                                            }}
                                                        >
                                                            <Icon>edit</Icon>
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                        { listaparcelas.length === 0 && !isLoading && (
                                            <caption>{Environment.LISTAGEM_VAZIA}</caption>
                                        )}
                                    </Table>
                                </TableContainer>                                 */}
                            </Grid>
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
                        onClose={toggleConsultaFormasPgtoDialogOpen}
                        handleClose={toggleConsultaFormasPgtoDialogOpen} 
                        open={isConsultaFormasPgtoDialogOpen} 
                        title="Consultar Formas de Pagamento"
                        fullWidth
                        maxWidth="xl"
                    >
                        <ConsultaFormasPagamento 
                            isDialog
                            onSelectItem={(row) => formRef.current?.setFieldValue("parcela.formapagamento", row)}
                            toggleDialogOpen={toggleConsultaFormasPgtoDialogOpen}
                        />
                    </CustomDialog>
                </Box>
            </VForm>
        </LayoutBase>
    )

}