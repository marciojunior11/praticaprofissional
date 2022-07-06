import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { useDrawerContext } from "../shared/contexts";
import { 
    Dashboard,
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
    ConsultaClientes,
    ConsultaProdutos,
    CadastroProdutos,
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
            {
                label: 'Clientes',
                icon: 'person',
                path: '/clientes',
            },
            {
                label: 'Produtos',
                icon: 'shopping_cart',
                path: '/produtos',
            },
        ]);
    }, []);

    return (
        <Routes>
            <Route path="/home" element={<Dashboard/>}/>

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

            <Route path="/clientes" element={<ConsultaClientes/>}/>
            <Route path="/clientes/cadastro/:id" element={<CadastroFornecedores/>}/>

            <Route path="/produtos" element={<ConsultaProdutos/>}/>
            <Route path="/produtos/cadastro/:id" element={<CadastroProdutos/>}/>

            <Route path="*" element={<Navigate to="/home"/>}/>
        </Routes>
    );
}