const ctrlClientes = require('../controllers/ctrlClientes');

function clientesRoutes(req, res) {
    if(req.method === 'OPTIONS') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end();
    } else if(req.method === 'GET') {
        if(req.url.match(/\/api\/clientes\/([0-9+])/)) {
            const id = req.url.split('/')[3];
            ctrlClientes.buscarUm(req, res, id);
        } else if (req.url.includes('page=all')) {
            ctrlClientes.buscarTodosSemPg(req, res);
        } else {
            ctrlClientes.buscarTodosComPg(req, res);
        }
    } else if(req.method === 'POST') {
        if (req.url === '/api/clientes')
            ctrlClientes.salvar(req, res);
        else if (req.url.includes('validate'))
            ctrlClientes.validate(req, res);
    } else if(req.url.match(/\/api\/clientes\/([0-9+])/) && req.method === 'PUT') {
        const id = req.url.split('/')[3];
        ctrlClientes.alterar(req, res, id);
    } else if(req.url.match(/\/api\/clientes\/([0-9+])/) && req.method === 'DELETE') {
        const id = req.url.split('/')[3];
        ctrlClientes.deletar(req, res, id);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Rota não encontrada.'}));
    }
}

module.exports = {
    clientesRoutes
}