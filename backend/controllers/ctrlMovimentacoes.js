const daoMovimentacoes = require('../daos/daoMovimentacoes');

async function buscarTodosComPg(req, res) {
    try {
        const response = await daoMovimentacoes.buscarTodosComPg(req.url);
        const qtd = await daoMovimentacoes.getQtd(req.url);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            data: response,
            totalCount: qtd
        }));
    } catch (error) {
        console.log(error);
    };
};

module.exports = {
    buscarTodosComPg,
}