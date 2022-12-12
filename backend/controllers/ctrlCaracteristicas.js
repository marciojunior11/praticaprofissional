const daoCaracteristicas = require('../daos/daoCaracteristicas');

// @descricao BUSCA TODOS OS REGISTROS
// @route GET /api/paises

async function buscarPorGrade(req, res) {
    try {
        const response = await daoCaracteristicas.buscarPorGrade(req.url);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            data: response,
            totalCount: response.length
        }));
    } catch (error) {
        console.log(error);
    }
}

async function buscarTodosSemPg(req, res) {
    try {
        const response = await daoCaracteristicas.buscarTodosSemPg(req.url);
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
        const response = await daoCaracteristicas.buscarTodosComPg(req.url);
        const qtd = await daoCaracteristicas.getQtd(req.url);
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
        const response = await daoCaracteristicas.buscarUm(id);
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
            const { descricao, grade, flsituacao, datacad, ultalt } = JSON.parse(body);
            const mCaracteristica = {
                descricao,
                flsituacao,
                grade,
                datacad,
                ultalt
            };
            const novaCaracteristica = await daoCaracteristicas.salvar(mCaracteristica);
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(novaCaracteristica));
        })
    } catch (error) {
        console.log(error);
    };
};

// @descricao ALTERA UM REGISTROS
// @route PUT /api/paises/:id
async function alterar(req, res, id) {
    try {
        const response = await daoCaracteristicas.buscarUm(id);
        if (!response) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Forma de pagamento não encontrada.' })); 
        };
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        })
        req.on('end', async () => {
            const { id, descricao, grade, flsituacao, datacad, ultalt } = JSON.parse(body);
            const mCaracteristica = {
                id,
                descricao,
                grade,
                flsituacao,
                datacad,
                ultalt
            };
            const novaCaracteristica = await daoCaracteristicas.alterar(id, mCaracteristica)
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(novaCaracteristica));
        })
    } catch (error) {
        console.log(error);
    }
};

// @descricao DELETA UM REGISTROS
// @route GET /api/paises/:id
async function deletar(req, res, id) {
    try {
        const response = await daoCaracteristicas.buscarUm(id);
        if (!response) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Forma de pagamento não encontrada.' }));
        }
        const responseDelete = await daoCaracteristicas.deletar(id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(responseDelete));
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
            const { descricao, grade } = JSON.parse(body);
            const mCaracteristica = {
                descricao,
                grade
            };
            const response = await daoCaracteristicas.validate(mCaracteristica);
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(response.rowCount));
        })
    } catch (error) {
        console.log(error);
    }; 
}

module.exports = {
    buscarPorGrade,
    buscarTodosSemPg,
    buscarTodosComPg,
    buscarUm,
    salvar,
    alterar,
    deletar,
    validate
}