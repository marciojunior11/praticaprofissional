const daoEstados = require('../daos/daoEstados');
const daoPaises = require('../daos/daoPaises');

// @descricao BUSCA TODOS OS REGISTROS
// @route GET /api/estados
async function buscarTodosSemPg(req, res) {
    try {
        const response = await daoEstados.buscarTodosSemPg(req.url);
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
        const response = await daoEstados.buscarTodosComPg(url);
        const qtd = await daoEstados.getQtd(url);
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
// @route GET /api/estados/:id
async function buscarUm(req, res, id) {
    try {
        const estado = await daoEstados.buscarUm(id);
        const pais = await daoPaises.buscarUm(estado.rows[0].fk_idpais);
        console.log(estado);
        console.log(pais);
        var mEstado = {
            id: estado.rows[0].id,
            estado: estado.rows[0].estado,
            uf: estado.rows[0].uf,
            pais: pais.rows[0]
        }
        console.log(mEstado);
        if (estado.rows.length === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Estado não encontrado.' }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(mEstado));
        };
    } catch (error) {
        console.log(error);
    };
};

// @descricao SALVA UM REGISTROS
// @route POST /api/estados
async function salvar(req, res) {
    try {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        })

        req.on('end', async () => {
            const response = JSON.parse(body);
            const mEstado = {
                estado: response.estado,
                uf: response.uf,
                pais: response.pais
            };
            const novoEstado = await daoEstados.salvar(mEstado);
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(novoEstado));
        })
    } catch (error) {
        console.log(error);
    };
};

// @descricao ALTERA UM REGISTROS
// @route PUT /api/estados/:id
async function alterar(req, res, id) {
    try {
        const mEstado = await daoEstados.buscarUm(id);
        if (mEstado.rows.length === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Estado não encontrado.' })); 
        };
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        })
        req.on('end', async () => {
            const response = JSON.parse(body);
            const mEstado = {
                id: response.id,
                estado: response.estado,
                uf: response.uf,
                pais: response.pais
            };
            const novoPais = await daoEstados.alterar(id, mEstado)
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(novoPais));
        })
    } catch (error) {
        console.log(error);
    }
};

// @descricao DELETA UM REGISTROS
// @route GET /api/estados/:id
async function deletar(req, res, id) {
    try {
        const estado = await daoEstados.buscarUm(id);
        if (estado.rows.length === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Estado não encontrado.' }));
        }
        const response = await daoEstados.deletar(id);
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
            const mEstado = {
                estado: response.estado,
                uf: response.uf,
                pais: response.pais
            };
            const resp = await daoEstados.validate(mEstado);
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