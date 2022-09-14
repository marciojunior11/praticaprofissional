import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, CircularProgress, Collapse, Grid, Icon, IconButton, InputAdornment, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import * as yup from 'yup';

import { DetailTools } from "../../shared/components";
import { LayoutBase } from "../../shared/layouts";
import { FornecedoresService, IFornecedores } from "../../shared/services/api/fornecedores/FornecedoresService";
import { VTextField, VForm, useVForm, IVFormErrors, VAutocompleteSearch } from "../../shared/forms"
import { toast } from "react-toastify";
import { ICidades, CidadesService } from "../../shared/services/api/cidades/CidadesService";
import { useDebounce } from "../../shared/hooks";
import { number } from "../../shared/utils/validations";

interface IFormData {

}

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({

})

export const CadastroCompras: React.FC = () => {
    const { id = 'novo' } = useParams<'id'>();
    const navigate = useNavigate();

    const { formRef, save, saveAndNew, saveAndClose, isSaveAndNew, isSaveAndClose } = useVForm();
    const { debounce } = useDebounce();

    const [obj, setObj] = useState<IFornecedores | null>(null);
    const [listaItensProduto, setListaItensProduto] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [readOnly, setReadOnly] = useState(false);
    const [isValidating, setIsValidating] = useState<any>(null);

    const [isValid, setIsValid] = useState(false);
    const [alterando, setAlterando] = useState(false);

    useEffect(() => {
        if (id !== 'novo') {
            setIsLoading(true);

            // FornecedoresService.getById(Number(id))
            //     .then((result) => {
            //         setIsLoading(false);
            //         if (result instanceof Error) {
            //             toast.error(result.message);
            //             navigate('/compras');
            //         } else {
            //             console.log('RESULT', result);
            //             formRef.current?.setData(result);
            //             setObj(result);
            //             setAlterando(true);
            //         }
            //     });
        } else {
            formRef.current?.setData({

            });
        }
    }, [id]);

    useEffect(() => {
        if (obj) setIsValid(true)
        else setIsValid(false);
    }, [obj])

    const validate = (dados: IFormData) => {
        const obj1 = {

        }
        const obj2 = {

        }
        if (JSON.stringify(obj1) !== JSON.stringify(obj2)) {
            setIsValidating(true);
            // debounce(() => {
            //     FornecedoresService.validate(dados)
            //     .then((result) => {
            //         setIsValidating(false);
            //         if (result instanceof Error) {
            //             toast.error(result.message);
            //         } else {
            //             setIsValid(result);
            //             if (result === false) {
            //                 const validationErrors: IVFormErrors = {};
            //                 validationErrors['cnpj'] = 'Este CNPJ já está cadastrado.';
            //                 formRef.current?.setErrors(validationErrors);
            //             }
            //         }
            //     })
            // })
        } else {
            setIsValid(true);
        }
    }

    const handleSave = (dados: IFormData) => {
        validate(dados);
        // formValidationSchema
        //     .validate(dados, { abortEarly: false })
        //         .then((dadosValidados) => {
        //             if(isValid) {
        //                 setIsLoading(true);
        //                 if (id === 'novo') {
        //                     FornecedoresService.create(dadosValidados)
        //                         .then((result) => {
        //                             setIsLoading(false);
        //                             if (result instanceof Error) {
        //                                 toast.error(result.message)
        //                             } else {
        //                                 toast.success('Cadastrado com sucesso!')
        //                                 if (isSaveAndClose()) {
        //                                     navigate('/fornecedores');
        //                                 } else if (isSaveAndNew()) {
        //                                     setIsValidating('');
        //                                     setIsValid(false);
        //                                     navigate('/fornecedores/cadastro/novo');
        //                                     formRef.current?.setData({
        //                                         razSocial: '',
        //                                         nomeFantasia: '',
        //                                         cnpj: '',
        //                                         telefone: '',
        //                                         endereco: '',
        //                                         numero: '',
        //                                         bairro: '',
        //                                         cidade: null
        //                                     });
        //                                 } else {
        //                                     setIsValidating(null);
        //                                     navigate(`/fornecedores/cadastro/${result}`);
        //                                 }
        //                             }
        //                         });
        //                 } else {
        //                     FornecedoresService.updateById(Number(id), { id: Number(id), ...dadosValidados })
        //                         .then((result) => {
        //                             setIsLoading(false);
        //                             if (result instanceof Error) {
        //                                 toast.error(result.message);
        //                             } else {
        //                                 toast.success('Alterado com sucesso!');
        //                                 if (isSaveAndClose()) {
        //                                     navigate('/fornecedores')
        //                                 } else {
        //                                     setIsValidating(null);
        //                                 }
        //                             }
        //                         });
        //                 }
        //             } else {
        //                 toast.error('Verifique os campos');
        //             }
        //         })
        //         .catch((errors: yup.ValidationError) => {
        //             const validationErrors: IVFormErrors = {}

        //             errors.inner.forEach(error => {
        //                 if ( !error.path ) return;
        //                 console.log('path', error.path);
        //                 console.log('message', error.message);
        //                 validationErrors[error.path] = error.message;
        //             });
        //             validationErrors['cidade'] = 'O campo é obrigatório'
        //             console.log(validationErrors);
        //             formRef.current?.setErrors(validationErrors);
        //         })
    };

    const handleDelete = (id: number) => {

        if (window.confirm('Deseja apagar o registro?')) {
            FornecedoresService.deleteById(id)
                .then(result => {
                    if (result instanceof Error) {
                        toast.error(result.message);
                    } else {         
                        toast.success('Apagado com sucesso!')
                        navigate('/fornecedores');
                    }
                })
        }
    }

    return (
        <LayoutBase 
            titulo={id === 'novo' ? 'Cadastrar Compra' : 'Editar Compra'}
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
                    onClickNovo={() => navigate('/fornecedores/cadastro/novo') }
                    onClickVoltar={() => navigate('/fornecedores') }
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
                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <VTextField
                                    name="nrnf"
                                    label="Número"
                                    required
                                    size="small"
                                    fullWidth
                                    disabled={isLoading || readOnly}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <VTextField
                                    name="serienf"
                                    label="Série"
                                    required
                                    size="small"
                                    fullWidth
                                    disabled={isLoading || readOnly}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <VTextField
                                    name="modelonf"
                                    label="Modelo"
                                    required
                                    size="small"
                                    fullWidth
                                    disabled={isLoading || readOnly}
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2} justifyContent="center">
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <VTextField
                                    name="condicaopagamento"
                                    label="Condição de pagamento"
                                    required
                                    size="small"
                                    fullWidth
                                    disabled={isLoading || readOnly}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <VTextField
                                    name="fornecedor"
                                    label="Fornecedor"
                                    required
                                    size="small"
                                    fullWidth
                                    disabled={isLoading || readOnly}
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2} justifyContent="center">
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={5}>
                                <VTextField
                                    name="produto"
                                    label="Produto"
                                    required
                                    size="small"
                                    fullWidth
                                    disabled={isLoading || readOnly}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={6} xl={3}>
                                <VTextField
                                    name="qtd"
                                    label="Quantidade"
                                    required
                                    size="small"
                                    fullWidth
                                    disabled={isLoading || readOnly}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={6} xl={3}>
                                <VTextField
                                    name="vlcompra"
                                    label="Valor compra"
                                    required
                                    size="small"
                                    fullWidth
                                    disabled={isLoading || readOnly}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={6} xl={1}>
                                <Button variant="contained">
                                    <Icon>add</Icon>
                                </Button>
                            </Grid>
                        </Grid>

                        <Grid item>
                            <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: "auto" }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Descrição</TableCell>
                                            <TableCell>Qtd</TableCell>
                                            <TableCell>Vl. Compra</TableCell>
                                            <TableCell>Vl. Total</TableCell>
                                            { id == 'novo' && (
                                                <TableCell align="right">Ações</TableCell>
                                            )}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {/* {listaItensProduto?.map(row => (
                                            <TableRow key={row.}>
                                                <TableCell >{row.numernumeroo}</TableCell>
                                                <TableCell>{row.dias}</TableCell>
                                                <TableCell>{row.percentual+"%"}</TableCell>
                                                <TableCell>{row.formapagamento.descricao}</TableCell>
                                                { id == 'novo' && (
                                                    <TableCell align="right">
                                                        <IconButton
                                                            //disabled={isEditingParcela} 
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
                                                ) }
                                            </TableRow>
                                        ))} */}
                                    </TableBody>
                                    {/* { listaParcelas.length === 0 && !isLoading && (
                                        <caption>{Environment.LISTAGEM_VAZIA}</caption>
                                    )} */}
                                </Table>
                            </TableContainer>  
                        </Grid>

                    </Grid>

                </Box>
            </VForm>
        </LayoutBase>
    )

}