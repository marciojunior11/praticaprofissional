const { paisesRoutes } = require('./paisesRoutes');
const { estadosRoutes } = require('./estadosRoutes');
const { cidadesRoutes } = require('./cidadesRoutes');
const { fornecedoresRoutes } = require('./fornecedoresRoutes');
const { clientesRoutes } = require('./clientesRoutes');
const { formasPagamentoRoutes } = require('./formasPagamentoRoutes');
const { condicoesPagamentoRoutes } = require('./condicoesPagamentoRoutes');
const { gradesRoutes } = require('./gradesRoutes');
const { caracteristicasRoutes } = require('./caracteristicasRoutes');

function router(req, res) {
    if (req.url.includes('/paises')) {
        paisesRoutes(req, res);
    } else if (req.url.includes('/estados')) {
        estadosRoutes(req, res);
    } else if (req.url.includes('/cidades')) {
        cidadesRoutes(req, res);
    } else if (req.url.includes('/fornecedores')) {
        fornecedoresRoutes(req, res);
    } else if (req.url.includes('/clientes')) {
        clientesRoutes(req, res);
    } else if (req.url.includes('/formaspagamento')) {
        formasPagamentoRoutes(req, res);
    } else if (req.url.includes('condicoespagamento')) {
        condicoesPagamentoRoutes(req, res);
    } else if (req.url.includes('grades')) {
        gradesRoutes(req, res);
    } else if (req.url.includes('caracteristicas')) {
        caracteristicasRoutes(req, res);
    }
}

module.exports = {
    router
}