const http = require('http');
const ctrlPaises = require('./controllers/ctrlPaises');

const server = http.createServer((req, res) => {
    if(req.url.includes('/paises?_page') && req.method === 'GET') {
        res.setHeader("Access-Control-Allow-Origin", "*");
        ctrlPaises.buscarTodos(req, res);
    } else if(req.url.match(/\/api\/paises\/([0-9+])/) && req.method === 'GET') {
        const id = req.url.split('/')[3];
        console.log('ID', id)
        ctrlPaises.buscarUm(req, res, id);
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
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`SERVIDOR RODANDO NA PORTA ${PORT}`));