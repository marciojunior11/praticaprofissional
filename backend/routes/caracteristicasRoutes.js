const ctrlCaracteristicas = require('../controllers/ctrlCaracteristicas');

function caracteristicasRoutes(req, res) {
    if(req.method === 'OPTIONS') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end();
    } else if(req.method === 'GET') {
        if(req.url.match(/\/api\/caracteristicas\/([0-9+])/)) {
            const id = req.url.split('/')[3];
            ctrlCaracteristicas.buscarUm(req, res, id);
        } else if (req.url.includes('filter')) {
            ctrlCaracteristicas.validate(req, res);
        } else if (req.url.includes('page=all')) {
            ctrlCaracteristicas.buscarTodosSemPg(req, res)
        } else {
            ctrlCaracteristicas.buscarTodosComPg(req, res);
        }
    } else if(req.url === '/api/caracteristicas' && req.method === 'POST') {
        ctrlCaracteristicas.salvar(req, res);
    } else if(req.url.match(/\/api\/caracteristicas\/([0-9+])/) && req.method === 'PUT') {
        const id = req.url.split('/')[3];
        ctrlCaracteristicas.alterar(req, res, id);
    } else if(req.url.match(/\/api\/caracteristicas\/([0-9+])/) && req.method === 'DELETE') {
        const id = req.url.split('/')[3];
        ctrlCaracteristicas.deletar(req, res, id);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Rota não encontrada.'}));
    }
}

module.exports = {
    caracteristicasRoutes
}