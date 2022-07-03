const daoProdutos = require('../daos/daoProdutos');

// @descricao BUSCA TODOS OS REGISTROS
// @route GET /api/produtos
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
        const url = req.url;
        const response = await daoProdutos.buscarTodosComPg(url);
        const qtd = await daoProdutos.getQtd(url);
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
// @route GET /api/produtos/:id
async function buscarUm(req, res, id) {
    try {
        const mProduto = await daoProdutos.buscarUm(id);
        if (!mProduto) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Produto não encontrado.' }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(mProduto));
        };
    } catch (error) {
        console.log(error);
    };
};

// @descricao SALVA UM REGISTROS
// @route POST /api/produtos
async function salvar(req, res) {
    try {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        })

        req.on('end', async () => {
            const response = JSON.parse(body);
            const mProduto = {
                descricao: response.descricao,
                valorCompra: response.valorCompra,
                valorVenda: response.valorVenda,
                tipoProduto: response.tipoProduto,
                fornecedor: response.fornecedor
            };
            const novoProduto = await daoProdutos.salvar(mProduto);
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(novoProduto));
        })
    } catch (error) {
        console.log(error);
    };
};

// @descricao ALTERA UM REGISTROS
// @route PUT /api/produtos/:id
async function alterar(req, res, id) {
    try {
        const mProduto = await daoProdutos.buscarUm(id);
        if (!mProduto) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Produto não encontrado.' })); 
        };
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        })
        req.on('end', async () => {
            const response = JSON.parse(body);
            const mProduto = {
                id: response.id,
                descricao: response.descricao,
                valorCompra: response.valorCompra,
                valorVenda: response.valorVenda,
                tipoProduto: response.tipoProduto,
                fornecedor: response.fornecedor
            };
            const novoProduto = await daoProdutos.alterar(id, mProduto)
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(novoProduto));
        })
    } catch (error) {
        console.log(error);
    }
};

// @descricao DELETA UM REGISTROS
// @route GET /api/produtos/:id
async function deletar(req, res, id) {
    try {
        const mProduto = await daoProdutos.buscarUm(id);
        if (!mProduto) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Produto não encontrado.' }));
        }
        const response = await daoProdutos.deletar(id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
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
            const response = JSON.parse(body);
            const mProduto = {
                descricao: response.descricao,
                valorCompra: response.valorCompra,
                valorVenda: response.valorVenda,
                tipoProduto: response.tipoProduto,
                fornecedor: response.fornecedor
            };
            const resp = await daoProdutos.validate(mProduto);
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(resp.rowCount));
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