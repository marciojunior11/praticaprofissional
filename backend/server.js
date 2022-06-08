const http = require('http');
const { router } = require('./routes/router');

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method == 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'DELETE');
    }
    router(req, res);
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`SERVIDOR RODANDO NA PORTA ${PORT}`));