const daoCompras = require('../daos/daoCompras');

// @descricao BUSCA TODOS OS REGISTROS
// @route GET /api/paises
async function buscarTodosSemPg(req, res) {
    try {
        const response = await daoCompras.buscarTodosSemPg(req.url);
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
        const response = await daoCompras.buscarTodosComPg(req.url);
        const qtd = await daoCompras.getQtd(req.url);
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
async function buscarUm(req, res) {
    try {
        const response = await daoCompras.buscarUm(req.url);
        if (!response) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Compra não encontrada.' }));
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
                numnf,
                serienf,
                modelonf,
                fornecedor,
                condicaopagamento,
                observacao,
                vlfrete,
                vlpedagio,
                vloutrasdespesas,
                vltotal,
                listaprodutos,
                listacontaspagar,
                flsituacao,
                dataemissao,
                dataentrada,
                datacad,
                ultalt
            } = JSON.parse(body);
            const mCompra = {
                numnf,
                serienf,
                modelonf,
                fornecedor,
                condicaopagamento,
                observacao,
                vlfrete,
                vlpedagio,
                vloutrasdespesas,
                vltotal,
                listaprodutos,
                listacontaspagar,
                flsituacao,
                dataemissao,
                dataentrada,
                datacad,
                ultalt
            };
            const novaCompra = await daoCompras.salvar(mCompra);
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(novaCompra));
        })
    } catch (error) {
        console.log(error);
    };
};

// @descricao ALTERA UM REGISTROS
// @route PUT /api/paises/:id
async function alterar(req, res, id) {
    try {
        const response = await daoCompras.buscarUm(id);
        if (!response) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Forma de pagamento não encontrada.' })); 
        };
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        })
        req.on('end', async () => {
            const { numnf, serienf, modelonf, fornecedor, condicaopagamento, centrocusto, listaprodutos, observacao, vltotal, dataemissao, dataentrada, datacad, ultalt } = JSON.parse(body);
            const mCompra = {
                numnf,
                serienf,
                modelonf,
                fornecedor,
                condicaopagamento,
                centrocusto,
                listaprodutos,
                observacao,
                vltotal,
                dataemissao,
                dataentrada,
                datacad,
                ultalt,
            };
            const novaCompra = await daoCompras.alterar(id, mCompra)
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(novaCompra));
        })
    } catch (error) {
        console.log(error);
    }
};

async function pagarConta(req, res) {
    try {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        })
        req.on('end', async () => {
            const { nrparcela, numnf, serienf, modelonf, fornecedor, vltotal } = JSON.parse(body);
            const mConta = {
                nrparcela,
                numnf,
                serienf,
                modelonf,
                fornecedor,
                vltotal
            };
            const contaPaga = await daoCompras.pagarConta(mConta);
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
        const response = await daoCompras.buscarUm(req.url);
        if (!response) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Forma de pagamento não encontrada.' }));
        }
        const responseDelete = await daoCompras.deletar(req.url);
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
            const mCompra = {
                numnf,
                serienf,
                modelonf,
                idfornecedor
            };
            const response = await daoCompras.validate(mCompra);
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
    pagarConta,
    deletar,
    validate
}