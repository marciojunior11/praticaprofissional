// #region EXTERNAL IMPORTS
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, CircularProgress, Collapse, Grid, Icon, IconButton, InputAdornment, LinearProgress, Paper, Tab, Tabs, Typography } from "@mui/material";
import * as yup from 'yup';
import { toast } from "react-toastify";
// #endregion

// #region INTERNAL IMPORTS
import { CustomDialog, DetailTools } from "../../shared/components";
import { LayoutBase } from "../../shared/layouts";
import { FornecedoresService, IFornecedores } from "../../shared/services/api/fornecedores/FornecedoresService";
import { VTextField, VForm, useVForm, IVFormErrors, VAutocompleteSearch } from "../../shared/forms";
import { ICidades, CidadesService } from "../../shared/services/api/cidades/CidadesService";
import { useDebounce } from "../../shared/hooks";
import { number } from "../../shared/utils/validations";
import ControllerFornecedores from "../../shared/controllers/FornecedoresController";
import ControllerCidades from "../../shared/controllers/CidadesController";
import { ConsultaCidades } from "../cidades/ConsultaCidades";
// #endregion

// #region INTERFACES
interface IFormData {
    razsocial: string;
    nmfantasia: string | undefined;
    cnpj: string;
    inscestadual: string;
    telefone: string | undefined;
    celular: string | undefined;
    email: string | undefined;
    cep: string;
    endereco: string;
    numend: string;
    bairro: string;
    cidade: ICidades;
    //condicaopagamento: ICondicoesPagamento | undefined;
    flsituacao: string | undefined;
    datacad: string | Date | undefined;
    ultalt: string | Date | undefined;
}
// #endregion

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
    razsocial: yup.string().required(),
    nmfantasia: yup.string(),
    cnpj: yup.string().required().max(20).matches(number, 'Apenas números são aceitos neste campo.'),
    inscestadual: yup.string().required(),
    email: yup.string(),
    telefone: yup.string().matches(number, 'Apenas números são aceitos neste campo.'),
    celular: yup.string().matches(number, 'Apenas números são aceitos neste campo.'),
    cep: yup.string().matches(number, 'Apenas números são aceitos neste campo.').required(),
    endereco: yup.string().required(),
    numend: yup.string().matches(number, 'Apenas números são aceitos neste campo.').required(),
    bairro: yup.string().required(),
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
    }).required(),
    flsituacao: yup.string(),
    datacad: yup.string(),
    ultalt: yup.string()
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
    const [isConsultaCidadesDialogOpen, setIsConsultaCidadesDialogOpen] = useState(false);
    // #endregion

    // #region ACTIONS
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
        console.log(dados);
        formValidationSchema
            .validate(dados, { abortEarly: false })
                .then((dadosValidados) => {
                    if(isValid) {
                        setIsLoading(true);
                        if (id === 'novo') {
                            controller.create(dadosValidados)
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

    const toggleConsultaCidadesDialogOpen = () => {
        setIsConsultaCidadesDialogOpen(oldValue => !oldValue);
    }
    // #endregion

    // #region CONTROLLERS
    const controller = new ControllerFornecedores();
    const controllerCidades = new ControllerCidades();
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
                    <Grid item container xs={12} sm={10} md={6} lg={5} xl={5} direction="column" padding={2} spacing={2} alignItems="left">


                            <Grid item>
                                <Typography variant="h6">Dados Gerais</Typography>
                            </Grid>

                            <Grid container item direction="row" spacing={2}>
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
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
                                    <VTextField
                                        size="small"
                                        required
                                        fullWidth
                                        name='cnpj' 
                                        label="CNPJ"
                                        disabled={isLoading}  
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
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
                        
                            <Grid item>
                                <Typography variant="h6">Endereço</Typography>
                            </Grid>

                            <Grid container item direction="row" spacing={2}>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={3}>
                                    <VTextField
                                        size="small"
                                        required
                                        fullWidth
                                        name='cep' 
                                        label="CEP"
                                        disabled={isLoading}  
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
                                    <VTextField
                                        size="small"
                                        required
                                        fullWidth
                                        name='endereco' 
                                        label="Endereço"
                                        disabled={isLoading}  
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={3}>
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
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
                                    <VAutocompleteSearch
                                        size="small"
                                        required
                                        name="cidade"
                                        label={["nmcidade", "estado.uf", "estado.pais.nmpais"]}
                                        TFLabel="Cidade"
                                        getAll={controllerCidades.getAll}
                                        // onInputchange={() => {
                                        //     setIsValid(false);
                                        //     setIsValidating(false);
                                        //     formRef.current?.setFieldError('nmcidade', '');
                                        // }}
                                        // onChange={(newValue) => {
                                        //     setEstado(newValue);
                                        // }}
                                        onClickSearch={toggleConsultaCidadesDialogOpen}
                                        isDialogOpen={isConsultaCidadesDialogOpen}
                                    />
                                </Grid>
                            </Grid>  

                            <Grid item>
                                <Typography variant="h6">Informações para contato</Typography>
                            </Grid>

                            <Grid container item direction="row" spacing={2}>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
                                        <VTextField
                                            size="small"
                                            required
                                            fullWidth
                                            name='telefone' 
                                            label="Telefone"
                                            disabled={isLoading}  
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
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
                    </Grid>
                    <CustomDialog
                        onClose={toggleConsultaCidadesDialogOpen}
                        handleClose={toggleConsultaCidadesDialogOpen}
                        open={isConsultaCidadesDialogOpen}
                        title="Cadastrar País"
                        fullWidth
                    >
                        <ConsultaCidades
                            isDialog
                            onSelectItem={(row) => {
                                formRef.current?.setFieldValue("cidade", row);
                                formRef.current?.setFieldError('cidade', '');
                                //setEstado(row);
                            }}
                            toggleDialogOpen={toggleConsultaCidadesDialogOpen}
                        />
                    </CustomDialog>
                </Box>
            </VForm>
        </LayoutBase>
    )

}