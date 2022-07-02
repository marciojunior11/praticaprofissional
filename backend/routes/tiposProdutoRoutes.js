const ctrlTiposProduto = require('../controllers/ctrlTiposProduto');

function tiposProdutoRoutes(req, res) {
    if(req.method === 'OPTIONS') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end();
    } else if(req.method === 'GET') {
        if(req.url.match(/\/api\/tiposproduto\/([0-9+])/)) {
            const id = req.url.split('/')[3];
            ctrlTiposProduto.buscarUm(req, res, id);
        } else if (req.url.includes('filter')) {
            ctrlTiposProduto.validate(req, res);
        } else if (req.url.includes('page=all')) {
            ctrlTiposProduto.buscarTodosSemPg(req, res)
        } else {
            ctrlTiposProduto.buscarTodosComPg(req, res);
        }
    } else if(req.url === '/api/tiposproduto' && req.method === 'POST') {
        ctrlTiposProduto.salvar(req, res);
    } else if(req.url.match(/\/api\/tiposproduto\/([0-9+])/) && req.method === 'PUT') {
        const id = req.url.split('/')[3];
        ctrlTiposProduto.alterar(req, res, id);
    } else if(req.url.match(/\/api\/tiposproduto\/([0-9+])/) && req.method === 'DELETE') {
        const id = req.url.split('/')[3];
        ctrlTiposProduto.deletar(req, res, id);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Rota não encontrada.'}));
    }
}

module.exports = {
    tiposProdutoRoutes
}