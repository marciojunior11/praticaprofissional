const { pool } = require('../datamodule/index');
const { daoFormasPagamento } = require('./daoFormasPagamento');

// @descricao BUSCA TODOS OS REGISTROS
// @route GET /api/condicoespagamento
async function getQtd(url) {
    return new Promise((resolve, reject) => {
        if (url.endsWith('=')) {
            pool.query('select * from condicoespagamento', (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res.rowCount);
            })
        } else {
            var filter = url.split('=')[3];
            pool.query('select * from condicoespagamento where descricao like ' + "'%" + `${filter.toUpperCase()}` + "%'", (err, res) => {
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
            pool.query('select * from condicoespagamento order by id asc', async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaCondicoesPagamento = [];
                for (let i = 0; i < res.rowCount; i++) {
                    let responseParcelas = await pool.query('select * from parcelas where fk_idcondpgto = $1', [res.rows[i].id]);
                    let mListaParcelas = [];
                    for (let j = 0; j < responseParcelas.rowCount; j++) {
                        let responseFormaPgto = await pool.query('select * from formaspagamento where id = $1', [responseParcelas.rows[j].fk_idformapgto]);
                        mListaParcelas.push({
                            numero: responseParcelas.rows[j].numero,
                            dias: responseParcelas.rows[j].dias,
                            percentual: responseParcelas.rows[j].percentual,
                            formapagamento : responseFormaPgto.rows[0],
                            datacad: responseParcelas.rows[j].datacad,
                            ultalt: responseParcelas.rows[j].ultalt,
                        })
                    }
                    mListaCondicoesPagamento.push({
                        id: res.rows[i].id,
                        descricao: res.rows[i].descricao,
                        txdesc: res.rows[i].txdesc,
                        txmulta: res.rows[i].txmulta,
                        txjuros: res.rows[i].txjuros,
                        flsituacao: res.rows[i].flsituacao,
                        listaparcelas: mListaParcelas,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt,
                    })
                }
                return resolve(mListaCondicoesPagamento);
            })
        } else {
            const filter = url.split('=')[2];
            pool.query(`select * from condicoespagamento order by id asc where descricao like '%${filter.toUpperCase()}%'`, async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaCondicoesPagamento = [];
                for (let i = 0; i < res.rowCount; i++) {
                    let responseParcelas = await pool.query('select * from parcelas where fk_idcondpgto = $1', [res.rows[i].id]);
                    let mListaParcelas = [];
                    for (let j = 0; j < responseParcelas.rowCount; j++) {
                        let responseFormaPgto = await pool.query('select * from formaspagamento where id = $1', [responseParcelas.rows[j].fk_idformapgto]);
                        mListaParcelas.push({
                            numero: responseParcelas.rows[j].numero,
                            dias: responseParcelas.rows[j].dias,
                            percentual: responseParcelas.rows[j].percentual,
                            formapagamento : responseFormaPgto.rows[0],
                            datacad: responseParcelas.rows[j].datacad,
                            ultalt: responseParcelas.rows[j].ultalt,
                        })
                    }
                    mListaCondicoesPagamento.push({
                        id: res.rows[i].id,
                        descricao: res.rows[i].descricao,
                        txdesc: res.rows[i].txdesc,
                        txmulta: res.rows[i].txmulta,
                        txjuros: res.rows[i].txjuros,
                        flsituacao: res.rows[i].flsituacao,
                        listaparcelas: mListaParcelas,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt,
                    })
                }
                return resolve(mListaCondicoesPagamento);
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
            pool.query(`select * from condicoespagamento order by id asc limit ${limit} offset ${(limit*page)-limit}`, async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaCondicoesPagamento = [];
                for (let i = 0; i < res.rowCount; i++) {
                    let responseParcelas = await pool.query('select * from parcelas where fk_idcondpgto = $1', [res.rows[i].id]);
                    let mListaParcelas = [];
                    for (let j = 0; j < responseParcelas.rowCount; j++) {
                        let responseFormaPgto = await pool.query('select * from formaspagamento where id = $1', [responseParcelas.rows[j].fk_idformapgto]);
                        mListaParcelas.push({
                            numero: responseParcelas.rows[j].numero,
                            dias: responseParcelas.rows[j].dias,
                            percentual: responseParcelas.rows[j].percentual,
                            formapagamento : responseFormaPgto.rows[0],
                            datacad: responseParcelas.rows[j].datacad,
                            ultalt: responseParcelas.rows[j].ultalt,
                        })
                    }
                    mListaCondicoesPagamento.push({
                        id: res.rows[i].id,
                        descricao: res.rows[i].descricao,
                        txdesc: res.rows[i].txdesc,
                        txmulta: res.rows[i].txmulta,
                        txjuros: res.rows[i].txjuros,
                        flsituacao: res.rows[i].flsituacao,
                        listaparcelas: mListaParcelas,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt,
                    })
                }
                return resolve(mListaCondicoesPagamento);
            })
        } else {
            var filter = url.split('=')[3];
            pool.query('select * from condicoespagamento where descricao like ' + "'%" + `${filter.toUpperCase()}` + "%' " + `limit ${limit} offset ${(limit*page)-limit}`, async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaCondicoesPagamento = [];
                for (let i = 0; i < res.rowCount; i++) {
                    let responseParcelas = await pool.query('select * from parcelas where fk_idcondpgto = $1', [res.rows[i].id]);
                    let mListaParcelas = [];
                    for (let j = 0; j < responseParcelas.rowCount; j++) {
                        let responseFormaPgto = await pool.query('select * from formaspagamento where id = $1', [responseParcelas.rows[j].fk_idformapgto]);
                        mListaParcelas.push({
                            numero: responseParcelas.rows[j].numero,
                            dias: responseParcelas.rows[j].dias,
                            percentual: responseParcelas.rows[j].percentual,
                            formapagamento : responseFormaPgto.rows[0],
                            datacad: responseParcelas.rows[j].datacad,
                            ultalt: responseParcelas.rows[j].ultalt,
                        })
                    }
                    mListaCondicoesPagamento.push({
                        id: res.rows[i].id,
                        descricao: res.rows[i].descricao,
                        txdesc: res.rows[i].txdesc,
                        txmulta: res.rows[i].txmulta,
                        txjuros: res.rows[i].txjuros,
                        flsituacao: res.rows[i].flsituacao,
                        listaparcelas: mListaParcelas,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt,
                    })
                }
                return resolve(mListaCondicoesPagamento);
            })
        }
    })
};

