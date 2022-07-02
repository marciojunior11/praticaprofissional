const { pool } = require('../datamodule/index');
const daoCidades = require('./daoCidades');

// @descricao BUSCA TODOS OS REGISTROS
// @route GET /api/fornecedores
async function getQtd(url) {
    return new Promise((resolve, reject) => {
        if (url.endsWith('=')) {
            pool.query('select * from fornecedores', (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res.rowCount);
            })
        } else {
            var filter = url.split('=')[3];
            pool.query('select * from fornecedores where fornecedor like ' + "'%" + `${filter.toUpperCase()}` + "%'", (err, res) => {
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
            pool.query('select * from fornecedores order by id asc', async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaFornecedores = [];
                for (let i = 0; i < res.rowCount ; i++) {
                    let mCidade = await daoCidades.buscarUm(res.rows[i].fk_idcidade);
                    mListaFornecedores.push({
                        id: res.rows[i].id,
                        razSocial: res.rows[i].razsocial,
                        nomeFantasia: res.rows[i].nomefantasia,
                        cnpj: res.rows[i].cnpj,
                        telefone: res.rows[i].telefone,
                        endereco: res.rows[i].endereco,
                        numEnd: res.rows[i].numend,
                        bairro: res.rows[i].bairro,
                        cidade: mCidade
                    })
                }
                return resolve(mListaFornecedores);
            })
        } else {
            const filter = url.split('=')[2]
            console.log(filter);
            pool.query(`select * from fornecedores where fornecedor like '${filter.toUpperCase()}'`, async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaFornecedores = [];
                for (let i = 0; i < res.rowCount ; i++) {
                    let mCidade = await daoCidades.buscarUm(res.rows[i].fk_idcidade);
                    mListaFornecedores.push({
                        id: res.rows[i].id,
                        razSocial: res.rows[i].razsocial,
                        nomeFantasia: res.rows[i].nomefantasia,
                        cnpj: res.rows[i].cnpj,
                        telefone: res.rows[i].telefone,
                        endereco: res.rows[i].endereco,
                        numEnd: res.rows[i].numend,
                        bairro: res.rows[i].bairro,
                        cidade: mCidade
                    })
                }
                return resolve(mListaFornecedores);
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
            pool.query(`select * from fornecedores order by id asc limit ${limit} offset ${(limit*page)-limit}`, async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaFornecedores = [];
                for (let i = 0; i < res.rowCount ; i++) {
                    let mCidade = await daoCidades.buscarUm(res.rows[i].fk_idcidade);
                    mListaFornecedores.push({
                        id: res.rows[i].id,
                        razSocial: res.rows[i].razsocial,
                        nomeFantasia: res.rows[i].nomefantasia,
                        cnpj: res.rows[i].cnpj,
                        telefone: res.rows[i].telefone,
                        endereco: res.rows[i].endereco,
                        numEnd: res.rows[i].numend,
                        bairro: res.rows[i].bairro,
                        cidade: mCidade
                    })
                }
                return resolve(mListaFornecedores);
            })
        } else {
            var filter = url.split('=')[3];
            console.log(filter);
            pool.query('select * from fornecedores where fornecedor like ' + "'%" + `${filter.toUpperCase()}` + "%' " + `limit ${limit} offset ${(limit*page)-limit}`, async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaFornecedores = [];
                for (let i = 0; i < res.rowCount ; i++) {
                    let mCidade = await daoCidades.buscarUm(res.rows[i].fk_idcidade);
                    mListaFornecedores.push({
                        id: res.rows[i].id,
                        razSocial: res.rows[i].razsocial,
                        nomeFantasia: res.rows[i].nomefantasia,
                        cnpj: res.rows[i].cnpj,
                        telefone: res.rows[i].telefone,
                        endereco: res.rows[i].endereco,
                        numEnd: res.rows[i].numend,
                        bairro: res.rows[i].bairro,
                        cidade: mCidade
                    })
                }
                return resolve(mListaFornecedores);
            })
        }
    })
};

// @descricao BUSCA UM REGISTRO
// @route GET /api/fornecedores
async function buscarUm (id) {
    return new Promise((resolve, reject) => {
        pool.query('select * from fornecedores where id = $1', [id], async (err, res) => {
            if (err) {
                return reject(err);
            }
            if (res.rowCount != 0) {
                const mCidade = await daoCidades.buscarUm(res.rows[0].fk_idcidade);
                const mFornecedor = {
                    id: res.rows[0].id,
                    razSocial: res.rows[0].razsocial,
                    nomeFantasia: res.rows[0].nomefantasia,
                    cnpj: res.rows[0].cnpj,
                    telefone: res.rows[0].telefone,
                    endereco: res.rows[0].endereco,
                    numEnd: res.rows[0].numend,
                    bairro: res.rows[0].bairro,
                    cidade: mCidade
                }
                return resolve(mFornecedor);
            }
            return resolve(null);
        })
    })
};

// @descricao SALVA UM REGISTRO
// @route POST /api/fornecedores
async function salvar (fornecedor) {
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
            client.query('insert into fornecedores (razsocial, nomefantasia, cnpj, telefone, endereco, numend, bairro, fk_idcidade) values($1, $2, $3, $4, $5, $6, $7, $8)', [fornecedor.razSocial, fornecedor.nomeFantasia, fornecedor.cnpj, fornecedor.telefone, fornecedor.endereco, fornecedor.numEnd, fornecedor.bairro, fornecedor.cidade.id], async (err, res) => {
                    if (shouldAbort(err)) return reject(err);
                    client.query('COMMIT', async err => {
                        if (err) {
                            console.error('Erro durante o commit da transação', err.stack);
                            reject(err);
                        }
                        const response = await client.query('select * from fornecedores where id = (select max(id) from fornecedores)');
                        done();
                        return resolve(response.rows[0]);
                    })
                })
            })
        })

    })
};

// @descricao ALTERA UM REGISTRO
// @route PUT /api/fornecedores/:id
async function alterar (id, fornecedor) {
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
                client.query('update fornecedores set id = $1, razsocial = $2, nomefantasia = $3, cnpj = $4, telefone = $5, endereco = $6, numend = $7, bairro = $8, fk_idcidade = $9 where id = $10 ', [fornecedor.id, fornecedor.razSocial, fornecedor.nomeFantasia, fornecedor.cnpj, fornecedor.telefone, fornecedor.endereco, fornecedor.numEnd, fornecedor.bairro, fornecedor.cidade.id, id], (err, res) => {
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
// @route GET /api/fornecedores/:id
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
                client.query(`delete from fornecedores where id = ${id}`, (err, res) => {
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

async function validate(fornecedor) {
    return new Promise( async (resolve, reject) => {
        pool.query(`select * from fornecedores where cnpj like '${fornecedor.cnpj}'`, (err, res) => {
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