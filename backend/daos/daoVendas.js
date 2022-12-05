const { pool } = require('../datamodule/index');
const daoClientes = require('./daoClientes');
const daoCondicoesPagamento = require('./daoCondicoesPagamento');
const daoFormasPagamento = require('./daoFormasPagamento');
const daoProdutos = require('./daoProdutos');

// @descricao BUSCA TODOS OS REGISTROS
// @route GET /api/vendas
async function getQtd(url) {
    return new Promise((resolve, reject) => {
        if (url.endsWith('=')) {
            pool.query('select * from vendas', (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res.rowCount);
            })
        } else {
            const filter = url.split('=')[3];
            pool.query( `
                select 
                    vendas.numnf,
                    vendas.serienf,
                    vendas.fk_idcliente,
                    vendas.observacao,
                    vendas.fk_idcondpgto,
                    vendas.vltotal,
                    vendas.dataemissao,
                    vendas.datacad,
                    vendas.ultalt
                from vendas inner join clientes on clientes.cpf like '%${filter.toUpperCase()}%'
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
            pool.query('select * from vendas', async (err, res) => {
                if (err) {
                    return reject(err);
                }
                if (res.rowCount != 0) {
                    const mListaVendas = [];
                    for (let i = 0; i < res.rows.length; i++) {
                        const mCliente = await daoClientes.buscarUm(res.rows[i].fk_idcliente);
                        const mCondicaoPagamento = await daoCondicoesPagamento.buscarUm(res.rows[i].fk_idcondpgto);
                        const mListaProdutosNF = await daoProdutos.buscarProdutosVendaComPg(
                            res.rows[i].numnf,
                            res.rows[i].serienf,
                            res.rows[i].fk_idcliente
                        );
                        pool.query(`
                            select * from contasreceber where
                                fk_numnf = $1 and
                                fk_serienf = $2 and
                                fk_idcliente = $3
                            order by nrparcela
                        `, [
                            res.rows[i].numnf,
                            res.rows[i].serienf,
                            res.rows[i].fk_idcliente                      
                        ], (err, res) => {
                            if (err) return reject(err);
                            var contasreceber = [];
                            for (let i = 0; i < res.rows.length; i++) {
                                const mFormaPagamento = daoFormasPagamento.buscarUm(res.rows[i].fk_idformapgto);
                                contasreceber.push({
                                    nrparcela: res.rows[i].nrparcela,
                                    percparcela: res.rows[i].percparcela,
                                    dtvencimento: res.rows[i].dtvencimento,
                                    vltotal: res.rows[i].vltotal,
                                    txdesc: res.rows[i].txdesc,
                                    txmulta: res.rows[i].txmulta,
                                    txjuros: res.rows[i].txjuros,
                                    observacao: res.rows[i].observacao,
                                    cliente: mCliente,
                                    formapagamento: mFormaPagamento,
                                    flcentrocusto: res.rows[i].flcentrocusto,
                                    flsituacao: res.rows[i].flsituacao,
                                    datacad: res.rows[i].datacad,
                                    ultalt: res.rows[i].ultalt
                                })
                            };
                            mListaVendas.push({
                                numnf: res.rows[i].numnf,
                                serienf: res.rows[i].serienf,
                                cliente: mCliente,
                                observacao: res.rows[i].observacao,
                                condicaopagamento: mCondicaoPagamento,
                                listaprodutos: mListaProdutosNF,
                                listacontasreceber: contasreceber,
                                vltotal: res.rows[i].vltotal,
                                dataemissao: res.rows[i].dataemissao,
                                datacad: res.rows[i].datacad,
                                ultalt: res.rows[i].ultalt,
                            });
                        })
                    }
                    return resolve(mListaVendas);
                }
                return resolve([]);
            })
        } else {
            const filter = url.split('=')[2];
        }
    })
};

async function buscarTodosComPg (url) {
    var limit = url.split('=')[2];
    var page = url.split('=')[1];
    limit = limit.replace(/[^0-9]/g, '');
    page = page.replace(/[^0-9]/g, '');
    return new Promise((resolve, reject) => {
        pool.query('select * from vendas limit $1 offset $2', [limit, (limit*page)-limit], async (err, res) => {

            if (err) {
                return reject(err);
            }
            if (res.rowCount != 0) {
                const mListaVendas = [];
                for (let i = 0; i < res.rows.length; i++) {
                    const mCliente = await daoClientes.buscarUm(res.rows[i].fk_idcliente);
                    const mCondicaoPagamento = await daoCondicoesPagamento.buscarUm(res.rows[i].fk_idcondpgto);
                    const mListaProdutosNF = await daoProdutos.buscarProdutosVendaComPg(
                        res.rows[i].numnf,
                        res.rows[i].serienf,
                        res.rows[i].fk_idcliente
                    );
                    pool.query(`
                        select * from contasreceber where
                            fk_numnf = $1 and
                            fk_serienf = $2 and
                            fk_idcliente = $3
                        order by nrparcela
                    `, [
                        res.rows[i].numnf,
                        res.rows[i].serienf,
                        res.rows[i].fk_idcliente                    
                    ], (err, conta) => {
                        if (err) return reject(err);
                        var contasreceber = [];
                        for (let i = 0; i < conta.rows.length; i++) {
                            const mFormaPagamento = await daoFormasPagamento.buscarUm(conta.rows[i].fk_idformapgto);
                            contasreceber.push({
                                nrparcela: res.rows[i].nrparcela,
                                percparcela: res.rows[i].percparcela,
                                dtvencimento: res.rows[i].dtvencimento,
                                vltotal: res.rows[i].vltotal,
                                txdesc: res.rows[i].txdesc,
                                txmulta: res.rows[i].txmulta,
                                txjuros: res.rows[i].txjuros,
                                observacao: res.rows[i].observacao,
                                cliente: mCliente,
                                formapagamento: mFormaPagamento,
                                flcentrocusto: res.rows[i].flcentrocusto,
                                flsituacao: res.rows[i].flsituacao,
                                datacad: res.rows[i].datacad,
                                ultalt: res.rows[i].ultalt
                            })
                        };
                        mListaVendas.push({
                            numnf: res.rows[i].numnf,
                            serienf: res.rows[i].serienf,
                            cliente: mCliente,
                            observacao: res.rows[i].observacao,
                            condicaopagamento: mCondicaoPagamento,
                            listaprodutos: mListaProdutosNF,
                            listacontasreceber: contasreceber,
                            vltotal: res.rows[i].vltotal,
                            dataemissao: res.rows[i].dataemissao,
                            datacad: res.rows[i].datacad,
                            ultalt: res.rows[i].ultalt,
                        });
                    })
                }
                return resolve(mListaVendas);
            }
            return resolve([]);
        })
    })
};

// @descricao BUSCA UM REGISTRO
// @route GET /api/vendas
async function buscarUm (url) {
    let numnf = url.split('=')[1];
    let serienf = url.split('=')[2];
    let idcliente = url.split('=')[3];
    numnf = numnf.replace(/[^0-9]/g, '');
    serienf = serienf.replace(/[^0-9]/g, '');
    idcliente = idcliente.replace(/[^0-9]/g, '');

    return new Promise((resolve, reject) => {
        pool.query(`
            select * from vendas where
                numnf = $1 and
                serienf = $2 and
                fk_idcliente = $3
        `, [numnf, serienf, idcliente], async (err, res) => {
            if (err) return reject(err)
            if (res.rowCount != 0) {
                const mListaContasReceber = [];
                const mCliente = await daoClientes.buscarUm(idcliente);
                const mCondicaoPagamento = await daoCondicoesPagamento.buscarUm(res.rows[0].fk_idcondpgto);
                const mListaProdutosNF = await daoProdutos.buscarProdutosVendaComPg(
                    numnf,
                    serienf,
                    idcliente
                );
                pool.query(`
                select * from contasreceber where
                    fk_numnf = $1 and
                    fk_serienf = $2 and
                    fk_idcliente = $3
                order by nrparcela                    
                `, [numnf, serienf, idcliente], async (err, resp) => {
                    if (err) return reject(err);
                    for (let i = 0; i < resp.rows.length; i++) {
                        let conta = resp.rows[i];
                        const mFormaPagamento = await daoFormasPagamento.buscarUm(conta.fk_idformapgto);
                        mListaContasReceber.push({
                            nrparcela: conta.nrparcela,
                            percparcela: conta.percparcela,
                            dtvencimento: conta.dtvencimento,
                            vltotal: conta.vltotal,
                            txdesc: conta.txdesc,
                            txmulta: conta.txmulta,
                            txjuros: conta.txjuros,
                            observacao: conta.observacao,
                            cliente: mCliente,
                            formapagamento: mFormaPagamento,
                            flcentrocusto: conta.flcentrocusto,
                            flsituacao: conta.flsituacao,
                            datacad: conta.datacad,
                            ultalt: conta.ultalt                           
                        })
                    }
                    const mCompra = {
                        numnf: numnf,
                        serienf: serienf,
                        modelonf: modelonf,
                        cliente: mCliente,
                        observacao: res.rows[0].observacao,
                        condicaopagamento: mCondicaoPagamento,
                        listaprodutos: mListaProdutosNF,
                        listacontasreceber: mListaContasReceber,
                        vltotal: res.rows[0].vltotal,
                        flsituacao: res.rows[0].flsituacao,
                        dataemissao: res.rows[0].dataemissao,
                        datacad: res.rows[0].datacad,
                        ultalt: res.rows[0].ultalt,                   
                    }
                    return resolve(mCompra);
                });
            }
            return null;
        });
    })
};

// @descricao SALVA UM REGISTRO
// @route POST /api/vendas
async function salvar (venda) {
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
                client.query('insert into vendas values ($1, $2, $3, $4, $5, $6, $7, $8)', [
                    venda.cliente.id,
                    venda.observacao,
                    venda.condicaopagamento.id,
                    venda.vltotal,
                    venda.flsituacao,
                    venda.dataemissao,
                    venda.datacad,
                    venda.ultalt,
                ], async (err, res) => {
                        if (shouldAbort(err)) return reject(err);
                        const response = await client.query('select * from vendas where numnf = $1 and serienf = $2 and modelonf = $3 and fk_idcliente = $4', [venda.numnf.toString(), venda.serienf.toString(), venda.modelonf.toString(), venda.cliente.id]);
                        for (let i = 0; i < venda.listaprodutos.length; i++) {
                            client.query('insert into produtos_venda values($1, $2, $3, $4, $5, $6, $7, $8)', [
                                response.rows[0].id,
                                venda.listaprodutos[i].id,
                                venda.listaprodutos[i].qtd,
                                venda.listaprodutos[i].vlvenda,
                            ], async (err, res) => {
                                if (shouldAbort(err)) return reject(err);
                            })
                        }
                        for (let i = 0; i < venda.listacontasreceber.length; i++) {
                            let conta = venda.listacontasreceber[i];
                            client.query('insert into contasreceber values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)', [
                                conta.nrparcela,
                                response.rows[0].id,
                                venda.cliente.id,
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
                            });
                        }

                        for (let i = 0; i < venda.listaprodutos.length; i++) {
                            var produto = venda.listaprodutos[i];
                            await daoProdutos.alterar(produto.id, produto);
                        }
                        client.query('COMMIT', err => {
                            if (err) {
                                console.error('Erro durante o commit da transação', err.stack);
                                done();
                                return reject(err);
                            }
                            done();
                        })
                        return resolve(response.rows[0]);
                })
            })
        })

    })
};

// @descricao ALTERA UM REGISTRO
// @route PUT /api/vendas/:id
async function alterar (venda) {
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
                client.query('update vendas set observacao = $1, flsituacao = $2, ultalt = $3 where id = $4', [
                    venda.observacao,
                    venda.flsituacao,
                    venda.ultalt,
                    venda.id
                ], (err, res) => {
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

async function receberConta(conta) {

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
                client.query(`
                    update contasreceber set flsituacao = $1 where
                        nrparcela = $2 and
                        fk_idvenda = $3
                `, [
                    'P',
                    conta.nrparcela,
                    conta.id
                ], (err, res) => {
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
}

// @descricao DELETA UM REGISTRO
// @route GET /api/vendas/:id
async function deletar (url) {
    let numnf = url.split('=')[1];
    let serienf = url.split('=')[2];
    let modelonf = url.split('=')[3];
    let idcliente = url.split('=')[4];
    numnf = numnf.replace(/[^0-9]/g, '');
    serienf = serienf.replace(/[^0-9]/g, '');
    modelonf = modelonf.replace(/[^0-9]/g, '');
    idcliente = idcliente.replace(/[^0-9]/g, '');

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
                client.query('delete from vendas where numnf = $1 and serienf = $2 and modelonf = $3 and fk_idcliente = $4', [numnf.toString(), serienf.toString(), modelonf.toString(), idcliente], (err, res) => {
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

async function validate(venda) {
    return new Promise( async (resolve, reject) => {
        pool.query('select * from vendas where numnf = $1 and serienf = $2 and modelonf = $3 and fk_idcliente = $4', [
            venda.numnf, 
            venda.serienf, 
            venda.modelonf,
            venda.idcliente
        ], (err, res) => {
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
    pagarConta: receberConta,
    deletar,
    validate
}