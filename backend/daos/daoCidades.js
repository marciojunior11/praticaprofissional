const { pool } = require('../datamodule/index');
const daoEstados = require('./daoEstados');

// @descricao BUSCA TODOS OS REGISTROS
// @route GET /api/cidades
async function getQtd(url) {
    return new Promise((resolve, reject) => {
        if (url.endsWith('=')) {
            pool.query('select * from cidades', (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res.rowCount);
            })
        } else {
            var filter = url.split('=')[3];
            pool.query('select * from cidades where cidade like ' + "'%" + `${filter.toUpperCase()}` + "%'", (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res.rowCount);
            })
        }
    })
};

async function buscarTodosSemPg(url) {
    return new Promise((resolve, reject) => {
        if (url.endsWith('=')) {
            pool.query('select * from cidades', async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaCidades = [];
                for (let i = 0; i < res.rowCount ; i++) {
                    let mEstado = await daoEstados.buscarUm(res.rows[i].fk_idestado);
                    mListaCidades.push({
                        id: res.rows[i].id,
                        cidade: res.rows[i].cidade,
                        estado: mEstado.rows[0]
                    })
                }
                return resolve(mListaCidades);
            })
        } else {
            const filter = url.split('=')[1]
            console.log(filter);
            pool.query(`select * from cidades where cidade like '${filter.toUpperCase()}'`, async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaCidades = [];
                for (let i = 0; i < res.rowCount ; i++) {
                    let mEstado = await daoEstados.buscarUm(res.rows[i].fk_idestado);
                    mListaCidades.push({
                        id: res.rows[i].id,
                        cidade: res.rows[i].cidade,
                        estado: mEstado.rows[0]
                    })
                }
                return resolve(mListaCidades);
            })   
        }
    })
};

async function buscarTodosComPg (url) {
    var limit = url.split('=')[2];
    var page = url.split('=')[1];
    limit = limit.replace(/[^0-9]/g, '');
    page = page.replace(/[^0-9]/g, '');
    return new Promise( async (resolve, reject) => {
        if (url.endsWith('=')) {
            pool.query(`select * from cidades order by id asc limit ${limit} offset ${(limit*page)-limit}`, async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaCidades = [];
                for (let i = 0; i < res.rowCount ; i++) {
                    let mEstado = await daoEstados.buscarUm(res.rows[i].fk_idestado);
                    mListaCidades.push({
                        id: res.rows[i].id,
                        cidade: res.rows[i].cidade,
                        estado: mEstado.rows[0]
                    })
                }
                return resolve(mListaCidades);
            })
        } else {
            var filter = url.split('=')[3];
            console.log(filter);
            pool.query('select * from cidades where estado like ' + "'%" + `${filter.toUpperCase()}` + "%' " + `limit ${limit} offset ${(limit*page)-limit}`, async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaCidades = [];
                for (let i = 0; i < res.rowCount ; i++) {
                    let mEstado = await daoEstados.buscarUm(res.rows[i].fk_idestado);
                    mListaCidades.push({
                        id: res.rows[i].id,
                        cidade: res.rows[i].cidade,
                        estado: mEstado.rows[0]
                    })
                }
                return resolve(mListaCidades);
            })
        }
    })
};

// @descricao BUSCA UM REGISTRO
// @route GET /api/cidades
async function buscarUm (id) {
    return new Promise((resolve, reject) => {
        pool.query('select * from cidades where id = $1', [id], async (err, res) => {
            if (err) {
                return reject(err);
            }
            if (res.rowCount != 0) {
                const mEstado = await daoEstados.buscarUm(res.rows[0].fk_idestado);
                const mCidade = {
                    id: res.rows[0].id,
                    cidade: res.rows[0].cidade,
                    estado: mEstado
                }
                return resolve(mCidade);
            }
            return resolve(null);
        })
    })
};

// @descricao SALVA UM REGISTRO
// @route POST /api/cidades
async function salvar (cidade) {
    return new Promise((resolve, reject) => {

        pool.connect((err, client, done) => {
            const shouldAbort = err => {
                if (err) {
                    console.error('Erro na transação', err.stack);
                    client.query('ROLLBACK', err => {
                        if (err) {
                            console.error('Erro durante o rollback', err.stack);
                        }
                        done();
                    })
                }
                return !!err;
            }

            client.query('BEGIN', err => {
                if (shouldAbort(err)) return reject(err);
            client.query('insert into cidades (cidade, fk_idEstado) values($1, $2)', [cidade.cidade.toUpperCase(), cidade.estado.id], async (err, res) => {
                    if (shouldAbort(err)) return reject(err);
                    client.query('COMMIT', async err => {
                        if (err) {
                            console.error('Erro durante o commit da transação', err.stack);
                            reject(err);
                        }
                        const response = await client.query('select * from cidades where id = (select max(id) from cidades)');
                        done();
                        return resolve(response.rows[0]);
                    })
                })
            })
        })

    })
};

// @descricao ALTERA UM REGISTRO
// @route PUT /api/cidades/:id
async function alterar (id, cidade) {
    return new Promise((resolve, reject) => {

        pool.connect((err, client, done) => {
            const shouldAbort = err => {
                if (err) {
                    console.error('Erro na transação', err.stack);
                    client.query('ROLLBACK', err => {
                        if (err) {
                            console.error('Erro durante o rollback', err.stack);
                        }
                        done();
                    })
                }
                return !!err;
            }

            client.query('BEGIN', err => {
                if (shouldAbort(err)) return reject(err);
                client.query('update cidades set id = $1, cidade = $2, fk_idestado = $3 where id = $4 ', [cidade.id, cidade.cidade.toUpperCase(), cidade.estado.id, id], (err, res) => {
                    if (shouldAbort(err)) return reject(err);
                    client.query('COMMIT', err => {
                        if (err) {
                            console.error('Erro durante o commit da transação', err.stack);
                            reject(err);
                        }
                        done();
                        return resolve(res);
                    })
                })
            })
        })
    })
};

// @descricao DELETA UM REGISTRO
// @route GET /api/cidades/:id
async function deletar (id) {
    return new Promise((resolve, reject) => {

        pool.connect((err, client, done) => {
            const shouldAbort = err => {
                if (err) {
                    console.error('Erro na transação', err.stack);
                    client.query('ROLLBACK', err => {
                        if (err) {
                            console.error('Erro durante o rollback');
                        }
                        done();
                    })
                }
                return !!err;
            }

            client.query('BEGIN', err => {
                if (shouldAbort(err)) return reject(err);
                client.query(`delete from cidades where id = ${id}`, (err, res) => {
                    if (shouldAbort(err)) return reject(err);
                    client.query('COMMIT', err => {
                        if (err) {
                            console.error('Erro durante o commit da transação', err.stack);
                            reject(err);
                        }
                        done();
                        return resolve(res);
                    })
                })
            })
        })
    })
};

async function validate(cidade) {
    const mEstado = cidade.estado;
    return new Promise( async (resolve, reject) => {
        pool.query(`select * from cidades where cidade like '${cidade.cidade.toUpperCase()}' and fk_idestado = ${mEstado.id}`, (err, res) => {
            if (err) {
                return reject(err);
            }
            return resolve(res);
        })
    })
}

module.exports = {
    getQtd,
    buscarTodosSemPg,
    buscarTodosComPg,
    buscarUm,
    salvar,
    alterar,
    deletar,
    validate
}