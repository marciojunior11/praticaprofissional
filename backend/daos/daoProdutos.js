const { pool } = require('../datamodule/index');
const daoFornecedores = require('./daoFornecedores');
const daoTiposProduto = require('./daoTiposProduto');

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
                for (let i = 0; i < res.rowCount ; i++) {
                    let mFornecedor = await daoFornecedores.buscarUm(res.rows[i].fk_idfornecedor);
                    let mTipoProduto = await daoTiposProduto.buscarUm(res.rows[i].fk_idtipoproduto);
                    mListaProdutos.push({
                        id: res.rows[i].id,
                        descricao: res.rows[i].descricao,
                        valorCompra: res.rows[i].valorcompra,
                        valorVenda: res.rows[i].valorvenda,
                        tipoProduto: mTipoProduto,
                        fornecedor: mFornecedor
                    })
                }
                return resolve(mListaProdutos);
            })
        } else {
            const filter = url.split('=')[2]
            console.log(filter);
            pool.query(`select * from produtos where fornecedor like '${filter.toUpperCase()}'`, async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaProdutos = [];
                for (let i = 0; i < res.rowCount ; i++) {
                    let mFornecedor = await daoFornecedores.buscarUm(res.rows[i].fk_idfornecedor);
                    let mTipoProduto = await daoTiposProduto.buscarUm(res.rows[i].fk_idtipoproduto);
                    mListaProdutos.push({
                        id: res.rows[i].id,
                        descricao: res.rows[i].descricao,
                        valorCompra: res.rows[i].valorcompra,
                        valorVenda: res.rows[i].valorvenda,
                        tipoProduto: mTipoProduto,
                        fornecedor: mFornecedor
                    })
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
    return new Promise( async (resolve, reject) => {
        if (url.endsWith('=')) {
            pool.query(`select * from produtos order by id asc limit ${limit} offset ${(limit*page)-limit}`, async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaProdutos = [];
                for (let i = 0; i < res.rowCount ; i++) {
                    let mFornecedor = await daoFornecedores.buscarUm(res.rows[i].fk_idfornecedor);
                    let mTipoProduto = await daoTiposProduto.buscarUm(res.rows[i].fk_idtipoproduto);
                    mListaProdutos.push({
                        id: res.rows[i].id,
                        descricao: res.rows[i].descricao,
                        valorCompra: res.rows[i].valorcompra,
                        valorVenda: res.rows[i].valorvenda,
                        tipoProduto: mTipoProduto,
                        fornecedor: mFornecedor
                    })
                }
                return resolve(mListaProdutos);
            })
        } else {
            var filter = url.split('=')[3];
            console.log(filter);
            pool.query('select * from produtos where descricao like ' + "'%" + `${filter.toUpperCase()}` + "%' " + `limit ${limit} offset ${(limit*page)-limit}`, async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaProdutos = [];
                for (let i = 0; i < res.rowCount ; i++) {
                    let mFornecedor = await daoFornecedores.buscarUm(res.rows[i].fk_idfornecedor);
                    let mTipoProduto = await daoTiposProduto.buscarUm(res.rows[i].fk_idtipoproduto);
                    mListaProdutos.push({
                        id: res.rows[i].id,
                        descricao: res.rows[i].descricao,
                        valorCompra: res.rows[i].valorcompra,
                        valorVenda: res.rows[i].valorvenda,
                        tipoProduto: mTipoProduto,
                        fornecedor: mFornecedor
                    })
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
                const mFornecedor = await daoFornecedores.buscarUm(res.rows[i].fk_idfornecedor);
                const mTipoProduto = await daoTiposProduto.buscarUm(res.rows[i].fk_idtipoproduto);
                const mProduto = {
                    id: res.rows[i].id,
                    descricao: res.rows[i].descricao,
                    valorCompra: res.rows[i].valorcompra,
                    valorVenda: res.rows[i].valorvenda,
                    tipoProduto: mTipoProduto,
                    fornecedor: mFornecedor
                }
                return resolve(mProduto);
            }
            return resolve(null);
        })
    })
};

// @descricao SALVA UM REGISTRO
// @route POST /api/produtos
async function salvar (produto) {
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
            client.query('insert into produtos (descricao, valorcompra, valorvenda, fk_idtipoproduto, fk_idfornecedor) values($1, $2, $3, $4, $5)', [produto.descricao, produto.valorCompra, produto.valorVenda, produto.tipoProduto.id, produto.Fornecedor.id], async (err, res) => {
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
async function alterar (id, produto) {
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
                client.query('update produtos set id = $1, descricao = $2, valorcompra = $3, valorvenda = $4, fk_idtipoproduto = $5, fk_idfornecedor = $6 where id = $7 ', [produto.id, produto.descricao, produto.valorCompra, produto.valorVenda, produto.tipoProduto.id, produto.fornecedor.id, id], (err, res) => {
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

async function validate(produto) {
    return new Promise( async (resolve, reject) => {
        pool.query(`select * from produtos where descricao like '${produto.descricao}'`, (err, res) => {
            if (err) {
                return reject(err);
            }
            console.log(res.rowCount);
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