const { paisesRoutes } = require('./paisesRoutes');
const { estadosRoutes } = require('./estadosRoutes');
const { cidadesRoutes } = require('./cidadesRoutes');
const { tiposProdutoRoutes } = require('./tiposProdutoRoutes');
const { fornecedoresRoutes } = require('./fornecedoresRoutes');
const { produtosRoutes } = require('./produtosRoutes');
const { clientesRoutes } = require('./clientesRoutes');
const { formasPagamentoRoutes } = require('./formasPagamentoRoutes');
const { condicoesPagamentoRoutes } = require('./condicoesPagamentoRoutes');

function router(req, res) {
    if (req.url.includes('/paises')) {
        paisesRoutes(req, res);
    } else if (req.url.includes('/estados')) {
        estadosRoutes(req, res);
    } else if (req.url.includes('/cidades')) {
        cidadesRoutes(req, res);
    } else if (req.url.includes('/tiposproduto')) {
        tiposProdutoRoutes(req, res);
    } else if (req.url.includes('/fornecedores')) {
        fornecedoresRoutes(req, res);
    } else if (req.url.includes('/produtos')) {
        produtosRoutes(req, res);
    } else if (req.url.includes('/clientes')) {
        clientesRoutes(req, res);
    } else if (req.url.includes('/formaspagamento')) {
        formasPagamentoRoutes(req, res);
    } else if (req.url.includes('condicoespagamento')) {
        condicoesPagamentoRoutes(req, res);
    }
}

module.exports = {
    router
}