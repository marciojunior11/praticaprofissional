const daoPaises = require('../daos/daoPaises');

// @descricao BUSCA TODOS OS REGISTROS
// @route GET /api/paises
async function BuscarTodosSemFiltro(req, res) {
    try {
        const response = await daoPaises.buscarTodosSemFiltro(req.url);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
    } catch (error) { 
        console.log(error);
    }
}

async function buscarTodos(req, res) {
    try {
        const url = req.url;
        const paises = await daoPaises.buscarTodos(url);
        const qtd = await daoPaises.getQtd(url);
        paises.rowCount = qtd;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(paises));
    } catch (error) {
        console.log(error);
    };
};

// @descricao BUSCA UM REGISTROS
// @route GET /api/paises/:id
async function buscarUm(req, res, id) {
    try {
        const pais = await daoPaises.buscarUm(id);
        if (pais.rows.length === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'País não encontrado.' }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(pais.rows[0]));
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
            const { pais, sigla } = JSON.parse(body);
            const mPais = {
                pais,
                sigla
            };
            const novoPais = await daoPaises.salvar(mPais);
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(novoPais));
        })
    } catch (error) {
        console.log(error);
    };
};

// @descricao ALTERA UM REGISTROS
// @route PUT /api/paises/:id
async function alterar(req, res, id) {
    try {
        const mPais = await daoPaises.buscarUm(id);
        if (mPais.rows.length === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'País não encontrado.' })); 
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
            const novoPais = await daoPaises.alterar(id, mPais)
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(novoPais));
        })
    } catch (error) {
        console.log(error);
    }
};

// @descricao DELETA UM REGISTROS
// @route GET /api/paises/:id
async function deletar(req, res, id) {
    try {
        const pais = await daoPaises.buscarUm(id);
        if (pais.rows.length === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'País não encontrado.' }));
        }
        const response = await daoPaises.deletar(id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    BuscarTodosSemFiltro,
    buscarTodos,
    buscarUm,
    salvar,
    alterar,
    deletar
}