// @descricao BUSCA UM REGISTRO
// @route GET /api/condicoespagamento
async function buscarUm (id) {
    return new Promise((resolve, reject) => {
        pool.query('select * from condicoespagamento where id = $1', [id], async (err, res) => {
            if (err) {
                return reject(err);
            }
            if (res.rowCount != 0) {
                const responseParcelas = await pool.query('select * from parcelas where fk_idcondpgto = $1', [res.rows[0].id]);
                const mListaParcelas = [];
                for (let j = 0; j < responseParcelas.rowCount; j++) {
                    let responseFormaPgto = await pool.query('select * from formaspagamento where id = $1', [responseParcelas.rows[j].fk_idformapgto]);
                    mListaParcelas.push({
                        numero: responseParcelas.rows[j].numero,
                        dias: responseParcelas.rows[j].dias,
                        percentual: responseParcelas.rows[j].percentual,
                        formapagamento: responseFormaPgto.rows[0],
                        datacad: responseParcelas.rows[j].datacad,
                        ultalt: responseParcelas.rows[j].ultalt,
                    })
                }
                const mCondicaoPagamento = {
                    id: res.rows[0].id,
                    descricao: res.rows[0].descricao,
                    txdesc: res.rows[0].txdesc,
                    txmulta: res.rows[0].txmulta,
                    txjuros: res.rows[0].txjuros,
                    flsituacao: res.rows[0].flsituacao,
                    listaparcelas: mListaParcelas,
                    datacad: res.rows[0].datacad,
                    ultalt: res.rows[0].ultalt,
                }
                return resolve(mCondicaoPagamento);
            }
            return resolve(null);
        })
    })
};

