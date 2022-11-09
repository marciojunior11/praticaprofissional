const { pool } = require('../datamodule/index');
const daoVariacoes = require('./daoVariacoes');
const daoCaracteristicas = require('./daoCaracteristicas');
const daoFornecedores = require('./daoFornecedores');

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
                    var listavariacoes = [];
                    let produtos_variacoes = await pool.query(`
                    select * from produtos_variacoes 
                    inner join variacoes on produtos_variacoes.fk_idvariacao = variacoes.id
                    inner join produtos on produtos_variacoes.fk_idproduto = produtos.id
                    where produtos_variacoes.fk_idproduto = $1
                    `, [res.rows[i].id]);
                    for (let j = 0; j < produtos_variacoes.length; j++) {
                        let variacao = await pool.query('select * from variacoes where id = $1', [produtos_variacoes[j].fk_idvariacao]);
                        listavariacoes.push(variacao);
                    }
                    let mFornecedor = await daoFornecedores.buscarUm(res.rows[i].fk_idfornecedor);
                    mListaProdutos.push({
                        id: res.rows[i].id,
                        gtin: res.rows[i].gtin,
                        descricao: res.rows[i].descricao,
                        apelido: res.rows[i].apelido,
                        marca: res.rows[i].marca,
                        undmedida: res.rows[i].undmedida,
                        unidade: res.rows[i].unidade,
                        vlcusto: res.rows[i].vlcusto,
                        vlcompra: res.rows[i].vlcompra,
                        vlvenda: res.rows[i].vlvenda,
                        lucro: res.rows[i].lucro,
                        pesoliq: res.rows[i].pesoliq,
                        pesobruto: res.rows[i].pesobruto,
                        ncm: res.rows[i].ncm,
                        cfop: res.rows[i].cfop,
                        percicmssaida: res.rows[i].percicmssaida,
                        percipi: res.rows[i].percipi,
                        cargatribut: res.rows[i].cargatribut,
                        vlfrete: res.rows[i].vlfrete,
                        qtdatual: res.rows[i].qtdatual,
                        qtdideal: res.rows[i].qtdideal,
                        qtdmin: res.rows[i].qtdmin,
                        fornecedor: mFornecedor,
                        listavariacoes: listavariacoes,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt,
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
                    var listavariacoes = [];
                    let produtos_variacoes = await pool.query(`
                    select * from produtos_variacoes 
                    inner join variacoes on produtos_variacoes.fk_idvariacao = variacoes.id
                    inner join produtos on produtos_variacoes.fk_idproduto = produtos.id
                    where produtos_variacoes.fk_idproduto = $1
                    `, [res.rows[i].id]);
                    for (let j = 0; j < produtos_variacoes.length; j++) {
                        let variacao = await pool.query('select * from variacoes where id = $1', [produtos_variacoes[j].fk_idvariacao]);
                        listavariacoes.push(variacao);
                    }
                    let mFornecedor = await daoFornecedores.buscarUm(res.rows[i].fk_idfornecedor);
                    mListaProdutos.push({
                        id: res.rows[i].id,
                        gtin: res.rows[i].gtin,
                        descricao: res.rows[i].descricao,
                        apelido: res.rows[i].apelido,
                        marca: res.rows[i].marca,
                        undmedida: res.rows[i].undmedida,
                        unidade: res.rows[i].unidade,
                        vlcusto: res.rows[i].vlcusto,
                        vlcompra: res.rows[i].vlcompra,
                        vlvenda: res.rows[i].vlvenda,
                        lucro: res.rows[i].lucro,
                        pesoliq: res.rows[i].pesoliq,
                        pesobruto: res.rows[i].pesobruto,
                        ncm: res.rows[i].ncm,
                        cfop: res.rows[i].cfop,
                        percicmssaida: res.rows[i].percicmssaida,
                        percipi: res.rows[i].percipi,
                        cargatribut: res.rows[i].cargatribut,
                        vlfrete: res.rows[i].vlfrete,
                        qtdatual: res.rows[i].qtdatual,
                        qtdideal: res.rows[i].qtdideal,
                        qtdmin: res.rows[i].qtdmin,
                        listavariacoes: listavariacoes,
                        fornecedor: mFornecedor,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt,
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
                    var listavariacoes = [];
                    let produtos_variacoes = await pool.query(`
                    select * from produtos_variacoes 
                    inner join variacoes on produtos_variacoes.fk_idvariacao = variacoes.id
                    inner join produtos on produtos_variacoes.fk_idproduto = produtos.id
                    where produtos_variacoes.fk_idproduto = $1
                    `, [res.rows[i].id]);
                    for (let j = 0; j < produtos_variacoes.length; j++) {
                        let variacao = await pool.query('select * from variacoes where id = $1', [produtos_variacoes[j].fk_idvariacao]);
                        listavariacoes.push(variacao);
                    }
                    let mFornecedor = await daoFornecedores.buscarUm(res.rows[i].fk_idfornecedor);
                    mListaProdutos.push({
                        id: res.rows[i].id,
                        gtin: res.rows[i].gtin,
                        descricao: res.rows[i].descricao,
                        apelido: res.rows[i].apelido,
                        marca: res.rows[i].marca,
                        undmedida: res.rows[i].undmedida,
                        unidade: res.rows[i].unidade,
                        vlcusto: res.rows[i].vlcusto,
                        vlcompra: res.rows[i].vlcompra,
                        vlvenda: res.rows[i].vlvenda,
                        lucro: res.rows[i].lucro,
                        pesoliq: res.rows[i].pesoliq,
                        pesobruto: res.rows[i].pesobruto,
                        ncm: res.rows[i].ncm,
                        cfop: res.rows[i].cfop,
                        percicmssaida: res.rows[i].percicmssaida,
                        percipi: res.rows[i].percipi,
                        cargatribut: res.rows[i].cargatribut,
                        vlfrete: res.rows[i].vlfrete,
                        qtdatual: res.rows[i].qtdatual,
                        qtdideal: res.rows[i].qtdideal,
                        qtdmin: res.rows[i].qtdmin,
                        fornecedor: mFornecedor,
                        listavariacoes: listavariacoes,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt,
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
                    var listavariacoes = [];
                    let produtos_variacoes = await pool.query(`
                    select * from produtos_variacoes 
                    inner join variacoes on produtos_variacoes.fk_idvariacao = variacoes.id
                    inner join produtos on produtos_variacoes.fk_idproduto = produtos.id
                    where produtos_variacoes.fk_idproduto = $1
                    `, [res.rows[i].id]);
                    for (let j = 0; j < produtos_variacoes.length; j++) {
                        let variacao = await pool.query('select * from variacoes where id = $1', [produtos_variacoes[j].fk_idvariacao]);
                        listavariacoes.push(variacao);
                    }
                    let mFornecedor = await daoFornecedores.buscarUm(res.rows[i].fk_idfornecedor);
                    mListaProdutos.push({
                        id: res.rows[i].id,
                        gtin: res.rows[i].gtin,
                        descricao: res.rows[i].descricao,
                        apelido: res.rows[i].apelido,
                        marca: res.rows[i].marca,
                        undmedida: res.rows[i].undmedida,
                        unidade: res.rows[i].unidade,
                        vlcusto: res.rows[i].vlcusto,
                        vlcompra: res.rows[i].vlcompra,
                        vlvenda: res.rows[i].vlvenda,
                        lucro: res.rows[i].lucro,
                        pesoliq: res.rows[i].pesoliq,
                        pesobruto: res.rows[i].pesobruto,
                        ncm: res.rows[i].ncm,
                        cfop: res.rows[i].cfop,
                        percicmssaida: res.rows[i].percicmssaida,
                        percipi: res.rows[i].percipi,
                        cargatribut: res.rows[i].cargatribut,
                        vlfrete: res.rows[i].vlfrete,
                        qtdatual: res.rows[i].qtdatual,
                        qtdideal: res.rows[i].qtdideal,
                        qtdmin: res.rows[i].qtdmin,
                        fornecedor: mFornecedor,
                        listavariacoes: listavariacoes,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt,
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
                var listavariacoes = [];
                let produtos_variacoes = await pool.query(`
                select fk_idvariacao from produtos_variacoes 
                inner join variacoes on produtos_variacoes.fk_idvariacao = variacoes.id
                inner join produtos on produtos_variacoes.fk_idproduto = produtos.id
                where produtos_variacoes.fk_idproduto = ${id}
                `);
                //console.log('listavariacoes', produtos_variacoes);
                for (let i = 0; i < produtos_variacoes.rowCount; i++) {
                    let variacao = await daoVariacoes.buscarUm(produtos_variacoes.rows[i].fk_idvariacao);
                    listavariacoes.push(variacao);
                }
                console.log(listavariacoes);
                let mFornecedor = await daoFornecedores.buscarUm(res.rows[0].fk_idfornecedor);
                const mProduto = {
                    id: res.rows[0].id,
                    gtin: res.rows[0].gtin,
                    descricao: res.rows[0].descricao,
                    apelido: res.rows[0].apelido,
                    marca: res.rows[0].marca,
                    undmedida: res.rows[0].undmedida,
                    unidade: res.rows[0].unidade,
                    vlcusto: res.rows[0].vlcusto,
                    vlcompra: res.rows[0].vlcompra,
                    vlvenda: res.rows[0].vlvenda,
                    lucro: res.rows[0].lucro,
                    pesoliq: res.rows[0].pesoliq,
                    pesobruto: res.rows[0].pesobruto,
                    ncm: res.rows[0].ncm,
                    cfop: res.rows[0].cfop,
                    percicmssaida: res.rows[0].percicmssaida,
                    percipi: res.rows[0].percipi,
                    cargatribut: res.rows[0].cargatribut,
                    vlfrete: res.rows[0].vlfrete,
                    qtdatual: res.rows[0].qtdatual,
                    qtdideal: res.rows[0].qtdideal,
                    qtdmin: res.rows[0].qtdmin,
                    fornecedor: mFornecedor,
                    listavariacoes: listavariacoes,
                    datacad: res.rows[0].datacad,
                    ultalt: res.rows[0].ultalt,
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
    console.log("produto", produto);
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
                client.query('insert into produtos (gtin, descricao, apelido, marca, undmedida, unidade, vlcusto, vlcompra, vlvenda, lucro, pesoliq, pesobruto, ncm, cfop, percicmssaida, percipi, cargatribut, vlfrete, qtdatual, qtdideal, qtdmin, fk_idfornecedor, datacad, ultalt) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)', [
                    produto.gtin,
                    produto.descricao.toUpperCase(),
                    produto.apelido.toUpperCase(),
                    produto.marca.toUpperCase(),
                    produto.undmedida.toUpperCase(),
                    produto.unidade,
                    produto.vlcusto,
                    produto.vlcompra,
                    produto.vlvenda,
                    produto.lucro,
                    produto.pesoliq,
                    produto.pesobruto,
                    produto.ncm,
                    produto.cfop,
                    produto.percicmssaida,
                    produto.percipi,
                    produto.cargatribut,
                    produto.vlfrete,
                    produto.qtdatual,
                    produto.qtdideal,
                    produto.qtdmin,
                    produto.fornecedor.id,
                    produto.datacad, 
                    produto.ultalt
                ], async (err, res) => {
                    if (shouldAbort(err)) return reject(err);
                    const response = await client.query('select * from produtos where id = (select max(id) from produtos)');
                    for (let i = 0; i < produto.listavariacoes.length; i++) {
                        client.query('insert into produtos_variacoes values ($1, $2)', [response.id, produto.listavariacoes[i].id], async (err, res) => {
                            if (shouldAbort(err)) return reject(err);
                        })
                    }
                    client.query('COMMIT', async err => {
                        if (err) {
                            console.error('Erro durante o commit da transação', err.stack);
                            done();
                            return reject(err);
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
                client.query('update produtos set id = $1, gtin = $2, descricao = $3, apelido = $4, marca = $5, undmedida = $6, unidade = $7, vlcusto = $8, vlcompra = $9, vlvenda = $10, lucro = $11, pesoliq = $12, pesobruto = $13, ncm = $14, cfop = $15, percicmssaida = $16, percipi = $17, cargatribut = $18, vlfrete = $19, qtdatual = $20, qtdideal = $21, qtdmin = $22, fk_idfornecedor = $23, ultalt = $24 where id = $25', [
                    produto.id,
                    produto.gtin,
                    produto.descricao.toUpperCase(),
                    produto.apelido.toUpperCase(),
                    produto.marca.toUpperCase(),
                    produto.undmedida.toUpperCase(),
                    produto.unidade,
                    produto.vlcusto,
                    produto.vlcompra,
                    produto.vlvenda,
                    produto.lucro,
                    produto.pesoliq,
                    produto.pesobruto,
                    produto.ncm,
                    produto.cfop,
                    produto.percicmssaida,
                    produto.percipi,
                    produto.cargatribut,
                    produto.vlfrete,
                    produto.qtdatual,
                    produto.qtdideal,
                    produto.qtdmin,
                    produto.fornecedor.id, 
                    produto.ultalt,
                    id
                ], (err, res) => {
                    if (shouldAbort(err)) return reject(err);
                    client.query('delete from produtos_variacoes where fk_idproduto = $1', [id], async (err, res) => {
                        if (shouldAbort(err)) return reject(err);
                    })
                    for (let i = 0; i < produto.listavariacoes; i++) {
                        client.query('insert into produtos_variacoes values ($1, $2)', [response.id, produto.listavariacoes[i].id], async (err, res) => {
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
    console.log(id);
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
                client.query('delete from produtos_variacoes where fk_idproduto = $1', [id], async (err, res) => {
                    if (shouldAbort(err)) return reject(err);
                    client.query(`delete from produtos where id = ${id}`, (err, res) => {
                        if (shouldAbort(err)) return reject(err);
                    })
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

async function validate(produto) {
    return new Promise( async (resolve, reject) => {
        pool.query(`select * from produtos where descricao like '${produto.descricao.toUpperCase()}'`, (err, res) => {
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