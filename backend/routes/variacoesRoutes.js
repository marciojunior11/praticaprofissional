const ctrlVariacoes = require('../controllers/ctrlVariacoes');

function variacoesRoutes(req, res) {
    if(req.method === 'OPTIONS') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end();
    } else if(req.method === 'GET') {
        if(req.url.match(/\/api\/variacoes\/([0-9+])/)) {
            const id = req.url.split('/')[3];
            ctrlVariacoes.buscarUm(req, res, id);
        } else if (req.url.includes("idcaracteristica")) {
            ctrlVariacoes.buscarPorCaracteristica(req, res);
        } else if (req.url.includes('page=all')) {
            ctrlVariacoes.buscarTodosSemPg(req, res)
        } else {
            ctrlVariacoes.buscarTodosComPg(req, res);
        }
    } else if (req.method === 'POST') {
        if (req.url.includes('validate')) {
            ctrlVariacoes.validate(req, res);
        } else {
            ctrlVariacoes.salvar(req, res);
        }
    } else if(req.url.match(/\/api\/variacoes\/([0-9+])/) && req.method === 'PUT') {
        const id = req.url.split('/')[3];
        ctrlVariacoes.alterar(req, res, id);
    } else if(req.url.match(/\/api\/variacoes\/([0-9+])/) && req.method === 'DELETE') {
        const id = req.url.split('/')[3];
        ctrlVariacoes.deletar(req, res, id);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Rota não encontrada.'}));
    }
}

module.exports = {
    variacoesRoutes
}