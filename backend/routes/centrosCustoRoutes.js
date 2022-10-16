const ctrlCentrosCusto = require('../controllers/ctrlCentrosCusto');

function centrosCustoRoutes(req, res) {
    if(req.method === 'OPTIONS') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end();
    } else if(req.method === 'GET') {
        if(req.url.match(/\/api\/centroscusto\/([0-9+])/)) {
            const id = req.url.split('/')[3];
            ctrlCentrosCusto.buscarUm(req, res, id);
        } else if (req.url.includes('filter')) {
            ctrlCentrosCusto.validate(req, res);
        } else if (req.url.includes('page=all')) {
            ctrlCentrosCusto.buscarTodosSemPg(req, res)
        } else {
            ctrlCentrosCusto.buscarTodosComPg(req, res);
        }
    } else if(req.url === '/api/centroscusto' && req.method === 'POST') {
        ctrlCentrosCusto.salvar(req, res);
    } else if(req.url.match(/\/api\/centroscusto\/([0-9+])/) && req.method === 'PUT') {
        const id = req.url.split('/')[3];
        ctrlCentrosCusto.alterar(req, res, id);
    } else if(req.url.match(/\/api\/centroscusto\/([0-9+])/) && req.method === 'DELETE') {
        const id = req.url.split('/')[3];
        ctrlCentrosCusto.deletar(req, res, id);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Rota não encontrada.'}));
    }
}

module.exports = {
    centrosCustoRoutes
}