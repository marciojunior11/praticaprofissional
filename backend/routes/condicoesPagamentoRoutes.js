const ctrlCondicoesPagamento = require('../controllers/ctrlCondicoesPagamento');

function condicoesPagamentoRoutes(req, res) {
    if(req.method === 'OPTIONS') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end();
    } else if(req.method === 'GET') {
        if(req.url.match(/\/api\/condicoespagamento\/([0-9+])/)) {
            const id = req.url.split('/')[3];
            ctrlCondicoesPagamento.buscarUm(req, res, id);
        } else if (req.url.includes('filter')) {
            ctrlCondicoesPagamento.validate(req, res);
        } else if (req.url.includes('page=all')) {
            ctrlCondicoesPagamento.buscarTodosSemPg(req, res)
        } else {
            ctrlCondicoesPagamento.buscarTodosComPg(req, res);
        }
    } else if(req.method === 'POST') {
        if (req.url.includes('validate')) {
            ctrlCondicoesPagamento.validate(req, res);
        } else {
            ctrlCondicoesPagamento.salvar(req, res);
        }
    } else if(req.url.match(/\/api\/condicoespagamento\/([0-9+])/) && req.method === 'PUT') {
        const id = req.url.split('/')[3];
        ctrlCondicoesPagamento.alterar(req, res, id);
    } else if(req.url.match(/\/api\/condicoespagamento\/([0-9+])/) && req.method === 'DELETE') {
        const id = req.url.split('/')[3];
        ctrlCondicoesPagamento.deletar(req, res, id);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Rota não encontrada.'}));
    }
}

module.exports = {
    condicoesPagamentoRoutes
}