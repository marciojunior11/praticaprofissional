const { pool } = require('../datamodule/index');
const daoFornecedores = require('./daoFornecedores');
const daoCondicoesPagamento = require('./daoCondicoesPagamento');

// @descricao BUSCA TODOS OS REGISTROS
// @route GET /api/compras
async function getQtd(url) {
    return new Promise((resolve, reject) => {
        if (url.endsWith('=')) {
            pool.query('select * from compras', (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res.rowCount);
            })
        } else {
            const filter = url.split('=')[3];
            pool.query( `
                select 
                    compras.numnf,
                    compras.serienf,
                    compras.modelonf,
                    compras.fk_idfornecedor,
                    compras.datacad,
                    compras.ultalt,
                    compras.observacao,
                    compras.fk_idcondpgto,
                    compras.vltotal
                from compras inner join fornecedores on fornecedores.razsocial like '%${filter.toUpperCase()}%'
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
            pool.query('select * from compras order by datacad desc', async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaCompras = [];
                for (let i = 0; i < res.rows.length; i++) {
                    const mFornecedor = await daoFornecedores.buscarUm(res.rows[i].fk_idfornecedor);
                    const mCondicaoPagamento = await daoCondicoesPagamento.buscarUm(res.rows[i].fk_idcondpgto);
                    mListaCompras.push({
                        numnf: res.rows[i].numnf,
                        serienf: res.rows[i].serienf,
                        modelonf: res.rows[i].modelonf,
                        fornecedor: mFornecedor,
                        condicaoPagamento: mCondicaoPagamento,
                        observacao: res.rows[i].observacao,
                        vltotal: res.rows[i].vltotal,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt,
                        dataemissao: res.rows[i].dataemissao,
                        dataentrada: res.rows[i].dataentrada
                    });
                }
                return resolve(mListaCompras);
            })
        } else {
            const filter = url.split('=')[2];
            pool.query(`
                select 
                    compras.numnf,
                    compras.serienf,
                    compras.modelonf,
                    compras.fk_idfornecedor,
                    compras.datacad,
                    compras.ultalt,
                    compras.observacao,
                    compras.fk_idcondpgto,
                    compras.vltotal
                from compras inner join fornecedores on fornecedores.razsocial like '%${filter.toUpperCase()}%'
            `, async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaCompras = [];
                for (let i = 0; i < res.rows.length; i++) {
                    const mFornecedor = await daoFornecedores.buscarUm(res.rows[i].fk_idfornecedor);
                    const mCondicaoPagamento = await daoCondicoesPagamento.buscarUm(res.rows[i].fk_idcondpgto);
                    mListaCompras.push({
                        numnf: res.rows[i].numnf,
                        serienf: res.rows[i].serienf,
                        modelonf: res.rows[i].modelonf,
                        fornecedor: mFornecedor,
                        condicaoPagamento: mCondicaoPagamento,
                        observacao: res.rows[i].observacao,
                        vltotal: res.rows[i].vltotal,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt,
                        dataemissao: res.rows[i].dataemissao,
                        dataentrada: res.rows[i].dataentrada
                    });
                }
                return resolve(mListaCompras);
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
            pool.query(`select * from compras order by datacad desc limit ${limit} offset ${(limit*page)-limit}`, async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaCompras = [];
                for (let i = 0; i < res.rows.length; i++) {
                    const mFornecedor = await daoFornecedores.buscarUm(res.rows[i].fk_idfornecedor);
                    const mCondicaoPagamento = await daoCondicoesPagamento.buscarUm(res.rows[i].fk_idcondpgto);
                    mListaCompras.push({
                        numnf: res.rows[i].numnf,
                        serienf: res.rows[i].serienf,
                        modelonf: res.rows[i].modelonf,
                        fornecedor: mFornecedor,
                        condicaoPagamento: mCondicaoPagamento,
                        observacao: res.rows[i].observacao,
                        vltotal: res.rows[i].vltotal,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt,
                        dataemissao: res.rows[i].dataemissao,
                        dataentrada: res.rows[i].dataentrada
                    });
                }
                return resolve(mListaCompras);
            })
        } else {
            var filter = url.split('=')[3];
            pool.query(`
                select
                    compras.numnf,
                    compras.serienf,
                    compras.modelonf,
                    compras.fk_idfornecedor,
                    compras.datacad,
                    compras.ultalt,
                    compras.observacao,
                    compras.fk_idcondpgto,
                    compras.vltotal
                from compras inner join fornecedores on fornecedores.razsocial like '%${filter.toUpperCase()}%' limit ${limit} offset ${(limit*page)-limit}
            `, async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaCompras = [];
                for (let i = 0; i < res.rows.length; i++) {
                    const mFornecedor = await daoFornecedores.buscarUm(res.rows[i].fk_idfornecedor);
                    const mCondicaoPagamento = await daoCondicoesPagamento.buscarUm(res.rows[i].fk_idcondpgto);
                    mListaCompras.push({
                        numnf: res.rows[i].numnf,
                        serienf: res.rows[i].serienf,
                        modelonf: res.rows[i].modelonf,
                        fornecedor: mFornecedor,
                        condicaoPagamento: mCondicaoPagamento,
                        observacao: res.rows[i].observacao,
                        vltotal: res.rows[i].vltotal,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt,
                        dataemissao: res.rows[i].dataemissao,
                        dataentrada: res.rows[i].dataentrada
                    });
                }
                return resolve(mListaCompras);
            })
        }
    })
};

// @descricao BUSCA UM REGISTRO
// @route GET /api/compras
async function buscarUm (url) {
    let numnf = url.split('=')[1];
    let serienf = url.split('=')[2];
    let modelonf = url.split('=')[3];
    let idfornecedor = url.split('=')[4];
    numnf = numnf.replace(/[^0-9]/g, '');
    serienf = serienf.replace(/[^0-9]/g, '');
    modelonf = modelonf.replace(/[^0-9]/g, '');
    idfornecedor = idfornecedor.replace(/[^0-9]/g, '');

    return new Promise((resolve, reject) => {
        pool.query('select * from compras where numnf = $1 and serienf = $2 and modelonf = $3 and fk_idfornecedor = $4', [numnf.toString(), serienf.toString(), modelonf.toString(), idfornecedor], async (err, res) => {
            if (err) {
                return reject(err);
            }
            if (res.rowCount != 0) {
                let mFornecedor = await daoFornecedores.buscarUm(res.rows[0].fk_idfornecedor);
                let mCondicaoPagamento = await daoCondicoesPagamento.buscarUm(res.rows[0].fk_idcondpgto);
                const mCompra = {
                    numnf: res.rows[0].numnf,
                    serienf: res.rows[0].serienf,
                    modelonf: res.rows[0].modelonf,
                    fornecedor: mFornecedor,
                    condicaoPagamento: mCondicaoPagamento,
                    datacad: res.rows[0].datacad,
                    ultalt: res.rows[0].ultalt,
                    dataemissao: res.rows[0].dataemissao,
                    dataentrada: res.rows[0].dataentrada
                }
                return resolve(mCompra);
            }
            return resolve(null);
        })
    })
};

// @descricao SALVA UM REGISTRO
// @route POST /api/compras
async function salvar (compra) {
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
                client.query('insert into compras values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', [
                    compra.numnf,
                    compra.serienf,
                    compra.modelonf,
                    compra.fornecedor.id,
                    compra.datacad,
                    compra.ultalt,
                    compra.observacao,
                    compra.condicaopagamento.id,
                    compra.vltotal,
                    compra.dataemissao,
                    compra.dataentrada
                ], async (err, res) => {
                        if (shouldAbort(err)) return reject(err);
                        const response = await client.query('select * from compras where numnf = $1 and serienf = $2 and modelonf = $3 and fk_idfornecedor = $4', [compra.numnf.toString(), compra.serienf.toString(), compra.modelonf.toString(), compra.fornecedor.id]);
                        for (let i = 0; i < compra.listaprodutos.length; i++) {
                            client.query('insert into produtos_compra values($1, $2, $3, $4, $5, $6, $7, $8)', [
                                compra.numnf.toString(), 
                                compra.serienf.toString(), 
                                compra.modelonf.toString(),
                                compra.fornecedor.id,
                                compra.listaprodutos[i].id,
                                compra.listaprodutos[i].qtd,
                                compra.listaprodutos[i].vlcusto,
                                compra.listaprodutos[i].vlcompra
                            ], async (err, res) => {
                                if (shouldAbort(err)) return reject(err);
                            })
                        }
                        for (let i = 0; i < compra.condicaopagamento.listaparcelas.length; i++) {
                            var dtvencimento = new Date(compra.datacad);
                            dtvencimento.setDate(dtvencimento.getDate() + compra.condicaopagamento.listaparcelas[i].diasparcela);
                            client.query('insert into contaspagar values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)', [
                                compra.condicaopagamento.listaparcelas[i].nrparcela,
                                compra.numnf.toString(),
                                compra.serienf.toString(),
                                compra.modelonf.toString(),
                                compra.fornecedor.id,
                                compra.condicaopagamento.listaparcelas[i].percparcela,
                                compra.condicaopagamento.txdesc,
                                compra.condicaopagamento.txmulta,
                                compra.condicaopagamento.txjuros,
                                dtvencimento,
                                compra.condicaopagamento.listaparcelas[i].formapagamento.id,
                                compra.vltotal * compra.condicaopagamento.listaparcelas[i].percparcela,
                                compra.observacao,
                                compra.centrocusto.id,
                                compra.datacad,
                                compra.ultalt,
                                'A'
                            ], (err, res) => {
                                if (shouldAbort(err)) return reject(err);
                            });
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
// @route PUT /api/compras/:id
async function alterar (compra) {
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
                client.query('update compras set observacao = $1, ultalt = $2, flsituacao = $3 where numnf = $4, serienf = $5, modelonf = $6, fk_idfornecedor = $7', [
                    compra.observacao,
                    compra.ultalt,
                    compra.flsituacao,
                    compra.numnf,
                    compra.serienf,
                    compra.modelonf,
                    compra.fornecedor.id
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

// @descricao DELETA UM REGISTRO
// @route GET /api/compras/:id
async function deletar (url) {
    let numnf = url.split('=')[1];
    let serienf = url.split('=')[2];
    let modelonf = url.split('=')[3];
    let idfornecedor = url.split('=')[4];
    numnf = numnf.replace(/[^0-9]/g, '');
    serienf = serienf.replace(/[^0-9]/g, '');
    modelonf = modelonf.replace(/[^0-9]/g, '');
    idfornecedor = idfornecedor.replace(/[^0-9]/g, '');

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
                client.query('delete from compras where numnf = $1 and serienf = $2 and modelonf = $3 and fk_idfornecedor = $4', [numnf.toString(), serienf.toString(), modelonf.toString(), idfornecedor], (err, res) => {
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
        pool.query(`select * from compras where descricao like '${filter.toUpperCase()}'`, (err, res) => {
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