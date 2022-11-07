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
            pool.query('select * from cidades where nmcidade like ' + "'%" + `${filter.toUpperCase()}` + "%'", (err, res) => {
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
        if (url.endsWith('all')) {
            pool.query('select * from cidades order by id asc', async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaCidades = [];
                for (let i = 0; i < res.rowCount ; i++) {
                    let mEstado = await daoEstados.buscarUm(res.rows[i].fk_idestado);
                    mListaCidades.push({
                        id: res.rows[i].id,
                        nmcidade: res.rows[i].nmcidade,
                        ddd: res.rows[i].ddd,
                        estado: mEstado,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt
                    })
                }
                return resolve(mListaCidades);
            })
        } else {
            const filter = url.split('=')[2]
            console.log(filter);
            pool.query(`select * from cidades where nmcidade like '${filter.toUpperCase()}'`, async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaCidades = [];
                for (let i = 0; i < res.rowCount ; i++) {
                    let mEstado = await daoEstados.buscarUm(res.rows[i].fk_idestado);
                    mListaCidades.push({
                        id: res.rows[i].id,
                        nmcidade: res.rows[i].nmcidade,
                        ddd: res.rows[i].ddd,
                        estado: mEstado,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt
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
                        nmcidade: res.rows[i].nmcidade,
                        ddd: res.rows[i].ddd,
                        estado: mEstado,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt
                    })
                }
                return resolve(mListaCidades);
            })
        } else {
            var filter = url.split('=')[3];
            pool.query('select * from cidades where nmcidade like ' + "'%" + `${filter.toUpperCase()}` + "%' " + `limit ${limit} offset ${(limit*page)-limit}`, async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaCidades = [];
                for (let i = 0; i < res.rowCount ; i++) {
                    let mEstado = await daoEstados.buscarUm(res.rows[i].fk_idestado);
                    mListaCidades.push({
                        id: res.rows[i].id,
                        nmcidade: res.rows[i].nmcidade,
                        ddd: res.rows[i].ddd,
                        estado: mEstado,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt
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
                    nmcidade: res.rows[0].nmcidade,
                    ddd: res.rows[0].ddd,
                    estado: mEstado,
                    datacad: res.rows[0].datacad,
                    ultalt: res.rows[0].ultalt                   
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
            client.query('insert into cidades (nmcidade, ddd, fk_idEstado, datacad, ultalt) values($1, $2, $3, $4, $5)', [cidade.nmcidade.toUpperCase(), cidade.ddd, cidade.estado.id, cidade.datacad, cidade.ultalt], async (err, res) => {
                    if (shouldAbort(err)) return reject(err);
                    client.query('COMMIT', async err => {
                        if (err) {
                            console.error('Erro durante o commit da transação', err.stack);
                            done();
                            return reject(err);
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
                client.query('update cidades set nmcidade = $1, ddd = $2, fk_idestado = $3, ultalt = $4 where id = $5', [cidade.nmcidade.toUpperCase(), cidade.ddd, cidade.estado.id, cidade.ultalt, id], (err, res) => {
                    if (shouldAbort(err)) return reject(err);
                    client.query('COMMIT', err => {
                        if (err) {
                            console.error('Erro durante o commit da transação', err.stack);
                            done();
                            return reject(err);
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
                            done();
                            return reject(err);
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
        pool.query('select * from cidades where nmcidade like $1 and fk_idestado = $2', [cidade.nmcidade, mEstado.id], (err, res) => {
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