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
        const response = await daoFornecedores.buscarTodosComPg(req.url);
        const qtd = await daoFornecedores.getQtd(req.url);
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
            res.end(JSON.stringify({ message: 'Fornecedor não encontrado.' }));
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
            const { 
                razsocial, 
                nmfantasia,
                cnpj, 
                inscestadual,
                email, 
                telefone, 
                celular,
                cep,
                endereco,
                numend,
                bairro,
                cidade,
                condicaopagamento,
                flsituacao,
                datacad,
                ultalt
            } = JSON.parse(body);
            const mFornecedor = {
                razsocial, 
                nmfantasia,
                cnpj, 
                inscestadual,
                email, 
                telefone, 
                celular,
                cep,
                endereco,
                numend,
                bairro,
                cidade,
                condicaopagamento,
                flsituacao,
                datacad,
                ultalt
            };
            console.log(mFornecedor);
            const novoFornecedor = await daoFornecedores.salvar(mFornecedor);
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(novoFornecedor));
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
            res.end(JSON.stringify({ message: 'Fornecedor não encontrado.' })); 
        };
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        })
        req.on('end', async () => {
            const { 
                id,
                razsocial, 
                nmfantasia,
                cnpj, 
                inscestadual,
                email, 
                telefone, 
                celular,
                cep,
                endereco,
                numend,
                bairro,
                cidade,
                condicaopagamento,
                flsituacao,
                datacad,
                ultalt
            } = JSON.parse(body);
            const mFornecedor = {
                id,
                razsocial, 
                nmfantasia,
                cnpj, 
                inscestadual,
                email, 
                telefone, 
                celular,
                cep,
                endereco,
                numend,
                bairro,
                cidade,
                condicaopagamento,
                flsituacao,
                datacad,
                ultalt
            };
            console.log("forn", mFornecedor);
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
            res.end(JSON.stringify({ message: 'Fornecedor não encontrado.' }));
        }
        const response = await daoFornecedores.deletar(id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
    } catch (error) {
        res.writeHead(409, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(error));
    }
};

async function validate(req, res) {
    try {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        })

        req.on('end', async () => {
            const { 
                cnpj, 
            } = JSON.parse(body);
            const mFornecedor = {
                cnpj,
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