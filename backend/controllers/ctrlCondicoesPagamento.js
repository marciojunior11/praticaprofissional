const daoCondicoesPagamento = require('../daos/daoCondicoesPagamento');

// @descricao BUSCA TODOS OS REGISTROS
// @route GET /api/tiposproduto
async function buscarTodosSemPg(req, res) {
    try {
        const response = await daoCondicoesPagamento.buscarTodosSemPg(req.url);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            data: response,
            totalCount: response.length
        }));
    } catch (error) { 
        console.log(error);
    }
}

async function buscarTodosComPg(req, res) {
    try {
        const response = await daoCondicoesPagamento.buscarTodosComPg(req.url);
        const qtd = await daoCondicoesPagamento.getQtd(req.url);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            data: response,
            totalCount: qtd
        }));
    } catch (error) {
        console.log(error);
    };
};

// @descricao BUSCA UM REGISTROS
// @route GET /api/tiposproduto/:id
async function buscarUm(req, res, id) {
    try {
        const response = await daoCondicoesPagamento.buscarUm(id);
        if (!response) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Condição de pagamento não encontrada.' }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(response));
        };
    } catch (error) {
        console.log(error);
    };
};

// @descricao SALVA UM REGISTROS
// @route POST /api/tiposproduto
async function salvar(req, res) {
    try {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        })

        req.on('end', async () => {
            const { descricao, txdesc, txmulta, txjuros, listaparcelas, datacad, ultalt } = JSON.parse(body);
            const mCondicaoPagamento = {
                descricao,
                txdesc,
                txmulta,
                txjuros,
                listaparcelas,
                datacad,
                ultalt
            };
            const response = await daoCondicoesPagamento.salvar(mCondicaoPagamento);
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(response));
        })
    } catch (error) {
        console.log(error);
    };
};

// @descricao ALTERA UM REGISTROS
// @route PUT /api/tiposproduto/:id
async function alterar(req, res, id) {
    try {
        const response = await daoCondicoesPagamento.buscarUm(id);
        if (!response) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Condição de pagamento não encontrada.' })); 
        };
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        })
        req.on('end', async () => {
            const { id, descricao, txdesc, txmulta, txjuros, listaparcelas, datacad, ultalt } = JSON.parse(body);
            const mCondicaoPagamento = {
                id,
                descricao,
                txdesc,
                txmulta,
                txjuros,
                listaparcelas,
                datacad,
                ultalt
            };
            const novaResponse = await daoCondicoesPagamento.alterar(id, mCondicaoPagamento)
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(novaResponse));
        })
    } catch (error) {
        console.log(error);
    }
};

// @descricao DELETA UM REGISTROS
// @route GET /api/tiposproduto/:id
async function deletar(req, res, id) {
    try {
        const response = await daoCondicoesPagamento.buscarUm(id);
        if (!response) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Condição de pagamento não encontrada.' }));
        }
        const novaResponse = await daoCondicoesPagamento.deletar(id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(novaResponse));
    } catch (error) {
        console.log(error);
    }
};

async function validate(req, res) {
    try {
            const filter = req.url.split('=')[1];
            const response = await daoCondicoesPagamento.validate(filter);
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(response.rowCount));
    } catch (error) {
        console.log(error);
    }; 
}

module.exports = {
    buscarTodosSemPg,
    buscarTodosComPg,
    buscarUm,
    salvar,
    alterar,
    deletar,
    validate
}