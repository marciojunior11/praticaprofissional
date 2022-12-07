const daoContratos = require('../daos/daoContratos');

// @descricao BUSCA TODOS OS REGISTROS
// @route GET /api/contratos
async function buscarTodosSemPg(req, res) {
    try {
        const response = await daoContratos.buscarTodosSemPg(req.url);
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
        const contratos = await daoContratos.buscarTodosComPg(url);
        const qtd = await daoContratos.getQtd(url);
        contratos.rowCount = qtd;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            data: contratos,
            totalCount: qtd
        }));
    } catch (error) {
        console.log(error);
    };
};

// @descricao BUSCA UM REGISTROS
// @route GET /api/contratos/:id
async function buscarUm(req, res, id) {
    try {
        const contrato = await daoContratos.buscarUm(id);
        if (!contrato) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Contrato não encontrado.' }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(contrato));
        };
    } catch (error) {
        console.log(error);
    };
};

// @descricao SALVA UM REGISTROS
// @route POST /api/contratos
async function salvar(req, res) {
    try {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        })

        req.on('end', async () => {
            const { 
                cliente,
                qtdmeses,
                vltotal,
                flsituacao,
                condicaopagamento,
                datavalidade,
                venda,
                listacontasreceber,
                datacad,
                ultalt
            } = JSON.parse(body);

            const mContrato = {
                cliente,
                qtdmeses,
                vltotal,
                flsituacao,
                condicaopagamento,
                datavalidade,
                venda,
                listacontasreceber,
                datacad,
                ultalt
            };
            const novoContrato = await daoContratos.salvar(mContrato);
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(novoContrato));
        })
    } catch (error) {
        console.log(error);
    };
};

// @descricao ALTERA UM REGISTROS
// @route PUT /api/contratos/:id
async function alterar(req, res, id) {
    try {
        const mContrato = await daoContratos.buscarUm(id);
        if (!mContrato) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Contrato não encontrado.' })); 
        };
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        })
        req.on('end', async () => {
            const { id, nmcontrato, sigla, ddi, datacad, ultalt } = JSON.parse(body);
            const mContrato = {
                id,
                nmcontrato,
                sigla,
                ddi,
                datacad,
                ultalt
            };
            const novoContrato = await daoContratos.alterar(id, mContrato)
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(novoContrato));
        })
    } catch (error) {
        console.log(error);
    }
};

// @descricao DELETA UM REGISTROS
// @route GET /api/contratos/:id
async function deletar(req, res, id) {
    try {
        const contrato = await daoContratos.buscarUm(id);
        if (!contrato) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Contrato não encontrado.' }));
        }
        const response = await daoContratos.deletar(id);
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
            const { id } = JSON.parse(body);
            const response = await daoContratos.validate(id)
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