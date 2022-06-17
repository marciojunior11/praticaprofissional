import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Grid, LinearProgress, Paper, Typography } from "@mui/material";
import * as yup from 'yup';

import { DetailTools } from "../../shared/components";
import { LayoutBase } from "../../shared/layouts";
import { PaisesService } from "../../shared/services/api/paises/PaisesService";
import { VTextField, VForm, useVForm, IVFormErrors } from "../../shared/forms"

interface IFormData {
    pais: string;
    sigla: string;
}

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
    pais: yup.string().required(),
    sigla: yup.string().required().min(2)
})

export const CadastroPaises: React.FC = () => {
    const { id = 'novo' } = useParams<'id'>();
    const navigate = useNavigate();

    const { formRef, save, saveAndNew, saveAndClose, isSaveAndNew, isSaveAndClose } = useVForm();

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (id !== 'novo') {
            setIsLoading(true);

            PaisesService.getById(Number(id))
                .then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                        navigate('/paises');
                    } else {
                        console.log('RESULT', result);
                        formRef.current?.setData(result);
                    }
                });
        } else {
            formRef.current?.setData({
                pais: '',
                sigla: ''
            });
        }
    }, [id])

    const handleSave = (dados: IFormData) => {
        formValidationSchema
            .validate(dados, { abortEarly: false })
                .then((dadosValidados) => {

                    setIsLoading(true);
                    if (id === 'novo') {
                        PaisesService.create(dadosValidados)
                            .then((result) => {
                                setIsLoading(false);
                                if (result instanceof Error) {
                                    alert(result.message);
                                } else {
                                    alert('Cadastrado com Sucesso!');
                                    if (isSaveAndClose()) {
                                        navigate('/paises');
                                    } else if (isSaveAndNew()) {
                                        navigate('/paises/cadastro/novo');
                                        formRef.current?.setData({
                                            pais: '',
                                            sigla: ''
                                        });
                                    } else {
                                        navigate(`/paises/cadastro/${result}`);
                                    }
                                }
                            });
                    } else {
                        PaisesService.updateById(Number(id), { id: Number(id), ...dadosValidados })
                            .then((result) => {
                                setIsLoading(false);
                                if (result instanceof Error) {
                                    alert(result.message);
                                } else {
                                    alert('Alterado com Sucesso!')
                                    if (isSaveAndClose()) {
                                        navigate('/paises')
                                    }
                                }
                            });
                    }
                })
                .catch((errors: yup.ValidationError) => {
                    const validationErrors: IVFormErrors = {}

                    errors.inner.forEach(error => {
                        if ( !error.path ) return;

                        validationErrors[error.path] = error.message;
                    });
                    formRef.current?.setErrors(validationErrors);
                })
    };

    const handleDelete = (id: number) => {

        if (window.confirm('Deseja apagar o registro?')) {
            PaisesService.deleteById(id)
                .then(result => {
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {         
                        alert('Registro apagado com sucesso!');
                        navigate('/paises');
                    }
                })
        }
    }

    const validate = (key: string) => {
        
    }

    return (
        <LayoutBase 
            titulo={id === 'novo' ? 'Novo País' : 'Editar País'}
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
                    onClickNovo={() => navigate('/paises/cadastro/novo') }
                    onClickVoltar={() => navigate('/paises') }
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
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                <VTextField 
                                    fullWidth
                                    name='pais' 
                                    label="País"
                                    disabled={isLoading}
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                <VTextField 
                                    fullWidth
                                    name='sigla' 
                                    label="Sigla"
                                    disabled={isLoading}
                                    inputProps={{ maxLength: 2 }}
                                />
                            </Grid>
                        </Grid>

                    </Grid>

                </Box>
            </VForm>
        </LayoutBase>
    )

}