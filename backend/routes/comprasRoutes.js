const ctrlCompras = require('../controllers/ctrlCompras');

function comprasRoutes(req, res) {
    console.log(req.url);
    console.log(req.method);
    if(req.method === 'OPTIONS') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end();
    } else if(req.method === 'GET') {
        if(req.url.includes('numnf') && req.url.includes('serienf') && req.url.includes('modelonf') && req.url.includes('idfornecedor')) {
            ctrlCompras.buscarUm(req, res);
        } else if (req.url.includes('filter')) {
            ctrlCompras.validate(req, res);
        } else if (req.url.includes('page=all')) {
            ctrlCompras.buscarTodosSemPg(req, res)
        } else {
            ctrlCompras.buscarTodosComPg(req, res);
        }
    } else if(req.url === '/api/compras' && req.method === 'POST') {
        ctrlCompras.salvar(req, res);
    } else if(req.url.match(/\/api\/compras\/([0-9+])/) && req.method === 'PUT') {
        const id = req.url.split('/')[3];
        ctrlCompras.alterar(req, res, id);
    } else if(req.url.includes('numnf') && req.url.includes('serienf') && req.url.includes('modelonf') && req.url.includes('idfornecedor') && req.method === 'DELETE') {
        ctrlCompras.deletar(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Rota não encontrada.'}));
    }
}

module.exports = {
    comprasRoutes
}