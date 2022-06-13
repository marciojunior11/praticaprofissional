const { estadosRoutes } = require('./estadosRoutes');
const { paisesRoutes } = require('./paisesRoutes');

function router(req, res) {
    if (req.url.includes('/paises')) {
        paisesRoutes(req, res);
    } else if (req.url.includes('/estados')) {
        estadosRoutes(req, res);
    }
}

module.exports = {
    router
}