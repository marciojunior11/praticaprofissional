const daoFormasPagamento = require('../daos/daoFormasPagamento');

// @descricao BUSCA TODOS OS REGISTROS
// @route GET /api/paises
async function buscarTodosSemPg(req, res) {
    try {
        const response = await daoFormasPagamento.buscarTodosSemPg(req.url);
        console.log(response);
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
        const response = await daoFormasPagamento.buscarTodosComPg(req.url);
        const qtd = await daoFormasPagamento.getQtd(req.url);
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
// @route GET /api/paises/:id
async function buscarUm(req, res, id) {
    try {
        const response = await daoFormasPagamento.buscarUm(id);
        if (!response) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Forma de pagamento não encontrada.' }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(response));
        };
    } catch (error) {
        console.log(error);
    };
};

// @descricao SALVA UM REGISTROS
// @route POST /api/paises
async function salvar(req, res) {
    try {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        })

        req.on('end', async () => {
            const { descricao } = JSON.parse(body);
            const mFormaPagamento = {
                descricao
            };
            const novaFormaPagamento = await daoFormasPagamento.salvar(mFormaPagamento);
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(novaFormaPagamento));
        })
    } catch (error) {
        console.log(error);
    };
};

// @descricao ALTERA UM REGISTROS
// @route PUT /api/paises/:id
async function alterar(req, res, id) {
    try {
        const response = await daoFormasPagamento.buscarUm(id);
        if (!response) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Forma de pagamento não encontrada.' })); 
        };
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        })
        req.on('end', async () => {
            const { id, descricao, dataCad, ultAlt } = JSON.parse(body);
            const mFormaPagamento = {
                id,
                descricao,
                dataCad,
                ultAlt
            };
            const novaFormaPagamento = await daoFormasPagamento.alterar(id, mFormaPagamento)
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(novaFormaPagamento));
        })
    } catch (error) {
        console.log(error);
    }
};

// @descricao DELETA UM REGISTROS
// @route GET /api/paises/:id
async function deletar(req, res, id) {
    try {
        const response = await daoFormasPagamento.buscarUm(id);
        if (!response) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Forma de pagamento não encontrada.' }));
        }
        const responseDelete = await daoFormasPagamento.deletar(id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(responseDelete));
    } catch (error) {
        console.log(error);
    }
};

async function validate(req, res) {
    try {
            const filter = req.url.split('=')[1];
            const response = await daoFormasPagamento.validate(filter);
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