import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, CircularProgress, Collapse, Grid, Icon, IconButton, InputAdornment, LinearProgress, Paper, Typography } from "@mui/material";
import * as yup from 'yup';

import { DetailTools } from "../../shared/components";
import { LayoutBase } from "../../shared/layouts";
import { ProdutosService, IProdutos } from "../../shared/services/api/produtos/ProdutosService";
import { VTextField, VForm, useVForm, IVFormErrors, VAutocompleteSearch } from "../../shared/forms"
import { toast } from "react-toastify";
import { useDebounce } from "../../shared/hooks";
import { number } from "../../shared/utils/validations";
import { FornecedoresService, IFornecedores } from "../../shared/services/api/fornecedores/FornecedoresService";
import { ITiposProduto, TiposProdutoService } from "../../shared/services/api/tiposProduto/TiposProdutoService";

interface IFormData {
    descricao: string,
    valorCompra: number | undefined,
    valorVenda: number | undefined,
    tipoProduto: ITiposProduto | null,
    fornecedor: IFornecedores
}

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
    descricao: yup.string().required(),
    valorCompra: yup.number(),
    valorVenda: yup.number(),
    tipoProduto: yup.object().shape({
        id: yup.number().required(),
        descricao: yup.string().required()
    }).nullable().required(),
    fornecedor: yup.object().shape({
        id: yup.number().required(),
        razSocial: yup.string().required(),
        nomeFantasia: yup.string(),
        cnpj: yup.string().required().max(20).matches(number, 'Apenas números são aceitos neste campo.'),
        telefone: yup.string().matches(number, 'Apenas números são aceitos neste campo.'),
        endereco: yup.string(),
        numEnd: yup.string().matches(number, 'Apenas números são aceitos neste campo.'),
        bairro: yup.string(),
        cidade: yup.object().shape({
            id: yup.number().required(),
            cidade: yup.string().required(),
            estado: yup.object().shape({
                id: yup.number().required(),
                estado: yup.string().required(),
                uf: yup.string().required(),
                pais: yup.object().shape({
                    id: yup.number().required(),
                    pais: yup.string().required(),
                    sigla: yup.string().required()
                }).required()
            }).required()
        }).required()
    }).required()
})

