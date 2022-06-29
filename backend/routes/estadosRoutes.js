const ctrlEstados = require('../controllers/ctrlEstados');

function estadosRoutes(req, res) {
    if(req.method === 'OPTIONS') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end();
    } else if(req.method === 'GET') {
        if(req.url.match(/\/api\/estados\/([0-9+])/)) {
            const id = req.url.split('/')[3];
            ctrlEstados.buscarUm(req, res, id);
        } else if (req.url.includes('filter')) {
            ctrlEstados.buscarTodosSemPg(req, res);
        } else {
            ctrlEstados.buscarTodosComPg(req, res);
        }
    } else if(req.method === 'POST') {
        if (req.url === '/api/estados')
            ctrlEstados.salvar(req, res);
        else if (req.url.includes('validate'))
            ctrlEstados.validate(req, res);
    } else if(req.url.match(/\/api\/estados\/([0-9+])/) && req.method === 'PUT') {
        const id = req.url.split('/')[3];
        ctrlEstados.alterar(req, res, id);
    } else if(req.url.match(/\/api\/estados\/([0-9+])/) && req.method === 'DELETE') {
        const id = req.url.split('/')[3];
        ctrlEstados.deletar(req, res, id);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Rota não encontrada.'}));
    }
}

module.exports = {
    estadosRoutes
}