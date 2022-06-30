const { paisesRoutes } = require('./paisesRoutes');
const { estadosRoutes } = require('./estadosRoutes');
const { cidadesRoutes } = require('./cidadesRoutes')

function router(req, res) {
    if (req.url.includes('/paises')) {
        paisesRoutes(req, res);
    } else if (req.url.includes('/estados')) {
        estadosRoutes(req, res);
    } else if (req.url.includes('/cidades')) {
        cidadesRoutes(req, res);
    }
}

module.exports = {
    router
}