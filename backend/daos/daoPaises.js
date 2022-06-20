const { pool } = require('../datamodule/index');

// @descricao BUSCA TODOS OS REGISTROS
// @route GET /api/paises
async function getQtd(url) {
    return new Promise((resolve, reject) => {
        if (url.endsWith('=')) {
            pool.query('select * from paises', (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res.rowCount);
            })
        } else {
            var filter = url.split('=')[3];
            pool.query('select * from paises where pais like ' + "'%" + `${filter.toUpperCase()}` + "%'", (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res.rowCount);
            })
        }
    })
};

async function buscarTodosSemFiltro(url) {
    return new Promise((resolve, reject) => {
        const filter = url.split('=')[1]
        console.log(filter);
        pool.query(`select * from paises where pais like '%${filter}%'`, (err, res) => {
            if (err) {
                return reject(err);
            }
            return resolve(res);
        })
    })
};

async function buscarTodos (url) {
    var limit = url.split('=')[2];
    var page = url.split('=')[1];
    limit = limit.replace(/[^0-9]/g, '');
    page = page.replace(/[^0-9]/g, '');
    return new Promise((resolve, reject) => {
        if (url.endsWith('=')) {
            pool.query(`select * from paises order by id asc limit ${limit} offset ${(limit*page)-limit}`,(err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res);
            })
        } else {
            var filter = url.split('=')[3];
            console.log(filter);
            pool.query('select * from paises where pais like ' + "'%" + `${filter.toUpperCase()}` + "%' " + `limit ${limit} offset ${(limit*page)-limit}`, (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res);
            })
        }
    })
};

// @descricao BUSCA UM REGISTRO
// @route GET /api/paises
async function buscarUm (id) {
    return new Promise((resolve, reject) => {
        pool.query('select * from paises where id = $1', [id], (err, res) => {
            if (err) {
                return reject(err);
            }
            return resolve(res);
        })
    })
};

// @descricao SALVA UM REGISTRO
// @route POST /api/paises
async function salvar (pais) {
    return new Promise((resolve, reject) => {
        pool.query('insert into paises (pais, sigla) values($1, $2)', [pais.pais.toUpperCase(), pais.sigla.toUpperCase()], async (err, res) => {
            if (err) {
                return reject(err);
            }
            const response = await pool.query('select * from paises where id = (select max(id) from paises)');
            console.log(response)
            return resolve(response.rows[0]);
        })
    })
};

// @descricao ALTERA UM REGISTRO
// @route PUT /api/paises/:id
async function alterar (id, pais) {
    console.log(pais);
    return new Promise((resolve, reject) => {
        pool.query('update paises set id = $1, pais = $2, sigla = $3 where id = $4 ', [pais.id, pais.pais.toUpperCase(), pais.sigla.toUpperCase(), id], (err, res) => {
            if (err) {
                return reject(err);
            }
            return resolve(res);
        })
    })
};

// @descricao DELETA UM REGISTRO
// @route GET /api/paises/:id
async function deletar (id) {
    return new Promise((resolve, reject) => {
        pool.query(`delete from paises where id = ${id}`, (err, res) => {
            if (err) {
                return reject(err);
            }
            return resolve(res);
        })
    })
};

module.exports = {
    getQtd,
    buscarTodosSemFiltro,
    buscarTodos,
    buscarUm,
    salvar,
    alterar,
    deletar
}