const ctrlCidades = require('../controllers/ctrlCidades');

function cidadesRoutes(req, res) {
    if(req.method === 'OPTIONS') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end();
    } else if(req.method === 'GET') {
        if(req.url.match(/\/api\/cidades\/([0-9+])/)) {
            const id = req.url.split('/')[3];
            ctrlCidades.buscarUm(req, res, id);
        } else if (req.url.includes('filter')) {
            ctrlCidades.buscarTodosSemPg(req, res);
        } else {
            ctrlCidades.buscarTodosComPg(req, res);
        }
    } else if(req.method === 'POST') {
        if (req.url === '/api/cidades')
            ctrlCidades.salvar(req, res);
        else if (req.url.includes('validate'))
            ctrlCidades.validate(req, res);
    } else if(req.url.match(/\/api\/cidades\/([0-9+])/) && req.method === 'PUT') {
        const id = req.url.split('/')[3];
        ctrlCidades.alterar(req, res, id);
    } else if(req.url.match(/\/api\/cidades\/([0-9+])/) && req.method === 'DELETE') {
        const id = req.url.split('/')[3];
        ctrlCidades.deletar(req, res, id);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Rota não encontrada.'}));
    }
}

module.exports = {
    cidadesRoutes
}