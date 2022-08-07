import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, CircularProgress, Collapse, Divider, Grid, Icon, IconButton, InputAdornment, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography } from "@mui/material";
import * as yup from 'yup';

import { DetailTools } from "../../shared/components";
import { LayoutBase } from "../../shared/layouts";
import { CondicoesPagamentoService } from "../../shared/services/api/condicoesPagamento/CondicoesPagamentoService";
import { FormasPagamentoService } from "../../shared/services/api/formasPagamento/FormasPagamentoService";
import { ICondicoesPagamento } from "../../shared/models/ModelCondicoesPagamento";
import { VTextField, VForm, useVForm, IVFormErrors, VAutocompleteSearch } from "../../shared/forms"
import { toast } from "react-toastify";
import { useDebounce } from "../../shared/hooks";
import { IParcelas, TListaParcelas } from "../../shared/models/ModelParcelas";
import { Environment } from "../../shared/environment";

interface IFormData {
    descricao: string;
    txdesc: number;
    txmulta: number;
    txjuros: number;
    datacad: string;
    ultalt: string;
}

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
    descricao: yup.string().required(),
    txdesc: yup.number().required(),
    txmulta: yup.number().required(),
    txjuros: yup.number().required(),
    datacad: yup.string().required(),
    ultalt: yup.string().required(),
})

