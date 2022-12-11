const daoProdutos = require('../daos/daoProdutos');

// @descricao BUSCA TODOS OS REGISTROS
// @route GET /api/paises
async function buscarTodosSemPg(req, res) {
    try {
        const response = await daoProdutos.buscarTodosSemPg(req.url);
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
        const response = await daoProdutos.buscarTodosComPg(req.url);
        const qtd = await daoProdutos.getQtd(req.url);
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
        const response = await daoProdutos.buscarUm(id);
        console.log(response);
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
            const { gtin, descricao, apelido, marca, undmedida, unidade, vlcusto, vlcompra, vlvenda, lucro, pesoliq, pesobruto, ncm, cfop, percicmssaida, percipi, cargatribut, vlfrete, qtdatual, qtdideal, qtdmin, listavariacoes, fornecedor, datacad, ultalt } = JSON.parse(body);
            const mProduto = {
                gtin,
                descricao,
                apelido,
                marca,
                undmedida,
                unidade,
                vlcusto,
                vlcompra,
                vlvenda,
                lucro,
                pesoliq,
                pesobruto,
                ncm,
                cfop,
                percicmssaida,
                percipi,
                cargatribut,
                vlfrete,
                qtdatual,
                qtdideal,
                qtdmin,
                listavariacoes,
                fornecedor,
                datacad,
                ultalt
            };
            const novaProduto = await daoProdutos.salvar(mProduto);
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(novaProduto));
        })
    } catch (error) {
        console.log(error);
    };
};

// @descricao ALTERA UM REGISTROS
// @route PUT /api/paises/:id
async function alterar(req, res, id) {
    try {
        const response = await daoProdutos.buscarUm(id);
        if (!response) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Forma de pagamento não encontrada.' })); 
        };
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        })
        req.on('end', async () => {
            const { id, gtin, descricao, apelido, marca, undmedida, unidade, vlcusto, vlcompra, vlvenda, lucro, pesoliq, pesobruto, ncm, cfop, percicmssaida, percipi, cargatribut, vlfrete, qtdatual, qtdideal, qtdmin, variacao, listavariacoes, fornecedor, datacad, ultalt } = JSON.parse(body);
            const mProduto = {
                id,
                gtin,
                descricao,
                apelido,
                marca,
                undmedida,
                unidade,
                vlcusto,
                vlcompra,
                vlvenda,
                lucro,
                pesoliq,
                pesobruto,
                ncm,
                cfop,
                percicmssaida,
                percipi,
                cargatribut,
                vlfrete,
                qtdatual,
                qtdideal,
                qtdmin,
                variacao,
                listavariacoes,
                fornecedor,
                datacad,
                ultalt
            };
            console.log('vlvenda', mProduto.vlvenda);
            const novaProduto = await daoProdutos.alterar(id, mProduto)
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(novaProduto));
        })
    } catch (error) {
        console.log(error);
    }
};

// @descricao DELETA UM REGISTROS
// @route GET /api/paises/:id
async function deletar(req, res, id) {
    try {
        const response = await daoProdutos.buscarUm(id);
        if (!response) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Forma de pagamento não encontrada.' }));
        }
        const responseDelete = await daoProdutos.deletar(id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(responseDelete));
    } catch (error) {
        console.log(error);
    }
};

async function validate(req, res) {
    try {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        })

        req.on('end', async () => {
            const { gtin } = JSON.parse(body);
            const mProduto = {
                gtin
            };
            const response = await daoProdutos.validate(mProduto);
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
    deletar,
    validate
}