// @descricao SALVA UM REGISTRO
// @route POST /api/condicoespagamento
async function salvar (condicaopagamento) {
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
                client.query('insert into condicoespagamento (descricao, txdesc, txmulta, txjuros, datacad, ultalt, flsituacao) values($1, $2, $3, $4, $5, $6, $7)', [condicaopagamento.descricao.toUpperCase(), condicaopagamento.txdesc, condicaopagamento.txmulta, condicaopagamento.txjuros, condicaopagamento.datacad, condicaopagamento.ultalt, condicaopagamento.flsituacao], async (err, res) => {
                    if (shouldAbort(err)) return reject(err);
                    const response = await client.query('select * from condicoespagamento where id = (select max(id) from condicoespagamento)');
                    for (let i = 0; i < condicaopagamento.listaparcelas.length; i++) {
                        client.query('insert into parcelas (fk_idcondpgto, numero, dias, percentual, fk_idformapgto, datacad, ultalt) values($1, $2, $3, $4, $5, $6, $7)', [response.rows[0].id, condicaopagamento.listaparcelas[i].numero, condicaopagamento.listaparcelas[i].dias, condicaopagamento.listaparcelas[i].percentual, condicaopagamento.listaparcelas[i].formapagamento.id, condicaopagamento.listaparcelas[i].datacad, condicaopagamento.listaparcelas[i].ultalt], (err, res) => {
                            if (shouldAbort(err)) return reject(err);
                        })
                    }
                    client.query('COMMIT', err => {
                        if (err) {
                            console.error('Erro durante o commit da transação', err.stack);
                            done();
                            return reject(err);
                        }
                        done();
                        return resolve(response.rows[0]);
                    })
                })
            })
        })

    })
};

// @descricao ALTERA UM REGISTRO
// @route PUT /api/condicoespagamento/:id
async function alterar (id, condicaopagamento) {
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
                client.query('update condicoespagamento set id = $1, descricao = $2, txdesc = $3, txmulta = $4, txjuros = $5, ultalt = $6, flsituacao = $7 where id = $8', [
                    condicaopagamento.id, 
                    condicaopagamento.descricao.toUpperCase(), 
                    condicaopagamento.txdesc, 
                    condicaopagamento.txmulta, 
                    condicaopagamento.txjuros, 
                    condicaopagamento.ultalt, 
                    condicaopagamento.flsituacao, 
                    id
                ], async (err, res) => {
                    if (shouldAbort(err)) return reject(err);
                    client.query('delete from parcelas where fk_idcondpgto = $1', [id], (err, res) => {
                        if (shouldAbort(err)) return reject(err);
                        for (let i = 0; i < condicaopagamento.listaparcelas.length; i++) {
                            client.query('insert into parcelas (fk_idcondpgto, numero, dias, percentual, fk_idformapgto, datacad, ultalt) values($1, $2, $3, $4, $5, $6, $7)', [
                                condicaopagamento.id, 
                                condicaopagamento.listaparcelas[i].numero, 
                                condicaopagamento.listaparcelas[i].dias, 
                                condicaopagamento.listaparcelas[i].percentual, 
                                condicaopagamento.listaparcelas[i].formapagamento.id, 
                                condicaopagamento.listaparcelas[i].datacad, 
                                condicaopagamento.listaparcelas[i].ultalt
                            ], (err, res) => {
                                if (shouldAbort(err)) return reject(err);
                            })
                        }
                    })
                    client.query('COMMIT', async err => {
                        if (err) {
                            console.error('Erro durante o commit da transação', err.stack);
                            console.log("aqui");
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
// @route GET /api/condicoespagamento/:id
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
                client.query('delete from parcelas where fk_idcondpgto = $1', [id], (err, res) => {
                    if (shouldAbort(err)) return reject(err);
                    client.query('delete from condicoespagamento where id = $1', [id], (err, res) => {
                        if (shouldAbort(err)) return reject(err);
                        client.query('COMMIT', err => {
                            if (err) {
                                console.error('Erro durante o commit da transação', err.stack);
                                done();
                                return reject(err);
                            }
                            done();
                        })
                    })
                    return resolve(res);
                })
            })
        })
    })
};

async function validate(condicaopagamento) {
    return new Promise( async (resolve, reject) => {
        pool.query(`select * from condicoespagamento where descricao like '${condicaopagamento.descricao.toUpperCase()}'`, (err, res) => {
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