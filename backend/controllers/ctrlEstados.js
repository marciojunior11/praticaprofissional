const daoEstados = require('../daos/daoEstados');

// @descricao BUSCA TODOS OS REGISTROS
// @route GET /api/estados
async function buscarTodos(req, res) {
    try {
        const url = req.url;
        const estados = await daoEstados.buscarTodos(url);
        const qtd = await daoEstados.getQtd(url);
        estados.rowCount = qtd;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(estados));
    } catch (error) {
        console.log(error);
    };
};

// @descricao BUSCA UM REGISTROS
// @route GET /api/estados/:id
async function buscarUm(req, res, id) {
    try {
        const pais = await daoEstados.buscarUm(id);
        if (pais.rows.length === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Estado não encontrado.' }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(pais.rows[0]));
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
            const { pais, sigla } = JSON.parse(body);
            const mPais = {
                pais,
                sigla
            };
            const novoPais = await daoEstados.salvar(mPais);
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(novoPais));
        })
    } catch (error) {
        console.log(error);
    };
};

// @descricao ALTERA UM REGISTROS
// @route PUT /api/estados/:id
async function alterar(req, res, id) {
    try {
        const mPais = await daoEstados.buscarUm(id);
        if (mPais.rows.length === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Estado não encontrado.' })); 
        };
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        })
        req.on('end', async () => {
            const { id, pais, sigla } = JSON.parse(body);
            const mPais = {
                id,
                pais,
                sigla
            };
            const novoPais = await daoEstados.alterar(id, mPais)
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
        const pais = await daoEstados.buscarUm(id);
        if (pais.rows.length === 0) {
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

module.exports = {
    buscarTodos,
    buscarUm,
    salvar,
    alterar,
    deletar
}