import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, CircularProgress, Collapse, Grid, Icon, IconButton, InputAdornment, LinearProgress, Paper, Typography } from "@mui/material";
import * as yup from 'yup';

import { DetailTools } from "../../shared/components";
import { LayoutBase } from "../../shared/layouts";
import { CondicoesPagamentoService } from "../../shared/services/api/condicoesPagamento/CondicoesPagamentoService";
import { FormasPagamentoService } from "../../shared/services/api/formasPagamento/FormasPagamentoService";
import { ICondicoesPagamento } from "../../shared/models/ModelCondicoesPagamento";
import { VTextField, VForm, useVForm, IVFormErrors, VAutocomplete } from "../../shared/forms"
import { toast } from "react-toastify";
import { useDebounce } from "../../shared/hooks";

interface IFormData {
    descricao: string,
    dataCad: string,
    ultAlt: string
}

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
    descricao: yup.string().required(),
    dataCad: yup.string().required(),
    ultAlt: yup.string().required(),
})

export const CadastroCondicoesPagamento: React.FC = () => {
    const { id = 'novo' } = useParams<'id'>();
    const navigate = useNavigate();

    const { formRef, save, saveAndNew, saveAndClose, isSaveAndNew, isSaveAndClose } = useVForm();
    const { debounce } = useDebounce();

    const [obj, setObj] = useState<ICondicoesPagamento | null>(null);

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
                                validationErrors['descricao'] = 'Esta forma de pagamento j?? est?? cadastrada';
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
        dados.dataCad = data.toLocaleString();
        dados.ultAlt = data.toLocaleString();
        formValidationSchema
            .validate(dados, { abortEarly: false })
                .then((dadosValidados) => {
                    if(isValid) {
                        setIsLoading(true);
                        if (id === 'novo') {
                            CondicoesPagamentoService.create(dadosValidados)
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
                            CondicoesPagamentoService.updateById(Number(id), { id: Number(id), ...dadosValidados })
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
            titulo={id === 'novo' ? 'Cadastrar Condi????o de Pagamento' : 'Editar Condi????o de Pagamento'}
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
                    <Grid item container xl={6} direction="column" padding={2} spacing={2} alignItems="left">

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
                                    label="Descri????o"
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
                                    size="small"
                                    required
                                    fullWidth
                                    name="txdesc"
                                    label="% Desconto"
                                    disabled={isLoading}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                                <VTextField
                                    size="small"
                                    required
                                    fullWidth
                                    name="txmulta"
                                    label="% Multa"
                                    disabled={isLoading}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                                <VTextField
                                    size="small"
                                    required
                                    fullWidth
                                    name="txjuros"
                                    label="% Juros"
                                    disabled={isLoading}
                                />
                            </Grid>
                        </Grid>

                        { id == 'novo' && (
                            <Grid container item direction="row" spacing={2} justifyContent="center">
                                <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                    <VTextField
                                        size="small"
                                        required
                                        fullWidth
                                        name="dias"
                                        label="Dias"
                                        disabled={isLoading}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                    <VTextField
                                        size="small"
                                        required
                                        fullWidth
                                        name="percentual"
                                        label="Percentual"
                                        disabled={isLoading}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                                    <VAutocomplete
                                        size="small"
                                        required
                                        name="formapagamento"
                                        label="descricao"
                                        TFLabel="Forma de Pagamento"
                                        getAll={FormasPagamentoService.getAll}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={4} xl={1}>
                                    <Button variant="contained" color="success">
                                        <Icon>add</Icon>
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={4} xl={1}>
                                    <Button variant="contained" color="success">
                                        <Icon>add</Icon>
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={4} xl={1}>
                                    <Button variant="contained" color="success">
                                        <Icon>add</Icon>
                                    </Button>
                                </Grid>
                            </Grid>
                        )}

                    </Grid>

                </Box>
            </VForm>
        </LayoutBase>
    )

}