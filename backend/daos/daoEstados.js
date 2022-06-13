const { pool } = require('../datamodule/index');

// @descricao BUSCA TODOS OS REGISTROS
// @route GET /api/estados
async function getQtd(url) {
    return new Promise((resolve, reject) => {
        if (url.endsWith('=')) {
            pool.query('select * from estados', (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res.rowCount);
            })
        } else {
            var filter = url.split('=')[3];
            pool.query('select * from estados where estado like ' + "'%" + `${filter.toUpperCase()}` + "%'", (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res.rowCount);
            })
        }
    })
}
async function buscarTodos (url) {
    var limit = url.split('=')[2];
    var page = url.split('=')[1];
    limit = limit.replace(/[^0-9]/g, '');
    page = page.replace(/[^0-9]/g, '');
    return new Promise((resolve, reject) => {
        if (url.endsWith('=')) {
            pool.query(`select * from estados order by id asc limit ${limit} offset ${(limit*page)-limit}`,(err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res);
            })
        } else {
            var filter = url.split('=')[3];
            console.log(filter);
            pool.query('select * from estados where estado like ' + "'%" + `${filter.toUpperCase()}` + "%' " + `limit ${limit} offset ${(limit*page)-limit}`, (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res);
            })
        }
    })
};

// @descricao BUSCA UM REGISTRO
// @route GET /api/estados
async function buscarUm (id) {
    return new Promise((resolve, reject) => {
        pool.query('select * from estados where id = $1', [id], (err, res) => {
            if (err) {
                return reject(err);
            }
            return resolve(res);
        })
    })
};

// @descricao SALVA UM REGISTRO
// @route POST /api/estados
async function salvar (estado) {
    return new Promise((resolve, reject) => {
        pool.query('insert into estados (estado, sigla) values($1, $2)', [estado.estado.toUpperCase(), estado.sigla.toUpperCase()], async (err, res) => {
            if (err) {
                return reject(err);
            }
            const response = await pool.query('select * from estados where id = (select max(id) from estados)');
            console.log(response)
            return resolve(response.rows[0]);
        })
    })
};

// @descricao ALTERA UM REGISTRO
// @route PUT /api/estados/:id
async function alterar (id, estado) {
    console.log(estado);
    return new Promise((resolve, reject) => {
        pool.query('update estados set id = $1, estado = $2, sigla = $3 where id = $4 ', [estado.id, estado.estado.toUpperCase(), estado.sigla.toUpperCase(), id], (err, res) => {
            if (err) {
                return reject(err);
            }
            return resolve(res);
        })
    })
};

// @descricao DELETA UM REGISTRO
// @route GET /api/estados/:id
async function deletar (id) {
    return new Promise((resolve, reject) => {
        pool.query(`delete from estados where id = ${id}`, (err, res) => {
            if (err) {
                return reject(err);
            }
            return resolve(res);
        })
    })
};

module.exports = {
    getQtd,
    buscarTodos,
    buscarUm,
    salvar,
    alterar,
    deletar
}