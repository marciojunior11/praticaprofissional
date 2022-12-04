const daoClientes = require('../daos/daoClientes');

// @descricao BUSCA TODOS OS REGISTROS
// @route GET /api/clientes
async function buscarTodosSemPg(req, res) {
    try {
        const response = await daoClientes.buscarTodosSemPg(req.url);
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
        const response = await daoClientes.buscarTodosComPg(url);
        const qtd = await daoClientes.getQtd(url);
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
// @route GET /api/clientes/:id
async function buscarUm(req, res, id) {
    try {
        const mCliente = await daoClientes.buscarUm(id);
        if (!mCliente) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Cliente não encontrado.' }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(mCliente));
        };
    } catch (error) {
        console.log(error);
    };
};

// @descricao SALVA UM REGISTROS
// @route POST /api/clientes
async function salvar(req, res) {
    try {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        })

        req.on('end', async () => {
            const data = JSON.parse(body);
            const mCliente = {
                nmcliente: data.nmcliente,
                sexo: data.sexo,
                cpf: data.cpf,
                rg: data.rg,
                datanasc: data.datanasc,
                email: data.email,
                telefone: data.telefone,
                celular: data.celular,
                cep: data.cep,
                endereco: data.endereco,
                numend: data.numend,
                bairro: data.bairro,
                cidade: data.cidade,
                condicaopagamento: data.condicaopagamento,
                flsituacao: data.flsituacao,
                flassociado: data.flassociado,
                datacad: data.datacad,
                ultalt: data.ultalt,
            };
            console.log(mCliente);
            const novoCliente = await daoClientes.salvar(mCliente);
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(novoCliente));
        })
    } catch (error) {
        console.log(error);
    };
};

// @descricao ALTERA UM REGISTROS
// @route PUT /api/clientes/:id
async function alterar(req, res, id) {
    try {
        const mCliente = await daoClientes.buscarUm(id);
        if (!mCliente) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Cliente não encontrado.' })); 
        };
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        })
        req.on('end', async () => {
            const data = JSON.parse(body);
            const mCliente = {
                id: data.id,
                nmcliente: data.nmcliente,
                sexo: data.sexo,
                cpf: data.cpf,
                rg: data.rg,
                datanasc: data.datanasc,
                email: data.email,
                telefone: data.telefone,
                celuar: data.celular,
                cep: data.cep,
                endereco: data.endereco,
                numEnd: data.numEnd,
                bairro: data.bairro,
                cidade: data.cidade,
                condicaopagamento: data.condicaopagamento,
                flsituacao: data.flsituacao,
                flassociado: data.flassociado,
                datacad: data.datacad,
                ultalt: data.ultalt,
            };
            const novoCliente = await daoClientes.alterar(id, mCliente)
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(novoCliente));
        })
    } catch (error) {
        console.log(error);
    }
};

// @descricao DELETA UM REGISTROS
// @route GET /api/clientes/:id
async function deletar(req, res, id) {
    try {
        const mCliente = await daoClientes.buscarUm(id);
        if (!mCliente) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Cliente não encontrado.' }));
        }
        const response = await daoClientes.deletar(id);
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
            const data = JSON.parse(body);
            const mCliente = {
                cpf: data.cpf
            };
            const resp = await daoClientes.validate(mCliente);
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