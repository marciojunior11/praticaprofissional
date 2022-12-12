const daoCidades = require('../daos/daoCidades');
const daoEstados = require('../daos/daoEstados');

// @descricao BUSCA TODOS OS REGISTROS
// @route GET /api/cidades
async function buscarTodosSemPg(req, res) {
    try {
        const response = await daoCidades.buscarTodosSemPg(req.url);
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
        const response = await daoCidades.buscarTodosComPg(url);
        const qtd = await daoCidades.getQtd(url);
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
// @route GET /api/cidades/:id
async function buscarUm(req, res, id) {
    try {
        const cidade = await daoCidades.buscarUm(id);
        if (!cidade) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Cidade não encontrada.' }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(cidade));
        };
    } catch (error) {
        console.log(error);
    };
};

// @descricao SALVA UM REGISTROS
// @route POST /api/cidades
async function salvar(req, res) {
    try {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        })

        req.on('end', async () => {
            const { nmcidade, ddd, estado, datacad, ultalt } = JSON.parse(body);
            const mCidade = {
                nmcidade: nmcidade,
                ddd: ddd,
                estado: estado,
                datacad: datacad,
                ultalt: ultalt,
            };
            const novaCidade = await daoCidades.salvar(mCidade);
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(novaCidade));
        })
    } catch (error) {
        console.log(error);
    };
};

// @descricao ALTERA UM REGISTROS
// @route PUT /api/cidades/:id
async function alterar(req, res, id) {
    try {
        const mCidade = await daoCidades.buscarUm(id);
        if (!mCidade) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Cidade não encontrada.' })); 
        };
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        })
        req.on('end', async () => {
            const { id, nmcidade, ddd, estado, datacad, ultalt } = JSON.parse(body);
            console.log("ESTADO", estado);
            const mCidade = {
                id: id,
                nmcidade: nmcidade,
                ddd: ddd,
                estado: estado,
                datacad: datacad,
                ultalt: ultalt
            };
            const novaCidade = await daoCidades.alterar(id, mCidade)
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(novaCidade));
        })
    } catch (error) {
        console.log(error);
    }
};

// @descricao DELETA UM REGISTROS
// @route GET /api/cidades/:id
async function deletar(req, res, id) {
    try {
        const cidade = await daoCidades.buscarUm(id);
        if (!cidade) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Cidade não encontrada.' }));
        }
        const response = await daoCidades.deletar(id);
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
            const response = JSON.parse(body);
            const mCidade = {
                nmcidade: response.nmcidade,
                estado: response.estado
            };
            const resp = await daoCidades.validate(mCidade);
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