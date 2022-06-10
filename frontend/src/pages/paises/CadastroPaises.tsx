import { LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"

import { DetailTools } from "../../shared/components";
import { LayoutBase } from "../../shared/layouts";
import { IPaises, PaisesService } from "../../shared/services/api/paises/PaisesService";


export const CadastroPaises: React.FC = () => {
    const { id = 'novo' } = useParams<'id'>();
    const navigate = useNavigate();

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

                    }
                });
        }
    }, [id])

    const handleSave = () => {
        console.log('Save')
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
                    
                    onClickSalvar={handleSave}
                    onClickSalvarFechar={handleSave}
                    onClickApagar={() => handleDelete(Number(id))}
                    onClickNovo={() => navigate('/paises/cadastro/novo') }
                    onClickVoltar={() => navigate('/paises') }
                />
            }
        >
            {isLoading && (
                <LinearProgress variant="indeterminate"/>
            )}
            <p>Cadastro de Países {id}</p>
        </LayoutBase>
    )

}