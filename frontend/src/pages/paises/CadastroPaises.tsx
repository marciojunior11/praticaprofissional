import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";

import { DetailTools } from "../../shared/components";
import { LayoutBase } from "../../shared/layouts";
import { IPaises, PaisesService } from "../../shared/services/api/paises/PaisesService";
import { VTextField } from "../../shared/forms";

interface IFormData {
    pais: string;
    sigla: string;
}

export const CadastroPaises: React.FC = () => {
    const { id = 'novo' } = useParams<'id'>();
    const navigate = useNavigate();

    const formRef = useRef<FormHandles>(null);

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
                        formRef.current?.setData(result)
                    }
                });
        }
    }, [id])

    const handleSave = (dados: IFormData) => {
        setIsLoading(true);
        if (id === 'novo') {
            PaisesService.create(dados)
                .then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        alert('Cadastrado com Sucesso!');
                        navigate(`/paises`);
                    }
                });
        } else {
            PaisesService.updateById(Number(id), { id: Number(id), ...dados })
                .then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        alert('Alterado com Sucesso!')
                    }
                });
        }

    };

    const handleDelete = (id: number) => {

        if (window.confirm('Deseja apagar o registro?')) {
            PaisesService.deleteById(id)
                .then(result => {
                    console.log(result);
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {         
                        alert('Registro apagado com sucesso!');
                        navigate('/paises');
                    }
                })
        }
    }

    return (
        <LayoutBase 
            titulo={id === 'novo' ? 'Novo País' : 'Editar País'}
            barraDeFerramentas={
                <DetailTools
                    mostrarBotaoSalvarFechar
                    mostrarBotaoApagar={id !== 'novo'}
                    mostrarBotaoNovo={id !== 'novo'}
                    
                    onClickSalvar={() => formRef.current?.submitForm()}
                    onClickSalvarFechar={() => formRef.current?.submitForm()}
                    onClickApagar={() => handleDelete(Number(id))}
                    onClickNovo={() => navigate('/paises/cadastro/novo') }
                    onClickVoltar={() => navigate('/paises') }
                />
            }
        >
            <Form ref={formRef} onSubmit={handleSave}>
                <VTextField
                    name='pais'
                    placeholder="País"
                />
                <VTextField
                    name='sigla'
                    placeholder="Sigla"
                />
            </Form>
        </LayoutBase>
    )

}