const { pool } = require('../datamodule/index');
const daoFornecedores = require('./daoFornecedores');
const daoCondicoesPagamento = require('./daoCondicoesPagamento');
const daoFormasPagamento = require('./daoFormasPagamento');
const daoProdutos = require('./daoProdutos');

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
            pool.query('select * from compras', async (err, res) => {
                if (err) {
                    return reject(err);
                }
                if (res.rowCount != 0) {
                    const mListaCompras = [];
                    for (let i = 0; i < res.rows.length; i++) {
                        const mFornecedor = await daoFornecedores.buscarUm(res.rows[i].fk_idfornecedor);
                        const mCondicaoPagamento = await daoCondicoesPagamento.buscarUm(res.rows[i].fk_idcondpgto);
                        const mListaProdutosNF = await daoProdutos.buscarProdutosNfComPg(
                            res.rows[i].numnf,
                            res.rows[i].serienf,
                            res.rows[i].modelonf,
                            res.rows[i].fk_idfornecedor
                        );
                        pool.query(`
                            select * from contaspagar where
                                fk_numnf = $1 and
                                fk_serienf = $2 and
                                fk_modelonf = $3 and
                                fk_idfornecedor = $4
                            order by nrparcela
                        `, [
                            res.rows[i].numnf,
                            res.rows[i].serienf,
                            res.rows[i].modelonf,
                            res.rows[i].fk_idfornecedor                      
                        ], (err, res) => {
                            if (err) return reject(err);
                            var contaspagar = [];
                            for (let i = 0; i < res.rows.length; i++) {
                                const mFormaPagamento = daoFormasPagamento.buscarUm(res.rows[i].fk_idformapgto);
                                contaspagar.push({
                                    nrparcela: res.rows[i].nrparcela,
                                    percparcela: res.rows[i].percparcela,
                                    dtvencimento: res.rows[i].dtvencimento,
                                    vltotal: res.rows[i].vltotal,
                                    txdesc: res.rows[i].txdesc,
                                    txmulta: res.rows[i].txmulta,
                                    txjuros: res.rows[i].txjuros,
                                    observacao: res.rows[i].observacao,
                                    fornecedor: mFornecedor,
                                    formapagamento: mFormaPagamento,
                                    flcentrocusto: res.rows[i].flcentrocusto,
                                    datacad: res.rows[i].datacad,
                                    ultalt: res.rows[i].ultalt
                                })
                            };
                            mListaCompras.push({
                                numnf: res.rows[i].numnf,
                                serienf: res.rows[i].serienf,
                                modelonf: res.rows[i].modelonf,
                                fornecedor: mFornecedor,
                                observacao: res.rows[i].observacao,
                                condicaoPagamento: mCondicaoPagamento,
                                listaprodutos: mListaProdutosNF,
                                listacontaspagar: contaspagar,
                                vltotal: res.rows[i].vltotal,
                                dataemissao: res.rows[i].dataemissao,
                                dataentrada: res.rows[i].dataentrada,
                                datacad: res.rows[i].datacad,
                                ultalt: res.rows[i].ultalt,
                            });
                        })
                    }
                    return resolve(mListaCompras);
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
        pool.query('select * from compras limit $1 offset $2', [limit, (limit*page)-limit], async (err, res) => {
            if (err) {
                return reject(err);
            }
            if (res.rowCount != 0) {
                const mListaCompras = [];
                for (let i = 0; i < res.rows.length; i++) {
                    const mFornecedor = await daoFornecedores.buscarUm(res.rows[i].fk_idfornecedor);
                    const mCondicaoPagamento = await daoCondicoesPagamento.buscarUm(res.rows[i].fk_idcondpgto);
                    const mListaProdutosNF = await daoProdutos.buscarProdutosNfComPg(
                        res.rows[i].numnf,
                        res.rows[i].serienf,
                        res.rows[i].modelonf,
                        res.rows[i].fk_idfornecedor
                    );
                    pool.query(`
                        select * from contaspagar where
                            fk_numnf = $1 and
                            fk_serienf = $2 and
                            fk_modelonf = $3 and
                            fk_idfornecedor = $4
                        order by nrparcela
                    `, [
                        res.rows[i].numnf,
                        res.rows[i].serienf,
                        res.rows[i].modelonf,
                        res.rows[i].fk_idfornecedor                      
                    ], async (err, conta) => {
                        if (err) return reject(err);
                        var contaspagar = [];
                        for (let i = 0; i < conta.rows.length; i++) {
                            const mFormaPagamento = daoFormasPagamento.buscarUm(conta.rows[i].fk_idformapgto);
                            contaspagar.push({
                                nrparcela: conta.rows[i].nrparcela,
                                percparcela: conta.rows[i].percparcela,
                                dtvencimento: conta.rows[i].dtvencimento,
                                vltotal: conta.rows[i].vltotal,
                                txdesc: conta.rows[i].txdesc,
                                txmulta: conta.rows[i].txmulta,
                                txjuros: conta.rows[i].txjuros,
                                observacao: conta.rows[i].observacao,
                                fornecedor: mFornecedor,
                                formapagamento: mFormaPagamento,
                                flcentrocusto: conta.rows[i].flcentrocusto,
                                flsituacao: conta.rows[i].flsituacao,
                                datacad: conta.rows[i].datacad,
                                ultalt: conta.rows[i].ultalt
                            })
                        };
                        mListaCompras.push({
                            numnf: res.rows[i].numnf,
                            serienf: res.rows[i].serienf,
                            modelonf: res.rows[i].modelonf,
                            fornecedor: mFornecedor,
                            observacao: res.rows[i].observacao,
                            condicaoPagamento: mCondicaoPagamento,
                            listaprodutos: mListaProdutosNF,
                            listacontaspagar: contaspagar,
                            vlfrete: res.rows[i].vlfrete,
                            vlpedagio: res.rows[i].vlpedagio,
                            vloutrasdespesas: res.rows[i].vloutrasdespesas,
                            vltotal: res.rows[i].vltotal,
                            flsituacao: res.rows[i].flsituacao,
                            dataemissao: res.rows[i].dataemissao,
                            dataentrada: res.rows[i].dataentrada,
                            datacad: res.rows[i].datacad,
                            ultalt: res.rows[i].ultalt,
                            flmovimentacao: res.rows[i].flmovimentacao
                        });
                    })
                }
                return resolve(mListaCompras);
            }
            return resolve([]);
        })
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
        pool.query(`
            select * from compras where
                numnf = $1 and
                serienf = $2 and
                modelonf = $3 and
                fk_idfornecedor = $4
        `, [numnf, serienf, modelonf, idfornecedor], async (err, res) => {
            if (err) return reject(err)
            if (res.rowCount != 0) {
                const mListaContasPagar = [];
                const mFornecedor = await daoFornecedores.buscarUm(idfornecedor);
                const mCondicaoPagamento = await daoCondicoesPagamento.buscarUm(res.rows[0].fk_idcondpgto);
                const mListaProdutosNF = await daoProdutos.buscarProdutosNfComPg(
                    numnf,
                    serienf,
                    modelonf,
                    idfornecedor
                );
                pool.query(`
                select * from contaspagar where
                    fk_numnf = $1 and
                    fk_serienf = $2 and
                    fk_modelonf = $3 and
                    fk_idfornecedor = $4
                order by nrparcela                    
                `, [numnf, serienf, modelonf, idfornecedor], async (err, resp) => {
                    if (err) return reject(err);
                    for (let i = 0; i < resp.rows.length; i++) {
                        let conta = resp.rows[i];
                        const mFormaPagamento = await daoFormasPagamento.buscarUm(conta.fk_idformapgto);
                        mListaContasPagar.push({
                            nrparcela: conta.nrparcela,
                            percparcela: conta.percparcela,
                            dtvencimento: conta.dtvencimento,
                            vltotal: conta.vltotal,
                            txdesc: conta.txdesc,
                            txmulta: conta.txmulta,
                            txjuros: conta.txjuros,
                            observacao: conta.observacao,
                            fornecedor: mFornecedor,
                            formapagamento: mFormaPagamento,
                            flcentrocusto: conta.flcentrocusto,
                            flsituacao: conta.flsituacao,
                            datacad: conta.datacad,
                            ultalt: conta.ultalt                           
                        })
                    }
                    console.log(mListaContasPagar);
                    const mCompra = {
                        numnf: numnf,
                        serienf: serienf,
                        modelonf: modelonf,
                        fornecedor: mFornecedor,
                        observacao: res.rows[0].observacao,
                        condicaopagamento: mCondicaoPagamento,
                        listaprodutos: mListaProdutosNF,
                        listacontaspagar: mListaContasPagar,
                        vlfrete: res.rows[0].vlfrete,
                        vlpedagio: res.rows[0].vlpedagio,
                        vloutrasdespesas: res.rows[0].vloutrasdespesas,
                        vltotal: res.rows[0].vltotal,
                        flsituacao: res.rows[0].flsituacao,
                        dataemissao: res.rows[0].dataemissao,
                        dataentrada: res.rows[0].dataentrada,
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
                client.query('insert into compras values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)', [
                    compra.numnf,
                    compra.serienf,
                    compra.modelonf,
                    compra.fornecedor.id,
                    compra.datacad,
                    compra.ultalt,
                    compra.observacao,
                    compra.vltotal,
                    compra.dataemissao,
                    compra.dataentrada,
                    compra.flsituacao,
                    compra.vlfrete,
                    compra.vlpedagio,
                    compra.vloutrasdespesas,
                    compra.condicaopagamento.id,
                    'N'
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
                                console.log('AQUI DAO 1');
                                if (shouldAbort(err)) return reject(err);
                            })
                        }
                        for (let i = 0; i < compra.listacontaspagar.length; i++) {
                            let conta = compra.listacontaspagar[i];
                            client.query('insert into contaspagar values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)', [
                                conta.nrparcela,
                                compra.numnf,
                                compra.serienf,
                                compra.modelonf,
                                compra.fornecedor.id,
                                conta.percparcela,
                                conta.txdesc,
                                conta.txmulta,
                                conta.txjuros,
                                conta.dtvencimento,
                                conta.formapagamento.id,
                                conta.vltotal,
                                conta.observacao,
                                conta.datacad,
                                conta.ultalt,
                                conta.flsituacao,
                                conta.flcentrocusto
                            ], (err, res) => {
                                if (shouldAbort(err)) return reject(err);
                                console.log('AQUI DAO 2');
                            });
                        }

                        //const produtosFornecedor = await client.query('select * from fornecedores_produtos where fk_idfornecedor = $1');
                        

                        for (let i = 0; i < compra.listaprodutos.length; i++) {
                            var produto = compra.listaprodutos[i];
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

async function pagarConta(conta) {

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
                    update contaspagar set flsituacao = $1, ultalt = $2 where
                        nrparcela = $3 and
                        fk_numnf = $4 and
                        fk_serienf = $5 and
                        fk_modelonf = $6 and
                        fk_idfornecedor = $7
                `, [
                    'P',
                    new Date(),
                    conta.nrparcela,
                    conta.numnf,
                    conta.serienf,
                    conta.modelonf,
                    conta.fornecedor.id
                ], (err, res) => {
                    if (shouldAbort(err)) return reject(err);
                    client.query('insert into movimentacoes (tipo, dtmovimentacao, valor, idpessoa) values ($1, $2, $3, $4)', [
                        'E',
                        new Date(),
                        conta.vltotal,
                        conta.fornecedor.id
                    ], (err, res) => {
                        if (shouldAbort(err)) return reject(err);
                        client.query('update compras set flmovimentacao = $1 where numnf = $2 and serienf = $3 and modelonf = $4 and fk_idfornecedor = $5', [
                            'S',
                            conta.numnf,
                            conta.serienf,
                            conta.modelonf,
                            conta.fornecedor.id
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
        })
    })
}

async function cancelarCompra(compra) {
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
                    delete from contaspagar where
                        fk_numnf = $1 and
                        fk_serienf = $2 and
                        fk_modelonf = $3 and 
                        fk_idfornecedor = $4
                `, [
                    compra.numnf,
                    compra.serienf,
                    compra.modelonf,
                    compra.fornecedor.id
                ], (err, res) => {
                    if (shouldAbort(err)) return reject(err);
                    client.query(`
                        delete from produtos_compra where
                            fk_numnf = $1 and
                            fk_serienf = $2 and
                            fk_modelonf = $3 and 
                            fk_idfornecedor = $4
                    `, [
                        compra.numnf,
                        compra.serienf,
                        compra.modelonf,
                        compra.fornecedor.id
                    ], (err, res) => {
                        if (shouldAbort(err)) return reject(err);
                        client.query(`
                            delete from compras where
                                numnf = $1 and
                                serienf = $2 and
                                modelonf = $3 and 
                                idfornecedor = $4
                        `, [
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
        })
    })
}

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

async function validate(compra) {
    return new Promise( async (resolve, reject) => {
        pool.query('select * from compras where numnf = $1 and serienf = $2 and modelonf = $3 and fk_idfornecedor = $4', [
            compra.numnf, 
            compra.serienf, 
            compra.modelonf,
            compra.idfornecedor
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
    pagarConta,
    cancelarCompra,
    deletar,
    validate
}