const { pool } = require('../datamodule/index');
const daoVendas = require('./daoVendas');

// @descricao BUSCA TODOS OS REGISTROS
// @route GET /api/contratos
async function getQtd(url) {
    return new Promise((resolve, reject) => {
        if (url.endsWith('=')) {
            pool.query('select * from contratos', (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res.rowCount);
            })
        } else {
            var filter = url.split('=')[3];
            pool.query(`
                select * from contratos as c inner join clientes as cl
                    on c.fk_idcliente = cl.fk_idcliente 
                where cl.nmcliente like '%${filter.toUpperCase()}%'
             `, (err, res) => {
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
            pool.query('select * from contratos order by id asc', (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res.rows);
            })
        } else {
            const filter = url.split('=')[2];
            pool.query(`
                select * from contratos as c inner join clientes as cl
                    on c.fk_idcliente = cl.fk_idcliente 
                where cl.nmcliente like '%${filter.toUpperCase()}%'
            `, (err, res) => {
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
            pool.query('select * from contratos order by id asc limit $1 offset $2', [limit, ((limit*page)-limit)], (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res.rows);
            })
        } else {
            var filter = url.split('=')[3];
            console.log(filter);
            pool.query(`
                select * from contratos as c inner join clientes as cl
                    on c.fk_idcliente = cl.fk_idclient
                where cl.nmcliente like ${filter.toUpperCase()} limit ${limit} offset ${(limit * page) - limit}
            `, (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res.rows);
            })
        }
    })
};

// @descricao BUSCA UM REGISTRO
// @route GET /api/contratos
async function buscarUm (id) {
    return new Promise((resolve, reject) => {
        pool.query('select * from contratos where id = $1', [id], (err, res) => {
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
// @route POST /api/contratos
async function salvar (contrato) {
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

            client.query('BEGIN', async err => {
                if (shouldAbort(err)) return reject(err);
                await daoVendas.salvar(contrato.venda);
                var response = await client.query('select * from vendas where id = (select max(id) from vendas)');
                var venda = response.rows[0];
                if (shouldAbort(response)) return reject(response);
                client.query(`insert into contratos (
                    fk_idcliente, 
                    qtdmeses, 
                    vltotal, 
                    flsituacao, 
                    datacad, 
                    ultalt, 
                    fk_idcondpgto, 
                    datavalidade,
                    fk_idvenda
                ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [
                    contrato.cliente.id,
                    contrato.qtdmeses,
                    contrato.vltotal,
                    'V',
                    contrato.datacad,
                    contrato.ultalt,
                    contrato.condicaopagamento.id,
                    contrato.datavalidade,
                    venda.id
                ], (err, res) => {
                    if (shouldAbort(err)) return reject(err);
                    for (let i = 0; i < contrato.listacontasreceber.length; i++) {
                        let conta = contrato.listacontasreceber[i];
                        client.query(`insert into contasreceber values (
                            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
                        )`, [
                            conta.nrparcela,
                            venda.id,
                            contrato.cliente.id,
                            conta.percparcela,
                            conta.txdesc,
                            conta.txmulta,
                            conta.txjuros,
                            conta.dtvencimento,
                            conta.formapagamento.id,
                            conta.vltotal,
                            conta.observacao,
                            conta.flsituacao,
                            conta.florigem,
                            conta.datacad,
                            conta.ultalt
                        ], (err, res) => {
                            if (shouldAbort(err)) return reject(err);
                        })
                    }
                })
                client.query('COMMIT', err => {
                    if (err) {
                        console.error('Erro durante o commit da transação', err.stack);
                        done();
                        return reject(err);
                    }
                    done();
                })
                let responseContrato = await client.query('select * from contratos where id = (select max(id) from contratos)');
                let contratoCriado = responseContrato.rows[0];
                return resolve(contratoCriado);
            })
        })

    })
};

// @descricao ALTERA UM REGISTRO
// @route PUT /api/contratos/:id
async function alterar (id, pais) {
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
                client.query('update contratos set nmpais = $1, sigla = $2, ddi = $3, ultalt = $4 where id = $5 ', [pais.nmpais.toUpperCase(), pais.sigla.toUpperCase(), pais.ddi.toUpperCase(), pais.ultalt, id], (err, res) => {
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
// @route GET /api/contratos/:id
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
                client.query('delete from contratos where id = $1', [id], (err, res) => {
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



        // pool.query(`delete from contratos where id = ${id}`, (err, res) => {
        //     if (err) {
        //         return reject(err);
        //     }
        //     return resolve(res);
        // })
    })
};

async function validate(filter) {
    return new Promise( async (resolve, reject) => {
        pool.query('select * from contratos where nmpais like $1', [filter.toUpperCase()], (err, res) => {
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