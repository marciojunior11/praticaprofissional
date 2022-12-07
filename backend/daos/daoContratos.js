const { pool } = require('../datamodule/index');
const daoVendas = require('./daoVendas');
const daoClientes = require('./daoClientes');
const daoCondicoesPagamento = require('./daoCondicoesPagamento');

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
            pool.query('select * from contratos order by id asc', async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaContratos = [];
                for (let i = 0; i < res.rows.length; i++) {
                    const mCliente = await daoClientes.buscarUm(res.rows[i].fk_idcliente);
                    const mCondicaoPagamento = await daoCondicoesPagamento.buscarUm(res.rows[i].fk_idcondpgto);
                    const contrato = res.rows[i];
                    mListaContratos.push({
                        id: contrato.id,
                        cliente: mCliente,
                        vltotal: contrato.vltotal,
                        flsituacao: contrato.flsituacao,
                        condicaopagamento: mCondicaoPagamento,
                        datavalidade: contrato.datavalidade
                    })
                }
                return resolve(mListaContratos);
            })
        } else {
            const filter = url.split('=')[2];
            pool.query(`
                select * from contratos as c inner join clientes as cl
                    on c.fk_idcliente = cl.fk_idcliente 
                where cl.nmcliente like '%${filter.toUpperCase()}%'
            `, async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaContratos = [];
                for (let i = 0; i < res.rows.length; i++) {
                    const mCliente = await daoClientes.buscarUm(res.rows[i].fk_idcliente);
                    const mCondicaoPagamento = await daoCondicoesPagamento.buscarUm(res.rows[i].fk_idcondpgto);
                    const contrato = res.rows[i];
                    mListaContratos.push({
                        id: contrato.id,
                        cliente: mCliente,
                        vltotal: contrato.vltotal,
                        flsituacao: contrato.flsituacao,
                        condicaopagamento: mCondicaoPagamento,
                        datavalidade: contrato.datavalidade
                    })
                }
                return resolve(mListaContratos);
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
            pool.query('select * from contratos order by id asc limit $1 offset $2', [limit, ((limit*page)-limit)], async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaContratos = [];
                for (let i = 0; i < res.rows.length; i++) {
                    const mCliente = await daoClientes.buscarUm(res.rows[i].fk_idcliente);
                    const mCondicaoPagamento = await daoCondicoesPagamento.buscarUm(res.rows[i].fk_idcondpgto);
                    const contrato = res.rows[i];
                    mListaContratos.push({
                        id: contrato.id,
                        cliente: mCliente,
                        vltotal: contrato.vltotal,
                        flsituacao: contrato.flsituacao,
                        condicaopagamento: mCondicaoPagamento,
                        datavalidade: contrato.datavalidade
                    })
                }
                return resolve(mListaContratos);
            })
        } else {
            var filter = url.split('=')[3];
            pool.query(`
                select * from contratos as c inner join clientes as cl
                    on c.fk_idcliente = cl.fk_idclient
                where cl.nmcliente like ${filter.toUpperCase()} limit ${limit} offset ${(limit * page) - limit}
            `, async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaContratos = [];
                for (let i = 0; i < res.rows.length; i++) {
                    const contrato = res.rows[i];
                    const mCliente = await daoClientes.buscarUm(contrato.fk_idcliente);
                    const mCondicaoPagamento = await daoCondicoesPagamento.buscarUm(contrato.fk_idcondpgto);
                    mListaContratos.push({
                        id: contrato.id,
                        cliente: mCliente,
                        vltotal: contrato.vltotal,
                        flsituacao: contrato.flsituacao,
                        condicaopagamento: mCondicaoPagamento,
                        datavalidade: contrato.datavalidade
                    })
                }
                return resolve(mListaContratos);
            })
        }
    })
};

// @descricao BUSCA UM REGISTRO
// @route GET /api/contratos
async function buscarUm (id) {
    return new Promise((resolve, reject) => {
        pool.query('select * from contratos where id = $1', [id], async (err, res) => {
            if (err) {
                return reject(err);
            }
            if (res.rowCount != 0) {
                const contrato = res.rows[i];
                const mCliente = await daoClientes.buscarUm(contrato.fk_idcliente);
                const mCondicaoPagamento = await daoCondicoesPagamento.buscarUm(contrato.fk_idcondpgto);
                const mContrato = {
                    id: contrato.id,
                    cliente: mCliente,
                    vltotal: contrato.vltotal,
                    flsituacao: contrato.flsituacao,
                    condicaopagamento: mCondicaoPagamento,
                    datavalidade: contrato.datavalidade
                }
                return resolve(mContrato);
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

            client.query('BEGIN', (err) => {
                if (shouldAbort(err)) return reject(err);
                let venda = contrato.venda;
                client.query(`
                    insert into vendas (
                        fk_idcliente, observacao, fk_idcondpgto, vltotal, flsituacao, dataemissao, datacad, ultalt, flmovimentacao
                    ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                `, [
                    venda.cliente.id,
                    venda.observacao,
                    venda.condicaopagamento.id,
                    venda.vltotal,
                    venda.flsituacao,
                    venda.dataemissao,
                    venda.datacad,
                    venda.ultalt,
                    'N'
                ], async (err, res) => {
                    if (shouldAbort(err)) return reject(err);
                    let responseVenda = await client.query('select * from vendas where id = (select max(id) from vendas)');
                    let venda = responseVenda.rows[0];
                    let contasreceber = contrato.listacontasreceber;
                    for (let i = 0; i < contasreceber.length; i++) {
                        let conta = contasreceber[i];
                        client.query(`
                            insert into contasreceber values (
                                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
                            )
                        `, [
                            conta.nrparcela,
                            venda.id,
                            conta.cliente.id,
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
                            client.query(`
                                insert into contratos (
                                    fk_idcliente, qtdmeses, vltotal, flsituacao, datacad, ultalt, fk_idcondpgto, datavalidade, fk_idvenda
                                ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                            `, [
                                contrato.cliente.id,
                                contrato.qtdmeses,
                                contrato.vltotal,
                                contrato.flsituacao,
                                contrato.datacad,
                                contrato.ultalt,
                                contrato.condicaopagamento.id,
                                contrato.datavalidade,
                                venda.id
                            ], async (err, res) => {
                                if (shouldAbort(err)) return reject(err);
                                var responseContrato = await client.query('select * from contratos where id = (select max(id) from contratos)');
                                const contratoCriado = responseContrato.rows[0];
                                client.query('COMMIT', err => {
                                    if (err) {
                                        console.error('Erro durante o commit da transação', err.stack);
                                        done();
                                        return reject(err);
                                    }
                                    done();
                                    return resolve(contratoCriado);
                                })
                            })
                        })
                    }
                })
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

async function validate(id) {
    return new Promise( async (resolve, reject) => {
        pool.query('select * from contratos where fk_idcliente = $1 and flsituacao = $2', [id, 'V'], (err, res) => {
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