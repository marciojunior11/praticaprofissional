const { pool } = require('../datamodule/index');
const daoVariacoes = require('./daoVariacoes');

// @descricao BUSCA TODOS OS REGISTROS
// @route GET /api/produtos
async function getQtd(url) {
    return new Promise((resolve, reject) => {
        if (url.endsWith('=')) {
            pool.query('select * from produtos', (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res.rowCount);
            })
        } else {
            var filter = url.split('=')[3];
            pool.query('select * from produtos where descricao like ' + "'%" + `${filter.toUpperCase()}` + "%'", (err, res) => {
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
            pool.query('select * from produtos order by id asc', async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaProdutos = [];
                for (let i = 0; i < res.rows.length; i++) {
                    let mVariacao = await daoVariacoes.buscarUm(res.rows[i].fk_idvariacao);
                    mListaProdutos.push({
                        id: res.rows[i].id,
                        descricao: res.rows[i].descricao,
                        variacao: mVariacao,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt
                    });
                }
                return resolve(mListaProdutos);
            })
        } else {
            const filter = url.split('=')[2];
            pool.query(`select * from produtos order by id asc where descricao like '%${filter.toUpperCase()}%'`, async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaProdutos = [];
                for (let i = 0; i < res.rows.length; i++) {
                    let mVariacao = await daoVariacoes.buscarUm(res.rows[i].fk_idvariacao);
                    mListaProdutos.push({
                        id: res.rows[i].id,
                        descricao: res.rows[i].descricao,
                        variacao: mVariacao,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt
                    });
                }
                return resolve(mListaProdutos);
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
            pool.query(`select * from produtos order by id asc limit ${limit} offset ${(limit*page)-limit}`, async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaProdutos = [];
                for (let i = 0; i < res.rows.length; i++) {
                    let mVariacao = await daoVariacoes.buscarUm(res.rows[i].fk_idvariacao);
                    mListaProdutos.push({
                        id: res.rows[i].id,
                        descricao: res.rows[i].descricao,
                        variacao: mVariacao,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt
                    });
                }
                return resolve(mListaProdutos);
            })
        } else {
            var filter = url.split('=')[3];
            pool.query('select * from produtos where descricao like ' + "'%" + `${filter.toUpperCase()}` + "%' " + `limit ${limit} offset ${(limit*page)-limit}`, async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaProdutos = [];
                for (let i = 0; i < res.rows.length; i++) {
                    let mVariacao = await daoVariacoes.buscarUm(res.rows[i].fk_idvariacao);
                    mListaProdutos.push({
                        id: res.rows[i].id,
                        descricao: res.rows[i].descricao,
                        variacao: mVariacao,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt
                    });
                }
                return resolve(mListaProdutos);
            })
        }
    })
};

// @descricao BUSCA UM REGISTRO
// @route GET /api/produtos
async function buscarUm (id) {
    return new Promise((resolve, reject) => {
        pool.query('select * from produtos where id = $1', [id], async (err, res) => {
            if (err) {
                return reject(err);
            }
            if (res.rowCount != 0) {
                const mVariacao = await daoVariacoes.buscarUm(res.rows[0].fk_idvariacao);
                const mProduto = {
                    id: res.rows[0].id,
                    descricao: res.rows[0].descricao,
                    variacao: mVariacao,
                    datacad: res.rows[0].datacad,
                    ultalt: res.rows[0].ultalt
                }
                return resolve(mProduto);
            }
            return resolve(null);
        })
    })
};

// @descricao SALVA UM REGISTRO
// @route POST /api/produtos
async function salvar (produtos) {
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
                client.query('insert into produtos (descricao, fk_idvariacao, datacad, ultalt) values($1, $2, $3, $4)', [produtos.descricao.toUpperCase(), produtos.variacao.id, produtos.datacad, produtos.ultalt], async (err, res) => {
                    if (shouldAbort(err)) return reject(err);
                    client.query('COMMIT', async err => {
                        if (err) {
                            console.error('Erro durante o commit da transação', err.stack);
                            reject(err);
                        }
                        const response = await client.query('select * from produtos where id = (select max(id) from produtos)');
                        done();
                        return resolve(response.rows[0]);
                    })
                })
            })
        })

    })
};

// @descricao ALTERA UM REGISTRO
// @route PUT /api/produtos/:id
async function alterar (id, produtos) {
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
                client.query('update produtos set id = $1, descricao = $2, fk_idvariacao = $3, ultalt = $4 where id = $5 ', [produtos.id, produtos.descricao.toUpperCase(), produtos.variacao.id, produtos.ultalt, id], (err, res) => {
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
// @route GET /api/produtos/:id
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
                client.query(`delete from produtos where id = ${id}`, (err, res) => {
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

async function validate(filter) {
    return new Promise( async (resolve, reject) => {
        pool.query(`select * from produtos where descricao like '${filter.toUpperCase()}'`, (err, res) => {
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