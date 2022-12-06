const ctrlContratos = require('../controllers/ctrlContratos');

function contratosRoutes(req, res) {
    if(req.method === 'OPTIONS') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end();
    } else if(req.method === 'GET') {
        if(req.url.match(/\/api\/contratos\/([0-9+])/)) {
            const id = req.url.split('/')[3];
            ctrlContratos.buscarUm(req, res, id);
        } else if (req.url.includes('filter')) {
            ctrlContratos.validate(req, res);
        } else if (req.url.includes('page=all')) {
            ctrlContratos.buscarTodosSemPg(req, res)
        } else {
            ctrlContratos.buscarTodosComPg(req, res);
        }
    } else if(req.url === '/api/contratos' && req.method === 'POST') {
        ctrlContratos.salvar(req, res);
    } else if(req.url.match(/\/api\/contratos\/([0-9+])/) && req.method === 'PUT') {
        const id = req.url.split('/')[3];
        ctrlContratos.alterar(req, res, id);
    } else if(req.url.match(/\/api\/contratos\/([0-9+])/) && req.method === 'DELETE') {
        const id = req.url.split('/')[3];
        ctrlContratos.deletar(req, res, id);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Rota não encontrada.'}));
    }
}

module.exports = {
    contratosRoutes
}