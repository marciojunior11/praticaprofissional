const daoFornecedores = require('../daos/daoFornecedores');
const daoCidades = require('../daos/daoCidades');

// @descricao BUSCA TODOS OS REGISTROS
// @route GET /api/fornecedores
async function buscarTodosSemPg(req, res) {
    try {
        const response = await daoFornecedores.buscarTodosSemPg(req.url);
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
        const response = await daoFornecedores.buscarTodosComPg(url);
        const qtd = await daoFornecedores.getQtd(url);
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
// @route GET /api/fornecedores/:id
async function buscarUm(req, res, id) {
    try {
        const mFornecedor = await daoFornecedores.buscarUm(id);
        if (!mFornecedor) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Cidade não encontrada.' }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(mFornecedor));
        };
    } catch (error) {
        console.log(error);
    };
};

// @descricao SALVA UM REGISTROS
// @route POST /api/fornecedores
async function salvar(req, res) {
    try {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        })

        req.on('end', async () => {
            const response = JSON.parse(body);
            const mFornecedor = {
                razSocial: response.razSocial,
                nomeFantasia: response.nomeFantasia,
                cnpj: response.cnpj,
                telefone: response.telefone,
                endereco: response.endereco,
                numEnd: response.numEnd,
                bairro: response.bairro,
                cidade: response.cidade
            };
            const novoFornecedor = await daoFornecedores.salvar(mFornecedor);
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(novaCidade));
        })
    } catch (error) {
        console.log(error);
    };
};

// @descricao ALTERA UM REGISTROS
// @route PUT /api/fornecedores/:id
async function alterar(req, res, id) {
    try {
        const mFornecedor = await daoFornecedores.buscarUm(id);
        if (!mFornecedor) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Cidade não encontrada.' })); 
        };
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        })
        req.on('end', async () => {
            const response = JSON.parse(body);
            const mFornecedor = {
                id: response.id,
                razSocial: response.razSocial,
                nomeFantasia: response.nomeFantasia,
                cnpj: response.cnpj,
                telefone: response.telefone,
                endereco: response.endereco,
                numEnd: response.numEnd,
                bairro: response.bairro,
                cidade: response.cidade
            };
            const novoFornecedor = await daoFornecedores.alterar(id, mFornecedor)
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(novoFornecedor));
        })
    } catch (error) {
        console.log(error);
    }
};

// @descricao DELETA UM REGISTROS
// @route GET /api/fornecedores/:id
async function deletar(req, res, id) {
    try {
        const mFornecedor = await daoFornecedores.buscarUm(id);
        if (!mFornecedor) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Cidade não encontrada.' }));
        }
        const response = await daoFornecedores.deletar(id);
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
            const mFornecedor = {
                razSocial: response.razSocial,
                nomeFantasia: response.nomeFantasia,
                cnpj: response.cnpj,
                telefone: response.telefone,
                endereco: response.endereco,
                numEnd: response.numEnd,
                bairro: response.bairro,
                cidade: response.cidade
            };
            const resp = await daoFornecedores.validate(mFornecedor);
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