export const CadastroCondicoesPagamento: React.FC = () => {
    const { id = 'novo' } = useParams<'id'>();
    const navigate = useNavigate();

    const { formRef, save, saveAndNew, saveAndClose, isSaveAndNew, isSaveAndClose } = useVForm();
    const { debounce } = useDebounce();

    const [obj, setObj] = useState<ICondicoesPagamento | null>(null);
    const [listaParcelas, setListaParcelas] = useState<IParcelas[]>([]);
    const [parcela, setParcela] = useState<IParcelas | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isValidating, setIsValidating] = useState<any>(null);

    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        if (id !== 'novo') {
            setIsLoading(true);

            CondicoesPagamentoService.getById(Number(id))
                .then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        toast.error(result.message);
                        navigate('/condicoespagamento');
                    } else {
                        console.log('RESULT', result);
                        formRef.current?.setData(result);
                        setObj(result);
                        setListaParcelas(result.listaparcelas);
                    }
                });
        } else {
            formRef.current?.setData({
                descricao: ''
            });
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
                CondicoesPagamentoService.validate(filter)
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
        dados.datacad = data.toLocaleString();
        dados.ultalt = data.toLocaleString();
        formValidationSchema
            .validate(dados, { abortEarly: false })
                .then((dadosValidados) => {
                    if(isValid) {
                        setIsLoading(true);
                        if (id === 'novo') {
                            CondicoesPagamentoService.create({ listaparcelas: listaParcelas, ...dadosValidados})
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
                            CondicoesPagamentoService.updateById(Number(id), { id: Number(id), listaparcelas: listaParcelas, ...dadosValidados })
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
            CondicoesPagamentoService.deleteById(id)
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

    return (
        <LayoutBase 
            titulo={id === 'novo' ? 'Cadastrar Condição de Pagamento' : 'Editar Condição de Pagamento'}
            barraDeFerramentas={
                <DetailTools
                    mostrarBotaoSalvarFechar
                    mostrarBotaoSalvarNovo={id == 'novo'}
                    mostrarBotaoApagar={id !== 'novo'}
                    mostrarBotaoNovo={id !== 'novo'}
                    
                    onClickSalvar={save}
                    onClickSalvarNovo={saveAndNew}
                    onClickSalvarFechar={saveAndClose}
                    onClickApagar={() => handleDelete(Number(id))}
                    onClickNovo={() => navigate('/condicoespagamento/cadastro/novo') }
                    onClickVoltar={() => navigate('/condicoespagamento') }
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

                        <Grid item>
                            <Typography variant="h6">Dados Gerais</Typography>
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
                                        formRef.current?.setFieldError('pais', '');
                                        debounce(() => {
                                            validate(e.target.value)
                                        })
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

                        { id == 'novo' && (
                            <>
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
                                    <Grid item xs={12} sm={12} md={6} lg={4} xl={7}>
                                        <VAutocompleteSearch
                                            size="small"
                                            required
                                            name="parcela.formapagamento"
                                            label="descricao"
                                            TFLabel="Forma de Pagamento"
                                            getAll={FormasPagamentoService.getAll}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} lg={4} xl={1}>
                                        <Button
                                            variant="contained" 
                                            color="success" 
                                            size="large"
                                            onClick={(e) => {
                                                let data = new Date();
                                                console.log(listaParcelas.length);
                                                console.log('DIAS', formRef.current?.getData().parcela.dias);
                                                console.log('PERC', formRef.current?.getData().parcela.percentual);
                                                console.log('FORMA',formRef.current?.getData().parcela.formapagamento);
                                                if (!!formRef.current?.getData().parcela.dias && !!formRef.current?.getData().parcela.percentual && !!formRef.current?.getData().parcela.formapagamento) {
                                                    setListaParcelas([
                                                        ...listaParcelas,
                                                        {
                                                            numero: listaParcelas.length + 1,
                                                            dias: formRef.current?.getData().parcela.dias,
                                                            percentual: formRef.current?.getData().parcela.percentual,
                                                            formapagamento: formRef.current?.getData().parcela.formapagamento,
                                                            datacad: data.toLocaleString(),
                                                            ultalt: data.toLocaleString()
                                                        }
                                                    ]);
                                                    formRef.current?.setFieldValue('parcela.dias', '');
                                                    formRef.current?.setFieldValue('parcela.percentual', '');
                                                    formRef.current?.setFieldValue('parcela.formapagamento', null);
                                                } else {
                                                    const validationErrors: IVFormErrors = {};
                                                    if (!formRef.current?.getData().parcela.dias) validationErrors['parcela.dias'] = 'O campo é obrigatório';
                                                    if (!formRef.current?.getData().parcela.percentual) validationErrors['parcela.percentual'] = 'O campo é obrigatório';
                                                    if (!formRef.current?.getData().parcela.formapagamento) validationErrors['parcela.formapagamento'] = 'O campo é obrigatório';
                                                    formRef.current?.setErrors(validationErrors);                                                   
                                                }
                                            }}
                                        >
                                            <Icon>add</Icon>
                                        </Button>
                                    </Grid>
                                </Grid>
                            </>
                        )}

                        <Grid item>
                            <Divider orientation="horizontal"/>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6">Parcelas</Typography>
                        </Grid>
                        <Grid container item direction="row" spacing={2} justifyContent="center" alignItems="center">
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={12}>
                                <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: "auto" }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Número</TableCell>
                                                <TableCell>Dias</TableCell>
                                                <TableCell>Percentual</TableCell>
                                                { id == 'novo' && (
                                                    <TableCell align="right">Ações</TableCell>
                                                )}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {listaParcelas?.map(row => (
                                                <TableRow key={row.numero}>
                                                    <TableCell >{row.numero}</TableCell>
                                                    <TableCell>{row.dias}</TableCell>
                                                    <TableCell>{row.percentual}</TableCell>
                                                    { id == 'novo' && (
                                                        <TableCell align="right">
                                                            <IconButton 
                                                                color="error" 
                                                                size="small" 
                                                                onClick={() => {
                                                                    if (window.confirm('Deseja excluir esta parcela?')) {
                                                                        const mArray = listaParcelas.slice();
                                                                        delete mArray[row.numero-1];
                                                                        mArray.length = listaParcelas.length-1;
                                                                        setListaParcelas(mArray);
                                                                    }
                                                                }}
                                                            >
                                                                <Icon>delete</Icon>
                                                            </IconButton>
                                                            <IconButton color="primary" size="small">
                                                                <Icon>edit</Icon>
                                                            </IconButton>
                                                        </TableCell>
                                                    ) }
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                        { listaParcelas.length === 0 && !isLoading && (
                                            <caption>{Environment.LISTAGEM_VAZIA}</caption>
                                        )}
                                    </Table>
                                </TableContainer>                                
                            </Grid>
                        </Grid>
                    </Grid>

                </Box>
            </VForm>
        </LayoutBase>
    )

}