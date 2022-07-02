const ctrlFornecedores = require('../controllers/ctrlFornecedores');

function fornecedoresRoutes(req, res) {
    if(req.method === 'OPTIONS') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end();
    } else if(req.method === 'GET') {
        if(req.url.match(/\/api\/fornecedores\/([0-9+])/)) {
            const id = req.url.split('/')[3];
            ctrlFornecedores.buscarUm(req, res, id);
        } else if (req.url.includes('page=all')) {
            ctrlFornecedores.buscarTodosSemPg(req, res);
        } else {
            ctrlFornecedores.buscarTodosComPg(req, res);
        }
    } else if(req.method === 'POST') {
        if (req.url === '/api/fornecedores')
            ctrlFornecedores.salvar(req, res);
        else if (req.url.includes('validate'))
            ctrlFornecedores.validate(req, res);
    } else if(req.url.match(/\/api\/fornecedores\/([0-9+])/) && req.method === 'PUT') {
        const id = req.url.split('/')[3];
        ctrlFornecedores.alterar(req, res, id);
    } else if(req.url.match(/\/api\/fornecedores\/([0-9+])/) && req.method === 'DELETE') {
        const id = req.url.split('/')[3];
        ctrlFornecedores.deletar(req, res, id);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Rota não encontrada.'}));
    }
}

module.exports = {
    fornecedoresRoutes
}