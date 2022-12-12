const daoPaises = require('../daos/daoPaises');

// @descricao BUSCA TODOS OS REGISTROS
// @route GET /api/paises
async function buscarTodosSemPg(req, res) {
    try {
        const response = await daoPaises.buscarTodosSemPg(req.url);
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
        const paises = await daoPaises.buscarTodosComPg(url);
        const qtd = await daoPaises.getQtd(url);
        paises.rowCount = qtd;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            data: paises,
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
        const pais = await daoPaises.buscarUm(id);
        if (!pais) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'País não encontrado.' }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(pais));
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
            const { nmpais, sigla, ddi, datacad, ultalt } = JSON.parse(body);
            console.log(body)
            const mPais = {
                nmpais,
                sigla,
                ddi,
                datacad,
                ultalt
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
        if (!mPais) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'País não encontrado.' })); 
        };
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        })
        req.on('end', async () => {
            const { id, nmpais, sigla, ddi, datacad, ultalt } = JSON.parse(body);
            const mPais = {
                id,
                nmpais,
                sigla,
                ddi,
                datacad,
                ultalt
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
        if (!pais) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'País não encontrado.' }));
        }
        const response = await daoPaises.deletar(id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
    } catch (error) {
        res.writeHead(409, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(error));
    }
};

async function validate(req, res) {
    try {
            const filter = req.url.split('=')[1];
            const resp = await daoPaises.validate(filter);
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