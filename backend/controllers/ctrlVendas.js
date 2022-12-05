const daoVendas = require('../daos/daoVendas');

// @descricao BUSCA TODOS OS REGISTROS
// @route GET /api/paises
async function buscarTodosSemPg(req, res) {
    try {
        const response = await daoVendas.buscarTodosSemPg(req.url);
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
        const response = await daoVendas.buscarTodosComPg(req.url);
        const qtd = await daoVendas.getQtd(req.url);
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
        const response = await daoVendas.buscarUm(id);
        if (!response) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Venda não encontrada.' }));
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
            const { 
                cliente,
                observacao,
                condicaopagamento,
                vltotal,
                flsituacao,
                listaprodutos,
                listacontasreceber,
                dataemissao,
                datacad,
                ultalt
            } = JSON.parse(body);
            const mVenda = {
                cliente,
                observacao,
                condicaopagamento,
                vltotal,
                flsituacao,
                listaprodutos,
                listacontasreceber,
                dataemissao,
                datacad,
                ultalt
            };
            const novaVenda = await daoVendas.salvar(mVenda);
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(novaVenda));
        })
    } catch (error) {
        console.log(error);
    };
};

// @descricao ALTERA UM REGISTROS
// @route PUT /api/paises/:id
async function alterar(req, res, id) {
    try {
        const response = await daoVendas.buscarUm(id);
        if (!response) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Venda não encontrada.' })); 
        };
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        })
        req.on('end', async () => {
            const { 
                cliente,
                observacao,
                condicaopagamento,
                vltotal,
                flsituacao,
                listaprodutos,
                listacontasreceber,
                dataemissao,
                datacad,
                ultalt
            } = JSON.parse(body);
            const mVenda = {
                cliente,
                observacao,
                condicaopagamento,
                vltotal,
                flsituacao,
                listaprodutos,
                listacontasreceber,
                dataemissao,
                datacad,
                ultalt
            };
            const novaVenda = await daoVendas.alterar(id, mVenda)
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(novaVenda));
        })
    } catch (error) {
        console.log(error);
    }
};

async function receberConta(req, res) {
    try {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        })
        req.on('end', async () => {
            const { 
                nrparcela,
                id,
                flsituacao
            } = JSON.parse(body);
            const mConta = {
                nrparcela,
                id,
                flsituacao
            };
            const contaPaga = await daoVendas.receberConta(mConta);
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(contaPaga));
        })        
    } catch (error) {
        console.log(error);
    }
}

// @descricao DELETA UM REGISTROS
// @route GET /api/paises/:id
async function deletar(req, res) {
    try {
        const response = await daoVendas.buscarUm(req.url);
        if (!response) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Forma de pagamento não encontrada.' }));
        }
        const responseDelete = await daoVendas.deletar(req.url);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(responseDelete));
    } catch (error) {
        console.log(error);
    }
};

async function validate(req, res) {
    console.log('aqui');
    try {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        })

        req.on('end', async () => {
            const { numnf, serienf, modelonf, idfornecedor } = JSON.parse(body);
            const mVenda = {
                numnf,
                serienf,
                modelonf,
                idfornecedor
            };
            const response = await daoVendas.validate(mVenda);
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(response.rowCount));
        })
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
    receberConta,
    deletar,
    validate
}