import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { useDrawerContext } from "../shared/contexts";
import { 
    Dashboard,
    ConsultaClientes, 
    ConsultaPaises,
    CadastroPaises,
    ConsultaEstados,
    CadastroEstados,
    ConsultaCidades,
    CadastroCidades,
    ConsultaTiposProduto,
    CadastroTiposProduto,
    ConsultaFornecedores,
    CadastroFornecedores,
} from "../pages";

export const AppRoutes = () => {
    const { setDrawerOptions } = useDrawerContext();

    useEffect(() => {
        setDrawerOptions([
            {
                label: 'Página inicial',
                icon: 'home',
                path: '/home',
            },
            {
                label: 'Clientes',
                icon: 'people',
                path: '/clientes',
            },
            {
                label: 'Paises',
                icon: 'public',
                path: '/paises',
            },
            {
                label: 'Estados',
                icon: 'location_on',
                path: '/estados',
            },
            {
                label: 'Cidades',
                icon: 'location_city',
                path: '/cidades',
            },
            {
                label: 'Tipos de Produto',
                icon: 'fastfood',
                path: '/tiposproduto',
            },
            {
                label: 'Fornecedores',
                icon: 'handshake',
                path: '/fornecedores',
            },
        ]);
    }, []);

    return (
        <Routes>
            <Route path="/home" element={<Dashboard/>}/>
            
            <Route path="/clientes" element={<ConsultaClientes/>}/>
            {/*<Route path="/cidades/detalhe/:id" element={<Dashboard/>}/>*/}

            <Route path="/paises" element={<ConsultaPaises/>}/>
            <Route path="/paises/cadastro/:id" element={<CadastroPaises/>}/>

            <Route path="/estados" element={<ConsultaEstados/>}/>
            <Route path="/estados/cadastro/:id" element={<CadastroEstados/>}/>

            <Route path="/cidades" element={<ConsultaCidades/>}/>
            <Route path="/cidades/cadastro/:id" element={<CadastroCidades/>}/>

            <Route path="/tiposproduto" element={<ConsultaTiposProduto/>}/>
            <Route path="/tiposproduto/cadastro/:id" element={<CadastroTiposProduto/>}/>

            <Route path="/fornecedores" element={<ConsultaFornecedores/>}/>
            <Route path="/fornecedores/cadastro/:id" element={<CadastroFornecedores/>}/>

            <Route path="*" element={<Navigate to="/home"/>}/>
        </Routes>
    );
}