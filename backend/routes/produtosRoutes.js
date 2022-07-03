const ctrlProdutos = require('../controllers/ctrlProdutos');

function produtosRoutes(req, res) {
    if(req.method === 'OPTIONS') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end();
    } else if(req.method === 'GET') {
        if(req.url.match(/\/api\/produtos\/([0-9+])/)) {
            const id = req.url.split('/')[3];
            ctrlProdutos.buscarUm(req, res, id);
        } else if (req.url.includes('page=all')) {
            ctrlProdutos.buscarTodosSemPg(req, res);
        } else {
            ctrlProdutos.buscarTodosComPg(req, res);
        }
    } else if(req.method === 'POST') {
        if (req.url === '/api/produtos')
            ctrlProdutos.salvar(req, res);
        else if (req.url.includes('validate'))
            ctrlProdutos.validate(req, res);
    } else if(req.url.match(/\/api\/produtos\/([0-9+])/) && req.method === 'PUT') {
        const id = req.url.split('/')[3];
        ctrlProdutos.alterar(req, res, id);
    } else if(req.url.match(/\/api\/produtos\/([0-9+])/) && req.method === 'DELETE') {
        const id = req.url.split('/')[3];
        ctrlProdutos.deletar(req, res, id);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Rota não encontrada.'}));
    }
}

module.exports = {
    produtosRoutes
}