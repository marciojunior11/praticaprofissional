const { pool } = require('../datamodule/index');

// @descricao BUSCA TODOS OS REGISTROS
// @route GET /api/formas_pagamento
async function getQtd(url) {
    return new Promise((resolve, reject) => {
        if (url.endsWith('=')) {
            pool.query('select * from formas_pagamento', (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res.rowCount);
            })
        } else {
            var filter = url.split('=')[3];
            pool.query('select * from formas_pagamento where descricao like ' + "'%" + `${filter.toUpperCase()}` + "%'", (err, res) => {
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
            pool.query('select * from formas_pagamento order by id asc', (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res.rows);
            })
        } else {
            const filter = url.split('=')[2];
            pool.query(`select * from formas_pagamento order by id asc where descricao like '%${filter.toUpperCase()}%'`, (err, res) => {
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
            pool.query(`select * from formas_pagamento order by id asc limit ${limit} offset ${(limit*page)-limit}`,(err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res.rows);
            })
        } else {
            var filter = url.split('=')[3];
            console.log(filter);
            pool.query('select * from formas_pagamento where descricao like ' + "'%" + `${filter.toUpperCase()}` + "%' " + `limit ${limit} offset ${(limit*page)-limit}`, (err, res) => {
                if (err) {
                    return reject(err);
                }
                console.log(res);
                return resolve(res.rows);
            })
        }
    })
};

// @descricao BUSCA UM REGISTRO
// @route GET /api/formas_pagamento
async function buscarUm (id) {
    return new Promise((resolve, reject) => {
        pool.query('select * from formas_pagamento where id = $1', [id], (err, res) => {
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
// @route POST /api/formas_pagamento
async function salvar (formaPagamento) {
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
                client.query('insert into formas_pagamento (descricao, dataCad, ultAlt) values($1, $2, $3)', [formaPagamento.descricao.toUpperCase(), formaPagamento.dataCad, formaPagamento.ultAlt], async (err, res) => {
                    if (shouldAbort(err)) return reject(err);
                    client.query('COMMIT', async err => {
                        if (err) {
                            console.error('Erro durante o commit da transação', err.stack);
                            reject(err);
                        }
                        const response = await client.query('select * from formas_pagamento where id = (select max(id) from formas_pagamento)');
                        done();
                        return resolve(response.rows[0]);
                    })
                })
            })
        })

    })
};

// @descricao ALTERA UM REGISTRO
// @route PUT /api/formas_pagamento/:id
async function alterar (id, formaPagamento) {
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
                client.query('update formas_pagamento set id = $1, descricao = $2, ultAlt = $3 where id = $4 ', [formaPagamento.id, formaPagamento.descricao.toUpperCase(), formaPagamento.ultAlt, id], (err, res) => {
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
// @route GET /api/formas_pagamento/:id
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
                client.query(`delete from formas_pagamento where id = ${id}`, (err, res) => {
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
        pool.query(`select * from formas_pagamento where descricao like '${filter.toUpperCase()}'`, (err, res) => {
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