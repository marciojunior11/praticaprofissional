import { useNavigate, useParams } from "react-router-dom"

import { DetailTools } from "../../shared/components";
import { LayoutBase } from "../../shared/layouts";


export const CadastroPaises: React.FC = () => {
    const { id = 'novo' } = useParams<'id'>();
    const navigate = useNavigate();

    const handleSave = () => {
        console.log('Save')
    };

    const handleDelete = () => {
        console.log('Delete')
    };

    return (
        <LayoutBase 
            titulo="Cadastro de País"
            barraDeFerramentas={
                <DetailTools
                    mostrarBotaoSalvarFechar
                    mostrarBotaoApagar={id !== 'novo'}
                    mostrarBotaoNovo={id !== 'novo'}
                    
                    onClickSalvar={handleSave}
                    onClickSalvarFechar={handleSave}
                    onClickApagar={handleDelete}
                    onClickNovo={() => navigate('/paises/cadastro/novo') }
                    onClickVoltar={() => navigate('/paises') }
                />
            }
        >
            <p>Cadastro de Países {id}</p>
        </LayoutBase>
    )

}