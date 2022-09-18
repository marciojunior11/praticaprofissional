import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, CircularProgress, Collapse, Grid, Icon, IconButton, InputAdornment, LinearProgress, Paper, Typography } from "@mui/material";
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
    razSocial: string;
    nomeFantasia: string | undefined;
    cnpj: string;
    telefone: string | undefined;
    endereco: string | undefined;
    numEnd: string | undefined;
    bairro: string | undefined;
    cidade: ICidades
}

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
    razSocial: yup.string().required(),
    nomeFantasia: yup.string(),
    cnpj: yup.string().required().max(20).matches(number, 'Apenas números são aceitos neste campo.'),
    telefone: yup.string().matches(number, 'Apenas números são aceitos neste campo.'),
    endereco: yup.string(),
    numEnd: yup.string().matches(number, 'Apenas números são aceitos neste campo.'),
    bairro: yup.string(),
    cidade: yup.object().shape({
        id: yup.number(),
        cidade: yup.string(),
        estado: yup.object().shape({
            id: yup.number(),
            estado: yup.string(),
            uf: yup.string(),
            pais: yup.object({
                id: yup.number(),
                pais: yup.string(),
                sigla: yup.string()
            }),
        })
    }).required()
})

export const CadastroFornecedores: React.FC = () => {
    const { id = 'novo' } = useParams<'id'>();
    const navigate = useNavigate();

    const { formRef, save, saveAndNew, saveAndClose, isSaveAndNew, isSaveAndClose } = useVForm();
    const { debounce } = useDebounce();

    const [obj, setObj] = useState<IFornecedores | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isValidating, setIsValidating] = useState<any>(null);

    const [isValid, setIsValid] = useState(false);
    const [alterando, setAlterando] = useState(false);

    useEffect(() => {
        if (id !== 'novo') {
            setIsLoading(true);

            FornecedoresService.getById(Number(id))
                .then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        toast.error(result.message);
                        navigate('/fornecedores');
                    } else {
                        console.log('RESULT', result);
                        formRef.current?.setData(result);
                        setObj(result);
                        setAlterando(true);
                    }
                });
        } else {
            formRef.current?.setData({
                razSocial: '',
                cnpj: '',
                nomeFantasia: '',
                telefone: '',
                endereco: '',
                numEnd: '',
                bairro: '',
                cidade: null
            });
        }
    }, [id]);

    useEffect(() => {
        if (obj) setIsValid(true)
        else setIsValid(false);
    }, [obj])

    const validate = (dados: IFormData) => {
        const obj1 = {
            id: obj?.id,
            razSocial: obj?.razSocial,
            nomeFantasia: obj?.nomeFantasia,
            cnpj: obj?.cnpj,
            telefone: obj?.telefone,
            endereco: obj?.endereco,
            numEnd: obj?.numEnd,
            bairro: obj?.bairro,
            cidade: obj?.cidade
        }
        const obj2 = {
            id: Number(id),
            razSocial: dados.razSocial,
            nomeFantasia: dados.nomeFantasia,
            cnpj: dados.cnpj,
            telefone: dados.telefone,
            endereco: dados.endereco,
            numEnd: dados.numEnd,
            bairro: dados.bairro,
            cidade: dados.cidade
        }
        if (JSON.stringify(obj1) !== JSON.stringify(obj2)) {
            setIsValidating(true);
            debounce(() => {
                FornecedoresService.validate(dados)
                .then((result) => {
                    setIsValidating(false);
                    if (result instanceof Error) {
                        toast.error(result.message);
                    } else {
                        setIsValid(result);
                        if (result === false) {
                            const validationErrors: IVFormErrors = {};
                            validationErrors['cnpj'] = 'Este CNPJ já está cadastrado.';
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
                            FornecedoresService.create(dadosValidados)
                                .then((result) => {
                                    setIsLoading(false);
                                    if (result instanceof Error) {
                                        toast.error(result.message)
                                    } else {
                                        toast.success('Cadastrado com sucesso!')
                                        if (isSaveAndClose()) {
                                            navigate('/fornecedores');
                                        } else if (isSaveAndNew()) {
                                            setIsValidating('');
                                            setIsValid(false);
                                            navigate('/fornecedores/cadastro/novo');
                                            formRef.current?.setData({
                                                razSocial: '',
                                                nomeFantasia: '',
                                                cnpj: '',
                                                telefone: '',
                                                endereco: '',
                                                numero: '',
                                                bairro: '',
                                                cidade: null
                                            });
                                        } else {
                                            setIsValidating(null);
                                            navigate(`/fornecedores/cadastro/${result}`);
                                        }
                                    }
                                });
                        } else {
                            FornecedoresService.updateById(Number(id), { id: Number(id), ...dadosValidados })
                                .then((result) => {
                                    setIsLoading(false);
                                    if (result instanceof Error) {
                                        toast.error(result.message);
                                    } else {
                                        toast.success('Alterado com sucesso!');
                                        if (isSaveAndClose()) {
                                            navigate('/fornecedores')
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
                    validationErrors['cidade'] = 'O campo é obrigatório'
                    console.log(validationErrors);
                    formRef.current?.setErrors(validationErrors);
                })
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
                    onClickNovo={() => navigate('/fornecedores/cadastro/novo') }
                    onClickVoltar={() => navigate('/fornecedores') }
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

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={7} sm={7} md={8} lg={9} xl={10}>
                                <VTextField
                                    fullWidth
                                    name='razSocial'
                                    label='Razão Social'
                                    disabled={isLoading}
                                    onChange={e => {
                                        if (alterando) setAlterando(false);
                                    }}
                                    required
                                />
                            </Grid>

                            <Grid item xs={5} sm={5} md={4} lg={3} xl={2}>
                                <VTextField 
                                    fullWidth
                                    required
                                    name='cnpj' 
                                    label="CNPJ"
                                    disabled={isLoading}                             
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
                                    inputProps={{maxLength: 20}}
                                    onChange={(e) => {
                                        setIsValid(false);
                                        setIsValidating('');
                                        formRef.current?.setFieldError('cnpj', '');
                                        if (alterando) setAlterando(false);
                                    }}
                                    onBlur={(e) => {
                                        const formData = formRef.current?.getData();
                                        const data: IFormData = {
                                            razSocial: formData?.razSocial,
                                            nomeFantasia: formData?.nomeFantasia,
                                            cnpj: formData?.cnpj,
                                            telefone: formData?.telefone,
                                            endereco: formData?.endereco,
                                            numEnd: formData?.numEnd,
                                            bairro: formData?.bairro,
                                            cidade: formData?.cidade
                                        }
                                        validate(data);
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={7} sm={7} md={8} lg={9} xl={10}>
                                <VTextField
                                    fullWidth
                                    name='nomeFantasia'
                                    label='Nome Fantasia'
                                    disabled={isLoading}
                                    onChange={e => {
                                        if (alterando) setAlterando(false);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={5} sm={5} md={4} lg={3} xl={2}>
                                <VTextField
                                    fullWidth
                                    name='telefone'
                                    label='Telefone'
                                    disabled={isLoading}
                                    onChange={e => {
                                        if (alterando) setAlterando(false);
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={5} sm={5} md={5} lg={5} xl={6}>
                                <VTextField
                                    fullWidth
                                    name='endereco'
                                    label='Endereço'
                                    disabled={isLoading}
                                    onChange={e => {
                                        if (alterando) setAlterando(false);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={2} sm={2} md={2} lg={2} xl={1}>
                                <VTextField
                                    fullWidth
                                    name='numEnd'
                                    label='Numero'
                                    disabled={isLoading}
                                    onChange={e => {
                                        if (alterando) setAlterando(false);
                                    }}
                                />
                            </Grid>

                            <Grid item xs={5} sm={5} md={5} lg={5} xl={5}>
                                <VTextField
                                    fullWidth
                                    name='bairro'
                                    label='Bairro'
                                    disabled={isLoading}
                                    onChange={e => {
                                        if (alterando) setAlterando(false);
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
                                <VAutocompleteSearch
                                    required
                                    name="cidade"
                                    label={["nmcidade", "estado.uf", "estado.pais.sigla"]}
                                    TFLabel="Cidade"
                                    getAll={CidadesService.getAll}
                                    onInputchange={() => {
                                        formRef.current?.setFieldError('cidade', '');
                                    }}
                                    onChange={(newValue) => {
                                        if (alterando) setAlterando(false);
                                    }}
                                />
                            </Grid>
                        </Grid>            
                    </Grid>

                </Box>
            </VForm>
        </LayoutBase>
    )

}