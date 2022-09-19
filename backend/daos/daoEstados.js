const { pool } = require('../datamodule/index');
const daoPaises = require('./daoPaises');

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
            pool.query('select * from estados where nmestado like ' + "'%" + `${filter.toUpperCase()}` + "%'", (err, res) => {
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
            pool.query('select * from estados order by id asc', async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaEstados = [];
                for (let i = 0; i < res.rowCount ; i++) {
                    let mPais = await daoPaises.buscarUm(res.rows[i].fk_idpais);
                    mListaEstados.push({
                        id: res.rows[i].id,
                        nmestado: res.rows[i].nmestado,
                        uf: res.rows[i].uf,
                        pais: mPais,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt
                    })
                }
                return resolve(mListaEstados);
            })
        } else {
            const filter = url.split('=')[2]
            console.log(filter);
            pool.query(`select * from estados where nmestado like '${filter.toUpperCase()}'`, async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaEstados = [];
                for (let i = 0; i < res.rowCount ; i++) {
                    let mPais = await daoPaises.buscarUm(res.rows[i].fk_idpais);
                    mListaEstados.push({
                        id: res.rows[i].id,
                        nmestado: res.rows[i].nmestado,
                        uf: res.rows[i].uf,
                        pais: mPais,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt
                    })
                }
                return resolve(mListaEstados);
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
            pool.query(`select * from estados order by id asc limit ${limit} offset ${(limit*page)-limit}`, async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaEstados = [];
                for (let i = 0; i < res.rowCount ; i++) {
                    let mPais = await daoPaises.buscarUm(res.rows[i].fk_idpais);
                    mListaEstados.push({
                        id: res.rows[i].id,
                        nmestado: res.rows[i].nmestado,
                        uf: res.rows[i].uf,
                        pais: mPais,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt
                    })
                }
                return resolve(mListaEstados);
            })
        } else {
            var filter = url.split('=')[3];
            console.log(filter);
            pool.query('select * from estados where nmestado like ' + "'%" + `${filter.toUpperCase()}` + "%' " + `limit ${limit} offset ${(limit*page)-limit}`, async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaEstados = [];
                for (let i = 0; i < res.rowCount ; i++) {
                    let mPais = await daoPaises.buscarUm(res.rows[i].fk_idpais);
                    mListaEstados.push({
                        id: res.rows[i].id,
                        nmestado: res.rows[i].nmestado,
                        uf: res.rows[i].uf,
                        pais: mPais,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt
                    })
                }
                return resolve(mListaEstados);
            })
        }
    })
};

// @descricao BUSCA UM REGISTRO
// @route GET /api/estados
async function buscarUm (id) {
    return new Promise((resolve, reject) => {
        pool.query('select * from estados where id = $1', [id], async (err, res) => {
            if (err) {
                return reject(err);
            }
            if (res.rowCount != 0) {
                const mPais = await daoPaises.buscarUm(res.rows[0].fk_idpais);
                const mEstado = {
                    id: res.rows[0].id,
                    nmestado: res.rows[0].nmestado,
                    uf: res.rows[0].uf,
                    pais: mPais,
                    datacad: res.rows[0].datacad,
                    ultalt: res.rows[0].ultalt
                }
                return resolve(mEstado);
            }
            return resolve(null);
        })
    })
};

// @descricao SALVA UM REGISTRO
// @route POST /api/estados
async function salvar (estado) {
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
            client.query('insert into estados (nmestado, uf, fk_idPais, datacad, ultalt) values($1, $2, $3, $4, $5)', [estado.nmestado.toUpperCase(), estado.uf.toUpperCase(), estado.pais.id, estado.datacad, estado.ultalt], async (err, res) => {
                    if (shouldAbort(err)) return reject(err);
                    client.query('COMMIT', async err => {
                        if (err) {
                            console.error('Erro durante o commit da transação', err.stack);
                            reject(err);
                        }
                        const response = await client.query('select * from estados where id = (select max(id) from estados)');
                        done();
                        return resolve(response.rows[0]);
                    })
                })
            })
        })

    })
};

// @descricao ALTERA UM REGISTRO
// @route PUT /api/estados/:id
async function alterar (id, estado) {
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
                client.query('update estados set nmestado = $1, uf = $2, fk_idpais = $3, ultalt = $4 where id = $5 ', [estado.nmestado.toUpperCase(), estado.uf.toUpperCase(), estado.pais.id, estado.datacad, id], (err, res) => {
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
// @route GET /api/estados/:id
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
                client.query('delete from estados where id = $1', [id], (err, res) => {
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

async function validate(estado) {
    return new Promise( async (resolve, reject) => {
        pool.query('select * from estados where nmestado like $1 and fk_idpais = $2', [estado.nmestado, estado.pais.id], (err, res) => {
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