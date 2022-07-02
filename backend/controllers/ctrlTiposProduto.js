const daoTiposProduto = require('../daos/daoTiposProduto');

// @descricao BUSCA TODOS OS REGISTROS
// @route GET /api/tiposproduto
async function buscarTodosSemPg(req, res) {
    try {
        const response = await daoTiposProduto.buscarTodosSemPg(req.url);
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
        const url = req.url;
        const tipos_produto = await daoTiposProduto.buscarTodosComPg(url);
        const qtd = await daoTiposProduto.getQtd(url);
        //tipos_produto.rowCount = qtd;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            data: tiposproduto,
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
        const tipos_produto = await daoTiposProduto.buscarUm(id);
        if (!tipos_produto) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'País não encontrado.' }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(tipos_produto));
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
            const { descricao } = JSON.parse(body);
            const mTipoProduto = {
                descricao
            };
            const novoTipoProduto = await daoTiposProduto.salvar(mTipoProduto);
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(novoTipoProduto));
        })
    } catch (error) {
        console.log(error);
    };
};

// @descricao ALTERA UM REGISTROS
// @route PUT /api/tiposproduto/:id
async function alterar(req, res, id) {
    try {
        const mTipoProduto = await daoTiposProduto.buscarUm(id);
        if (!mTipoProduto) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'País não encontrado.' })); 
        };
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        })
        req.on('end', async () => {
            const { descricao } = JSON.parse(body);
            const mTipoProduto = {
                id,
                descricao
            };
            const novoTipoProduto = await daoTiposProduto.alterar(id, mTipoProduto)
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(novoTipoProduto));
        })
    } catch (error) {
        console.log(error);
    }
};

// @descricao DELETA UM REGISTROS
// @route GET /api/tiposproduto/:id
async function deletar(req, res, id) {
    try {
        const mTipoProduto = await daoTiposProduto.buscarUm(id);
        if (!mTipoProduto) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'País não encontrado.' }));
        }
        const response = await daoTiposProduto.deletar(id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
    } catch (error) {
        console.log(error);
    }
};

async function validate(req, res) {
    try {
            const filter = req.url.split('=')[1];
            const resp = await daoTiposProduto.validate(filter);
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(resp.rowCount));
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