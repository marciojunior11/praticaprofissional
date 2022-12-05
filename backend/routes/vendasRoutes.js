const ctrlVendas = require('../controllers/ctrlVendas');

function vendasRoutes(req, res) {
    if(req.method === 'OPTIONS') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end();
    } else if(req.method === 'GET') {
        if(req.url.match(/\/api\/clientes\/([0-9+])/)) {
            const id = req.url.split('/')[3];
            ctrlVendas.buscarUm(req, res, id);
        } else if (req.url.includes('page=all')) {
            ctrlVendas.buscarTodosSemPg(req, res)
        } else {
            ctrlVendas.buscarTodosComPg(req, res);
        }
    } else if(req.method === 'POST') {
        if (req.url.includes('validate')) {
            ctrlVendas.validate(req, res);
        } else {
            ctrlVendas.salvar(req, res);
        }
    } else if(req.method === 'PUT') {
        if (req.url.match(/\/api\/vendas\/([0-9+])/)) {
            const id = req.url.split('/')[3];
            ctrlVendas.alterar(req, res, id);
        } else if (req.url.includes('pagarconta')) {
            ctrlVendas.receberConta(req, res);
        }
    } else if(req.url.includes('numnf') && req.url.includes('serienf') && req.url.includes('modelonf') && req.url.includes('idfornecedor') && req.method === 'DELETE') {
        ctrlVendas.deletar(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Rota não encontrada.'}));
    }
}

module.exports = {
    vendasRoutes
}