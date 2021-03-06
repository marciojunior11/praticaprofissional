const { pool } = require('../datamodule/index');

// @descricao BUSCA TODOS OS REGISTROS
// @route GET /api/tipos_produto
async function getQtd(url) {
    return new Promise((resolve, reject) => {
        if (url.endsWith('=')) {
            pool.query('select * from tipos_produto', (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res.rowCount);
            })
        } else {
            var filter = url.split('=')[3];
            pool.query('select * from tipos_produto where descricao like ' + "'%" + `${filter.toUpperCase()}` + "%'", (err, res) => {
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
            pool.query('select * from tipos_produto order by id asc', (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res.rows);
            })
        } else {
            const filter = url.split('=')[2];
            pool.query(`select * from tipos_produto order by id asc where descricao like '%${filter.toUpperCase()}%'`, (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res.rows);
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
            pool.query(`select * from tipos_produto order by id asc limit ${limit} offset ${(limit*page)-limit}`,(err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res.rows);
            })
        } else {
            var filter = url.split('=')[3];
            console.log(filter);
            pool.query('select * from tipos_produto where descricao like ' + "'%" + `${filter.toUpperCase()}` + "%' " + `limit ${limit} offset ${(limit*page)-limit}`, (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res.rows);
            })
        }
    })
};

// @descricao BUSCA UM REGISTRO
// @route GET /api/tipos_produto
async function buscarUm (id) {
    return new Promise((resolve, reject) => {
        pool.query('select * from tipos_produto where id = $1', [id], (err, res) => {
            if (err) {
                return reject(err);
            }
            if (res.rowCount != 0) {
                return resolve(res.rows[0]);
            }
            return resolve(null);
        })
    })
};

// @descricao SALVA UM REGISTRO
// @route POST /api/tipos_produto
async function salvar (tipo_produto) {
    return new Promise((resolve, reject) => {

        pool.connect((err, client, done) => {
            const shouldAbort = err => {
                if (err) {
                    console.error('Erro na transa????o', err.stack);
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
                client.query('insert into tipos_produto (descricao) values($1)', [tipo_produto.descricao.toUpperCase()], async (err, res) => {
                    if (shouldAbort(err)) return reject(err);
                    client.query('COMMIT', async err => {
                        if (err) {
                            console.error('Erro durante o commit da transa????o', err.stack);
                            reject(err);
                        }
                        const response = await client.query('select * from tipos_produto where id = (select max(id) from tipos_produto)');
                        done();
                        return resolve(response.rows[0]);
                    })
                })
            })
        })

    })
};

// @descricao ALTERA UM REGISTRO
// @route PUT /api/tipos_produto/:id
async function alterar (id, tipo_produto) {
    return new Promise((resolve, reject) => {

        pool.connect((err, client, done) => {
            const shouldAbort = err => {
                if (err) {
                    console.error('Erro na transa????o', err.stack);
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
                client.query('update tipos_produto set id = $1, descricao = $2 where id = $3 ', [tipo_produto.id, tipo_produto.descricao.toUpperCase(), id], (err, res) => {
                    if (shouldAbort(err)) return reject(err);
                    client.query('COMMIT', err => {
                        if (err) {
                            console.error('Erro durante o commit da transa????o', err.stack);
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
// @route GET /api/tipos_produto/:id
async function deletar (id) {
    return new Promise((resolve, reject) => {

        pool.connect((err, client, done) => {
            const shouldAbort = err => {
                if (err) {
                    console.error('Erro na transa????o', err.stack);
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
                client.query(`delete from tipos_produto where id = ${id}`, (err, res) => {
                    if (shouldAbort(err)) return reject(err);
                    client.query('COMMIT', err => {
                        if (err) {
                            console.error('Erro durante o commit da transa????o', err.stack);
                            reject(err);
                        }
                        done();
                        return resolve(res);
                    })
                })
            })
        })



        // pool.query(`delete from tipos_produto where id = ${id}`, (err, res) => {
        //     if (err) {
        //         return reject(err);
        //     }
        //     return resolve(res);
        // })
    })
};

async function validate(filter) {
    return new Promise( async (resolve, reject) => {
        pool.query(`select * from tipos_produto where descricao like '${filter.toUpperCase()}'`, (err, res) => {
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