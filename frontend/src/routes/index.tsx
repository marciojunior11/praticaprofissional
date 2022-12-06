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
    ConsultaProdutos,
    CadastroProdutos,
    ConsultaCondicoesPagamento,
    CadastroFormasPagamento,
    CadastroCondicoesPagamento,
    ConsultaFormasPagamento,
    ConsultaCompras,
    CadastroCompras,
    ConsultaVendas,
    CadastroVendas,
    ConsultaGrades,
    CadastroGrades,
    ConsultaCaracteristicas,
    CadastroCaracteristicas,
    ConsultaVariacoes,
    CadastroVariacoes,
    ConsultaCentrosCusto,
    CadastroCentrosCusto,
    ConsultaContasPagar,
    CadastroContasPagar,
    ConsultaContasReceber,
    CadastroContasReceber,
    ConsultaContratos,
    CadastroContratos
} from "../pages";

export const AppRoutes = () => {
    const { setDrawerOptions } = useDrawerContext();

    useEffect(() => {
        setDrawerOptions([
            {
                label: 'Página inicial',
                icon: ['home'],
                path: '/home',
            },
            {
                label: 'Paises',
                icon: ['public'],
                path: '/paises',
            },
            {
                label: 'Estados',
                icon: ['location_on'],
                path: '/estados',
            },
            {
                label: 'Cidades',
                icon: ['location_city'],
                path: '/cidades',
            },
            {
                label: 'Fornecedores',
                icon: ['handshake'],
                path: '/fornecedores',
            },
            {
                label: 'Clientes',
                icon: ['person'],
                path: '/clientes',
            },
            {
                label: 'Produtos',
                icon: ['shopping_cart'],
                path: '/produtos',
            },
            {
                label: 'Formas de Pagamento',
                icon: ['local_atm'],
                path: '/formaspagamento',
            },
            {
                label: 'Condições de Pagamento',
                icon: ['request_quote'],
                path: '/condicoespagamento',
            },
            {
                label: 'Compras',
                icon: ['local_shipping', 'paid'],
                path: '/compras',
            },
            {
                label: 'Vendas',
                icon: ['add_shopping_cart', 'paid'],
                path: '/vendas',
            },
            {
                label: 'Contas a Pagar',
                icon: ['monetization_on_icon', 'arrow_forward'],
                path: '/contaspagar',
            },
            {
                label: 'Contas a Receber',
                icon: ['monetization_on_icon', 'arrow_backward'],
                path: '/contasreceber',
            },
            {
                label: 'Grades',
                icon: ['grid_3x3'],
                path: '/grades',
            },
            {
                label: 'Características',
                icon: ['apps'],
                path: '/caracteristicas',
            },
            {
                label: 'Variações',
                icon: ['app_registration'],
                path: '/variacoes',
            },
            {
                label: 'Centros de Custo',
                icon: ['currency_exchange'],
                path: '/centroscusto',
            },
            {
                label: 'Contratos',
                icon: ['history_edu'],
                path: '/contratos',
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

            <Route path="/formaspagamento" element={<ConsultaFormasPagamento/>}/>
            <Route path="/formaspagamento/cadastro/:id" element={<CadastroFormasPagamento/>}/>

            <Route path="/condicoespagamento" element={<ConsultaCondicoesPagamento/>}/>
            <Route path="/condicoespagamento/cadastro/:id" element={<CadastroCondicoesPagamento/>}/>

            <Route path="/produtos" element={<ConsultaProdutos/>}/>
            <Route path="/produtos/cadastro/:id" element={<CadastroProdutos/>}/>

            <Route path="/compras" element={<ConsultaCompras/>}/>
            <Route path="/compras/cadastro/:id" element={<CadastroCompras/>}/>

            <Route path="/vendas" element={<ConsultaVendas/>}/>
            <Route path="/vendas/cadastro/:id" element={<CadastroVendas/>}/>

            <Route path="/contaspagar" element={<ConsultaContasPagar/>}/>
            <Route path="/contaspagar/cadastro/:id" element={<CadastroContasPagar/>}/>

            <Route path="/contasreceber" element={<ConsultaContasReceber/>}/>
            <Route path="/contasreceber/cadastro/:id" element={<CadastroContasReceber/>}/>

            <Route path="/grades" element={<ConsultaGrades/>}/>
            <Route path="/grades/cadastro/:id" element={<CadastroGrades/>}/>

            <Route path="/caracteristicas" element={<ConsultaCaracteristicas/>}/>
            <Route path="/caracteristicas/cadastro/:id" element={<CadastroCaracteristicas/>}/>

            <Route path="/variacoes" element={<ConsultaVariacoes/>}/>
            <Route path="/variacoes/cadastro/:id" element={<CadastroVariacoes/>}/>

            <Route path="/centroscusto" element={<ConsultaCentrosCusto/>}/>
            <Route path="/centroscusto/cadastro/:id" element={<CadastroCentrosCusto/>}/>

            <Route path="/contratos" element={<ConsultaContratos/>}/>
            <Route path="/contratos/cadastro/:id" element={<CadastroContratos/>}/>

            <Route path="*" element={<Navigate to="/home"/>}/>
        </Routes>
    );
}