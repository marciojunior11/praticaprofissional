const { pool } = require('../datamodule/index');
const daoGrades = require('./daoGrades');

// @descricao BUSCA TODOS OS REGISTROS
// @route GET /api/caracteristicas
async function getQtd(url) {
    return new Promise((resolve, reject) => {
        if (url.endsWith('=')) {
            pool.query('select * from caracteristicas', (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res.rowCount);
            })
        } else {
            var filter = url.split('=')[3];
            pool.query('select * from caracteristicas where descricao like ' + "'%" + `${filter.toUpperCase()}` + "%'", (err, res) => {
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
            pool.query('select * from caracteristicas order by id asc', async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaCaracteristicas = [];
                for (let i = 0; i < res.rows.length; i++) {
                    let mGrade = await daoGrades.buscarUm(res.rows[i].fk_idgrade);
                    mListaCaracteristicas.push({
                        id: res.rows[i].id,
                        descricao: res.rows[i].descricao,
                        grade: mGrade,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt
                    });
                }
                return resolve(mListaCaracteristicas);
            })
        } else {
            const filter = url.split('=')[2];
            pool.query(`select * from caracteristicas order by id asc where descricao like '%${filter.toUpperCase()}%'`, async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaCaracteristicas = [];
                for (let i = 0; i < res.rows.length; i++) {
                    let mGrade = await daoGrades.buscarUm(res.rows[i].fk_idgrade);
                    mListaCaracteristicas.push({
                        id: res.rows[i].id,
                        descricao: res.rows[i].descricao,
                        grade: mGrade,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt
                    });
                }
                return resolve(mListaCaracteristicas);
            })
        }
    })
};

async function buscarTodosComPg (url) {
    var limit = url.split('=')[2];
    var page = url.split('=')[1];
    limit = limit.replace(/[^0-9]/g, '');
    page = page.replace(/[^0-9]/g, '');
    return new Promise((resolve, reject) => {
        if (url.endsWith('=')) {
            pool.query(`select * from caracteristicas order by id asc limit ${limit} offset ${(limit*page)-limit}`, async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaCaracteristicas = [];
                for (let i = 0; i < res.rows.length; i++) {
                    let mGrade = await daoGrades.buscarUm(res.rows[i].fk_idgrade);
                    mListaCaracteristicas.push({
                        id: res.rows[i].id,
                        descricao: res.rows[i].descricao,
                        grade: mGrade,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt
                    });
                }
                return resolve(mListaCaracteristicas);
            })
        } else {
            var filter = url.split('=')[3];
            pool.query('select * from caracteristicas where descricao like ' + "'%" + `${filter.toUpperCase()}` + "%' " + `limit ${limit} offset ${(limit*page)-limit}`, async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaCaracteristicas = [];
                for (let i = 0; i < res.rows.length; i++) {
                    let mGrade = await daoGrades.buscarUm(res.rows[i].fk_idgrade);
                    mListaCaracteristicas.push({
                        id: res.rows[i].id,
                        descricao: res.rows[i].descricao,
                        grade: mGrade,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt
                    });
                }
                return resolve(mListaCaracteristicas);
            })
        }
    })
};

// @descricao BUSCA UM REGISTRO
// @route GET /api/caracteristicas
async function buscarUm (id) {
    return new Promise((resolve, reject) => {
        pool.query('select * from caracteristicas where id = $1', [id], async (err, res) => {
            if (err) {
                return reject(err);
            }
            if (res.rowCount != 0) {
                const mGrade = await daoGrades.buscarUm(res.rows[0].fk_idgrade);
                const mCaracteristica = {
                    id: res.rows[0].id,
                    descricao: res.rows[0].descricao,
                    grade: mGrade,
                    datacad: res.rows[0].datacad,
                    ultalt: res.rows[0].ultalt
                }
                return resolve(mCaracteristica);
            }
            return resolve(null);
        })
    })
};

// @descricao SALVA UM REGISTRO
// @route POST /api/caracteristicas
async function salvar (caracteristicas) {
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
                client.query('insert into caracteristicas (descricao, fk_idgrade, datacad, ultalt) values($1, $2, $3, $4)', [caracteristicas.descricao.toUpperCase(), caracteristicas.grade.id, caracteristicas.datacad, caracteristicas.ultalt], async (err, res) => {
                    if (shouldAbort(err)) return reject(err);
                    client.query('COMMIT', async err => {
                        if (err) {
                            console.error('Erro durante o commit da transação', err.stack);
                            done();
                            return reject(err);
                        }
                        const response = await client.query('select * from caracteristicas where id = (select max(id) from caracteristicas)');
                        done();
                        return resolve(response.rows[0]);
                    })
                })
            })
        })

    })
};

// @descricao ALTERA UM REGISTRO
// @route PUT /api/caracteristicas/:id
async function alterar (id, caracteristicas) {
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
                client.query('update caracteristicas set id = $1, descricao = $2, fk_idgrade = $3, ultalt = $4 where id = $5 ', [caracteristicas.id, caracteristicas.descricao.toUpperCase(), caracteristicas.grade.id, caracteristicas.ultalt, id], (err, res) => {
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
// @route GET /api/caracteristicas/:id
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
                client.query(`delete from caracteristicas where id = ${id}`, (err, res) => {
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

async function validate(filter) {
    return new Promise( async (resolve, reject) => {
        pool.query(`select * from caracteristicas where descricao like '${filter.toUpperCase()}'`, (err, res) => {
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