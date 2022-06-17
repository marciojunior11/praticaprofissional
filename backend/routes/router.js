const { paisesRoutes } = require('./paisesRoutes');

function router(req, res) {
    if (req.url.includes('/paises')) {
        paisesRoutes(req, res);
    }
}

module.exports = {
    router
}