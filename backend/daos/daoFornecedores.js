const { pool } = require('../datamodule/index');
const daoCidades = require('./daoCidades');
const daoCondicoesPagamento = require('./daoCondicoesPagamento');

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
            pool.query('select * from fornecedores where razsocial like ' + "'%" + `${filter.toUpperCase()}` + "%'", (err, res) => {
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
                    let mCondicaoPagamento = await daoCondicoesPagamento.buscarUm(res.rows[i].fk_idcondpgto);
                    mListaFornecedores.push({
                        id: res.rows[i].id,
                        razsocial: res.rows[i].razsocial,
                        nmfantasia: res.rows[i].nmfantasia,
                        cnpj: res.rows[i].cnpj,
                        inscestadual: res.rows[i].inscestadual,
                        telefone: res.rows[i].telefone,
                        celular: res.rows[i].celular,
                        email: res.rows[i].email,
                        cep: res.rows[i].cep,
                        endereco: res.rows[i].endereco,
                        numend: res.rows[i].numend,
                        bairro: res.rows[i].bairro,
                        cidade: mCidade,
                        condicaopagamento: mCondicaoPagamento,
                        flsituacao: res.rows[i].flsituacao,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt,
                    })
                }
                return resolve(mListaFornecedores);
            })
        } else {
            const filter = url.split('=')[2]
            console.log(filter);
            pool.query(`select * from fornecedores where razsocial like '${filter.toUpperCase()}'`, async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaFornecedores = [];
                for (let i = 0; i < res.rowCount ; i++) {
                    let mCidade = await daoCidades.buscarUm(res.rows[i].fk_idcidade);
                    let mCondicaoPagamento = await daoCondicoesPagamento.buscarUm(res.rows[i].fk_idcondpgto);
                    mListaFornecedores.push({
                        id: res.rows[i].id,
                        razsocial: res.rows[i].razsocial,
                        nmfantasia: res.rows[i].nmfantasia,
                        cnpj: res.rows[i].cnpj,
                        inscestadual: res.rows[i].inscestadual,
                        telefone: res.rows[i].telefone,
                        celular: res.rows[i].celular,
                        email: res.rows[i].email,
                        cep: res.rows[i].cep,
                        endereco: res.rows[i].endereco,
                        numend: res.rows[i].numend,
                        bairro: res.rows[i].bairro,
                        cidade: mCidade,
                        condicaopagamento: mCondicaoPagamento,
                        flsituacao: res.rows[i].flsituacao,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt,
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
                    let mCondicaoPagamento = await daoCondicoesPagamento.buscarUm(res.rows[i].fk_idcondpgto);
                    mListaFornecedores.push({
                        id: res.rows[i].id,
                        razsocial: res.rows[i].razsocial,
                        nmfantasia: res.rows[i].nmfantasia,
                        cnpj: res.rows[i].cnpj,
                        inscestadual: res.rows[i].inscestadual,
                        email: res.rows[i].email,
                        telefone: res.rows[i].telefone,
                        celular: res.rows[i].celular,
                        cep: res.rows[i].cep,
                        endereco: res.rows[i].endereco,
                        numend: res.rows[i].numend,
                        bairro: res.rows[i].bairro,
                        cidade: mCidade,
                        condicaopagamento: mCondicaoPagamento,
                        flsituacao: res.rows[i].flsituacao,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt,
                    })
                }
                return resolve(mListaFornecedores);
            })
        } else {
            var filter = url.split('=')[3];
            console.log(filter);
            pool.query('select * from fornecedores where razsocial like ' + "'%" + `${filter.toUpperCase()}` + "%' " + `limit ${limit} offset ${(limit*page)-limit}`, async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaFornecedores = [];
                for (let i = 0; i < res.rowCount ; i++) {
                    let mCidade = await daoCidades.buscarUm(res.rows[i].fk_idcidade);
                    let mCondicaoPagamento = await daoCondicoesPagamento.buscarUm(res.rows[i].fk_idcondpgto);
                    mListaFornecedores.push({
                        id: res.rows[i].id,
                        razsocial: res.rows[i].razsocial,
                        nmfantasia: res.rows[i].nmfantasia,
                        cnpj: res.rows[i].cnpj,
                        inscestadual: res.rows[i].inscestadual,
                        telefone: res.rows[i].telefone,
                        celular: res.rows[i].celular,
                        email: res.rows[i].email,
                        cep: res.rows[i].cep,
                        endereco: res.rows[i].endereco,
                        numend: res.rows[i].numend,
                        bairro: res.rows[i].bairro,
                        cidade: mCidade,
                        condicaopagamento: mCondicaoPagamento,
                        flsituacao: res.rows[i].flsituacao,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt,
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
                let mCondicaoPagamento = await daoCondicoesPagamento.buscarUm(res.rows[0].fk_idcondpgto);
                const mFornecedor = {
                    id: res.rows[0].id,
                    razsocial: res.rows[0].razsocial,
                    nmfantasia: res.rows[0].nmfantasia,
                    cnpj: res.rows[0].cnpj,
                    inscestadual: res.rows[0].inscestadual,
                    telefone: res.rows[0].telefone,
                    celular: res.rows[0].celular,
                    email: res.rows[0].email,
                    cep: res.rows[0].cep,
                    endereco: res.rows[0].endereco,
                    numend: res.rows[0].numend,
                    bairro: res.rows[0].bairro,
                    cidade: mCidade,
                    condicaopagamento: mCondicaoPagamento,
                    flsituacao: res.rows[0].flsituacao,
                    datacad: res.rows[0].datacad,
                    ultalt: res.rows[0].ultalt,
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
            client.query('insert into fornecedores (razsocial, nmfantasia, telefone, celular, email, cnpj, inscestadual, cep, endereco, numend, bairro, fk_idcidade, fk_idcondpgto, flsituacao, datacad, ultalt) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)', [
                fornecedor.razsocial.toUpperCase(), 
                fornecedor.nmfantasia.toUpperCase(), 
                fornecedor.cnpj, 
                fornecedor.inscestadual, 
                fornecedor.email.toUpperCase(), 
                fornecedor.telefone, 
                fornecedor.celular, 
                fornecedor.cep, 
                fornecedor.endereco.toUpperCase(), 
                fornecedor.numend, 
                fornecedor.bairro.toUpperCase(), 
                fornecedor.cidade.id, 
                fornecedor.condicaopagamento.id, 
                fornecedor.flsituacao.toUpperCase(), 
                fornecedor.datacad, 
                fornecedor.ultalt
            ], async (err, res) => {
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
                client.query('update fornecedores set razsocial = $1, nmfantasia = $2, telefone = $3, celular = $4, email = $5, cnpj = $6, inscestadual = $7, cep = $8, endereco = $9, numend = $10, bairro = $11, fk_idcidade = $12, fk_idcondpgto = $13, flsituacao = $14, datacad = $15, ultalt = $16 where id = $17', [
                    fornecedor.razsocial.toUpperCase(), 
                    fornecedor.nmfantasia.toUpperCase(), 
                    fornecedor.cnpj, 
                    fornecedor.inscestadual, 
                    fornecedor.email.toUpperCase(), 
                    fornecedor.telefone, 
                    fornecedor.celular, 
                    fornecedor.cep, 
                    fornecedor.endereco.toUpperCase(), 
                    fornecedor.numend, 
                    fornecedor.bairro.toUpperCase(), 
                    fornecedor.cidade.id, 
                    fornecedor.condicaopagamento.id, 
                    fornecedor.flsituacao.toUpperCase(), 
                    fornecedor.datacad, 
                    fornecedor.ultalt,
                    id
                ], (err, res) => {
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
                client.query('delete from fornecedores where id = $1', [id], (err, res) => {
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
        pool.query('select * from fornecedores where cnpj like $1', [fornecedor.cnpj], (err, res) => {
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