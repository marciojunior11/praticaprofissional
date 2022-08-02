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
    ConsultaFornecedores,
    CadastroFornecedores,
    ConsultaClientes,
    CadastroClientes,
    ConsultaTiposProduto,
    CadastroTiposProduto,
    ConsultaProdutos,
    CadastroProdutos,
    ConsultacondicoesPagamento,
    CadastroFormasPagamento,
    CadastroCondicoesPagamento,
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
                label: 'Tipos de Produto',
                icon: 'fastfood',
                path: '/tiposproduto',
            },
            {
                label: 'Produtos',
                icon: 'shopping_cart',
                path: '/produtos',
            },
            {
                label: 'Formas de Pagamento',
                icon: 'local_atm',
                path: '/formaspagamento',
            },
            {
                label: 'Condições de Pagamento',
                icon: 'request_quote',
                path: '/condicoespagamento',
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

            <Route path="/fornecedores" element={<ConsultaFornecedores/>}/>
            <Route path="/fornecedores/cadastro/:id" element={<CadastroFornecedores/>}/>

            <Route path="/clientes" element={<ConsultaClientes/>}/>
            <Route path="/clientes/cadastro/:id" element={<CadastroClientes/>}/>

            <Route path="/tiposproduto" element={<ConsultaTiposProduto/>}/>
            <Route path="/tiposproduto/cadastro/:id" element={<CadastroTiposProduto/>}/>

            <Route path="/formaspagamento" element={<ConsultacondicoesPagamento/>}/>
            <Route path="/formaspagamento/cadastro/:id" element={<CadastroFormasPagamento/>}/>

            <Route path="/condicoespagamento" element={<ConsultacondicoesPagamento/>}/>
            <Route path="/condicoespagamento/cadastro/:id" element={<CadastroCondicoesPagamento/>}/>

            <Route path="/produtos" element={<ConsultaProdutos/>}/>
            <Route path="/produtos/cadastro/:id" element={<CadastroProdutos/>}/>

            <Route path="*" element={<Navigate to="/home"/>}/>
        </Routes>
    );
}