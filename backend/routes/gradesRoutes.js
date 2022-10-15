const ctrlGrades = require('../controllers/ctrlGrades');

function gradesRoutes(req, res) {
    if(req.method === 'OPTIONS') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end();
    } else if(req.method === 'GET') {
        if(req.url.match(/\/api\/grades\/([0-9+])/)) {
            const id = req.url.split('/')[3];
            ctrlGrades.buscarUm(req, res, id);
        } else if (req.url.includes('filter')) {
            ctrlGrades.validate(req, res);
        } else if (req.url.includes('page=all')) {
            ctrlGrades.buscarTodosSemPg(req, res)
        } else {
            ctrlGrades.buscarTodosComPg(req, res);
        }
    } else if(req.url === '/api/grades' && req.method === 'POST') {
        ctrlGrades.salvar(req, res);
    } else if(req.url.match(/\/api\/grades\/([0-9+])/) && req.method === 'PUT') {
        const id = req.url.split('/')[3];
        ctrlGrades.alterar(req, res, id);
    } else if(req.url.match(/\/api\/grades\/([0-9+])/) && req.method === 'DELETE') {
        const id = req.url.split('/')[3];
        ctrlGrades.deletar(req, res, id);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Rota não encontrada.'}));
    }
}

module.exports = {
    gradesRoutes
}