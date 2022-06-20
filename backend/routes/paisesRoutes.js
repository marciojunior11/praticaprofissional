const ctrlPaises = require('../controllers/ctrlPaises');

function paisesRoutes(req, res) {
    if(req.method === 'OPTIONS') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end();
    } else if(req.method === 'GET') {
        if(req.url.match(/\/api\/paises\/([0-9+])/)) {
            const id = req.url.split('/')[3];
            ctrlPaises.buscarUm(req, res, id);
        } else if (req.url.includes('filter')) {
            ctrlPaises.BuscarTodosSemFiltro(req, res);
        } else {
            ctrlPaises.buscarTodos(req, res);
        }
    } else if(req.url === '/api/paises' && req.method === 'POST') {
        ctrlPaises.salvar(req, res);
    } else if(req.url.match(/\/api\/paises\/([0-9+])/) && req.method === 'PUT') {
        const id = req.url.split('/')[3];
        ctrlPaises.alterar(req, res, id);
    } else if(req.url.match(/\/api\/paises\/([0-9+])/) && req.method === 'DELETE') {
        const id = req.url.split('/')[3];
        ctrlPaises.deletar(req, res, id);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Rota não encontrada.'}));
    }
}

module.exports = {
    paisesRoutes
}