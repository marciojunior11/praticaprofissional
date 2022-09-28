// #region EXTERNAL IMPORTS
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, CircularProgress, Collapse, Grid, Icon, IconButton, InputAdornment, LinearProgress, Paper, Tab, Tabs, Typography } from "@mui/material";
import * as yup from 'yup';
import { toast } from "react-toastify";
// #endregion

// #region INTERNAL IMPORTS
import { DetailTools } from "../../shared/components";
import { LayoutBase } from "../../shared/layouts";
import { FornecedoresService, IFornecedores } from "../../shared/services/api/fornecedores/FornecedoresService";
import { VTextField, VForm, useVForm, IVFormErrors, VAutocompleteSearch } from "../../shared/forms";
import { ICidades, CidadesService } from "../../shared/services/api/cidades/CidadesService";
import { useDebounce } from "../../shared/hooks";
import { number } from "../../shared/utils/validations";
// #endregion

// #region INTERFACES
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

interface ITabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
// #endregion

function TabPanel(props: ITabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    { children }
                </Box>
            )}
        </div>
    )
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
    // #region HOOKS
    const { id = 'novo' } = useParams<'id'>();
    const navigate = useNavigate();
    const { formRef, save, saveAndNew, saveAndClose, isSaveAndNew, isSaveAndClose } = useVForm();
    const { debounce } = useDebounce();
    // #endregion

    // #region STATES
    const [obj, setObj] = useState<IFornecedores | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isValidating, setIsValidating] = useState<any>(null);
    const [isValid, setIsValid] = useState(false);
    const [alterando, setAlterando] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    // #endregion

    // #region ACTIONS
    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    }

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
    // #endregion

    // #region CONTROLLERS
    // #endregion

    return (
        <LayoutBase 
            titulo={id === 'novo' ? 'Cadastrar Fornecedor' : 'Editar Fornecedor'}
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
                <Box margin={1} display="flex" flexDirection="column" component={Paper} alignItems="center">
                    <Tabs
                        value={selectedTab}
                        onChange={handleChangeTab}
                        textColor="primary"
                        indicatorColor="primary"
                    >
                        <Tab value={0} label="Dados Gerais"/>
                        <Tab value={1} label="Endereço"/>
                        <Tab value={2} label="Informações de Contato"/>
                    </Tabs>
                    <Grid item container xs={12} sm={10} md={6} lg={5} xl={4} direction="column" padding={2} spacing={2} alignItems="left">
                        <TabPanel value={selectedTab} index={0}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <VTextField
                                        size="small"
                                        required
                                        fullWidth
                                        name='razsocial' 
                                        label="Razão Social"
                                        disabled={isLoading}  
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <VTextField
                                        size="small"
                                        required
                                        fullWidth
                                        name='nmfantasia' 
                                        label="Nome Fantasia"
                                        disabled={isLoading}  
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <VTextField
                                        size="small"
                                        required
                                        fullWidth
                                        name='cnpj' 
                                        label="CNPJ"
                                        disabled={isLoading}  
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <VTextField
                                        size="small"
                                        required
                                        fullWidth
                                        name='inscestadual' 
                                        label="Inscrição Estadual"
                                        disabled={isLoading}  
                                    />
                                </Grid>
                            </Grid>
                        </TabPanel>
                        
                        <TabPanel value={selectedTab} index={1}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <VTextField
                                        size="small"
                                        required
                                        fullWidth
                                        name='cep' 
                                        label="CEP"
                                        disabled={isLoading}  
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <VTextField
                                        size="small"
                                        required
                                        fullWidth
                                        name='endereco' 
                                        label="Endereço"
                                        disabled={isLoading}  
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <VTextField
                                        size="small"
                                        required
                                        fullWidth
                                        name='numend' 
                                        label="Número"
                                        disabled={isLoading}  
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <VTextField
                                        size="small"
                                        required
                                        fullWidth
                                        name='bairro' 
                                        label="Bairro"
                                        disabled={isLoading}  
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    TO DO: SUBSTITUIR TEXTFIELD POR AUTOCOMPLETE COM SEARCH CIDADES
                                    <VTextField
                                        size="small"
                                        required
                                        fullWidth
                                        name='cidade' 
                                        label="Cidade"
                                        disabled={isLoading}  
                                    />
                                </Grid>
                            </Grid>
                        </TabPanel>   

                        <TabPanel value={selectedTab} index={2}>
                            <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <VTextField
                                            size="small"
                                            required
                                            fullWidth
                                            name='telefone' 
                                            label="Telefone"
                                            disabled={isLoading}  
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <VTextField
                                            size="small"
                                            required
                                            fullWidth
                                            name='celular' 
                                            label="Celular"
                                            disabled={isLoading}  
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <VTextField
                                            size="small"
                                            required
                                            fullWidth
                                            name='email' 
                                            label="E-mail"
                                            disabled={isLoading}  
                                        />
                                    </Grid>
                                </Grid>
                        </TabPanel>    
                    </Grid>
                </Box>
            </VForm>
        </LayoutBase>
    )

}