export const CadastroProdutos: React.FC = () => {
    const { id = 'novo' } = useParams<'id'>();
    const navigate = useNavigate();

    const { formRef, save, saveAndNew, saveAndClose, isSaveAndNew, isSaveAndClose } = useVForm();
    const { debounce } = useDebounce();

    const [obj, setObj] = useState<IProdutos | null>(null)

    const [isLoading, setIsLoading] = useState(false);
    const [isValidating, setIsValidating] = useState<any>(null);

    const [isValid, setIsValid] = useState(false);
    const [alterando, setAlterando] = useState(false);

    const [descricao, setDescricao] = useState('');
    const [fornecedor, setFornecedor] = useState<IFornecedores | undefined>(undefined);

    useEffect(() => {
        if (id !== 'novo') {
            setIsLoading(true);

            ProdutosService.getById(Number(id))
                .then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        toast.error(result.message);
                        navigate('/produtos');
                    } else {
                        console.log('RESULT', result);
                        formRef.current?.setData(result);
                        setObj(result);
                        setAlterando(true);
                    }
                });
        } else {
            formRef.current?.setData({
                descricao: '',
                tipoProduto: null,
                fornecedor: '',
                valorCompra: 0.00,
                valorVenda: 0.00
            });
        }
    }, [id]);

    useEffect(() => {
        if (obj) setIsValid(true)
        else setIsValid(false);
    }, [obj])

    useEffect(() => {
        if (descricao && fornecedor) {
            const formData = formRef.current?.getData();
            const data = {
                descricao: formData?.descricao,
                tipoProduto: formData?.tipoProduto,
                fornecedor: formData?.fornecedor,
                valorCompra: formData?.valorCompra,
                valorVenda: formData?.valorVenda
            }
            validate(data);
        }
    }, [descricao, fornecedor])

    const validate = (dados: IFormData) => {
        const obj1 = {
            id: obj?.id,
            descricao: obj?.descricao,
            valorCompra: obj?.valorCompra,
            valorVenda: obj?.valorVenda,
            tipoProduto: obj?.tipoProduto,
            fornecedor: obj?.fornecedor
        }
        const obj2 = {
            id: Number(id),
            descricao: dados.descricao,
            valorCompra: dados.valorCompra,
            valorVenda: dados.valorVenda,
            tipoProduto: dados.tipoProduto,
            fornecedor: dados.fornecedor
        }
        if (JSON.stringify(obj1) !== JSON.stringify(obj2)) {
            setIsValidating(true);
            debounce(() => {
                ProdutosService.validate(dados)
                .then((result) => {
                    setIsValidating(false);
                    if (result instanceof Error) {
                        toast.error(result.message);
                    } else {
                        setIsValid(result);
                        if (result === false) {
                            const validationErrors: IVFormErrors = {};
                            validationErrors['descricao'] = 'Este produto já está cadastrado com o fornecedor';
                            validationErrors['fornecedor'] = 'Este fornecedor já tem este produto cadastrado';
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
        validate(dados);
        formValidationSchema
            .validate(dados, { abortEarly: false })
                .then((dadosValidados) => {
                    if(isValid) {
                        setIsLoading(true);
                        if (id === 'novo') {
                            ProdutosService.create(dadosValidados)
                                .then((result) => {
                                    setIsLoading(false);
                                    if (result instanceof Error) {
                                        toast.error(result.message)
                                    } else {
                                        toast.success('Cadastrado com sucesso!')
                                        if (isSaveAndClose()) {
                                            navigate('/produtos');
                                        } else if (isSaveAndNew()) {
                                            setIsValidating('');
                                            setIsValid(false);
                                            navigate('/produtos/cadastro/novo');
                                            formRef.current?.setData({
                                                descricao: '',
                                                tipoProduto: null,
                                                fornecedor: null,
                                                valorCompra: 0,
                                                valorVenda: 0
                                            });
                                        } else {
                                            setIsValidating(null);
                                            navigate(`/produtos/cadastro/${result}`);
                                        }
                                    }
                                });
                        } else {
                            ProdutosService.updateById(Number(id), { id: Number(id), ...dadosValidados })
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
                    validationErrors['fornecedor'] = 'O campo é obrigatório'
                    console.log(validationErrors);
                    formRef.current?.setErrors(validationErrors);
                })
    };

    const handleDelete = (id: number) => {

        if (window.confirm('Deseja apagar o registro?')) {
            ProdutosService.deleteById(id)
                .then(result => {
                    if (result instanceof Error) {
                        toast.error(result.message);
                    } else {         
                        toast.success('Apagado com sucesso!')
                        navigate('/produtos');
                    }
                })
        }
    }

    return (
        <LayoutBase 
            titulo={id === 'novo' ? 'Cadastrar Cidade' : 'Editar Cidade'}
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
                    onClickNovo={() => navigate('/produtos/cadastro/novo') }
                    onClickVoltar={() => navigate('/produtos') }
                />
            }
        >
            <VForm ref={formRef} onSubmit={handleSave}>
                <Box margin={1} display="flex" flexDirection="column" component={Paper} variant="outlined">
                    <Grid container direction="column" padding={2} spacing={2}>

                        {isLoading && (
                            <Grid item>
                                <LinearProgress variant="indeterminate"/>
                            </Grid>
                        )}

                        <Grid item>
                            <Typography variant="h6">Dados Gerais</Typography>
                        </Grid>

                        <Grid container item direction='row' spacing={2}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <VTextField
                                    fullWidth
                                    name='descricao'
                                    label='Descrição'
                                    disabled={isLoading}
                                    onChange={e => {
                                        setIsValid(false);
                                        setIsValidating('');
                                        formRef.current?.setFieldError('descricao', '');
                                        setDescricao(e.target.value.toUpperCase());
                                    }}
                                    required
                                    InputProps={{
                                        endAdornment: (
                                                <InputAdornment position='start'>
                                                    { isValidating === true && (
                                                        <Box sx={{ display: 'flex',  }}>
                                                            <CircularProgress size={24}/>
                                                        </Box>
                                                    )}
                                                    { isValidating === false && (
                                                        <Box sx={{ display: 'flex' }}>
                                                            { isValid === true ? (
                                                                <Icon color="success">done</Icon>
                                                            ) : (
                                                                <Icon color="error">close</Icon>
                                                            )}
                                                        </Box>
                                                    )}
                                                </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                        </Grid> 
                        <Grid container item direction='row' spacing={2}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <VAutocompleteSearch
                                    name='tipoProduto'
                                    label='descricao'
                                    getAll={TiposProdutoService.getAll}
                                    TFLabel='Tipo de Produto'
                                />
                            </Grid>
                        </Grid>
                        <Grid container item direction='row' spacing={2}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <VAutocompleteSearch
                                    name='fornecedor'
                                    label='razSocial'
                                    getAll={FornecedoresService.getAll}
                                    TFLabel='Fornecedor'
                                    required
                                    onChange={(newValue) => {
                                        setFornecedor(newValue);
                                    }}
                                    onInputchange={() => {
                                        setIsValid(false);
                                        setIsValidating('');
                                        formRef.current?.setFieldError('fornecedor', '');
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6">Valores</Typography>
                        </Grid>
                        <Grid container item direction='row' spacing={2}>
                            <Grid item xs={3} sm={3} md={2} lg={2} xl={1}>
                                <VTextField
                                    fullWidth
                                    name='valorCompra'
                                    label='Compra'
                                    disabled={isLoading}
                                />
                            </Grid>
                            <Grid item xs={3} sm={3} md={2} lg={2} xl={1}>
                                <VTextField
                                    fullWidth
                                    name='valorVenda'
                                    label='Venda'
                                    disabled={isLoading}
                                />
                            </Grid>
                        </Grid>      
                    </Grid>

                </Box>
            </VForm>
        </LayoutBase>
    )

}