const ctrlFormasPagamento = require('../controllers/ctrlFormasPagamento');

function formasPagamentoRoutes(req, res) {
    if(req.method === 'OPTIONS') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end();
    } else if(req.method === 'GET') {
        if(req.url.match(/\/api\/formaspagamento\/([0-9+])/)) {
            const id = req.url.split('/')[3];
            ctrlFormasPagamento.buscarUm(req, res, id);
        } else if (req.url.includes('filter')) {
            ctrlFormasPagamento.validate(req, res);
        } else if (req.url.includes('page=all')) {
            ctrlFormasPagamento.buscarTodosSemPg(req, res)
        } else {
            ctrlFormasPagamento.buscarTodosComPg(req, res);
        }
    } else if(req.url === '/api/formaspagamento' && req.method === 'POST') {
        ctrlFormasPagamento.salvar(req, res);
    } else if(req.url.match(/\/api\/formaspagamento\/([0-9+])/) && req.method === 'PUT') {
        const id = req.url.split('/')[3];
        ctrlFormasPagamento.alterar(req, res, id);
    } else if(req.url.match(/\/api\/formaspagamento\/([0-9+])/) && req.method === 'DELETE') {
        const id = req.url.split('/')[3];
        ctrlFormasPagamento.deletar(req, res, id);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Rota não encontrada.'}));
    }
}

module.exports = {
    formasPagamentoRoutes
}