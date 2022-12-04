const { pool } = require('../datamodule/index');
const daoCidades = require('../daos/daoCidades');
const daoCondicoesPagamento = require('../daos/daoCondicoesPagamento');

// @descricao BUSCA TODOS OS REGISTROS
// @route GET /api/clientes
async function getQtd(url) {
    return new Promise((resolve, reject) => {
        if (url.endsWith('=')) {
            pool.query('select * from clientes', (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res.rowCount);
            })
        } else {
            var filter = url.split('=')[3];
            pool.query('select * from clientes where nome like ' + "'%" + `${filter.toUpperCase()}` + "%'", (err, res) => {
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
            pool.query('select * from clientes order by id asc', async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaClientes = [];
                for (let i = 0; i < res.rowCount ; i++) {
                    let mCidade = await daoCidades.buscarUm(res.rows[i].fk_idcidade);
                    let mCondicaoPagamento = daoCondicoesPagamento.buscarUm(res.rows[i].fk_idcondpgto);
                    mListaClientes.push({
                        id: res.rows[i].id,
                        nmcliente : res.rows[i].nmcliente,
                        sexo: res.rows[i].sexo,
                        cpf: res.rows[i].cpf,
                        rg: res.rows[i].rg,
                        datanasc: res.rows[i].datanasc,
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
                        flassociado: res.rows[i].flassociado,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt
                    })
                }
                return resolve(mListaClientes);
            })
        } else {
            const filter = url.split('=')[2]
            console.log(filter);
            pool.query(`select * from clientes where nome like '${filter.toUpperCase()}'`, async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaClientes = [];
                for (let i = 0; i < res.rowCount ; i++) {
                    let mCidade = await daoCidades.buscarUm(res.rows[i].fk_idcidade);
                    let mCondicaoPagamento = daoCondicoesPagamento.buscarUm(res.rows[i].fk_idcondpgto);
                    mListaClientes.push({
                        id: res.rows[i].id,
                        nmcliente : res.rows[i].nmcliente,
                        sexo: res.rows[i].sexo,
                        cpf: res.rows[i].cpf,
                        rg: res.rows[i].rg,
                        datanasc: res.rows[i].datanasc,
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
                        flassociado: res.rows[i].flassociado,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt
                    })
                }
                return resolve(mListaClientes);
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
            pool.query(`select * from clientes order by id asc limit ${limit} offset ${(limit*page)-limit}`, async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaClientes = [];
                for (let i = 0; i < res.rowCount ; i++) {
                    let mCidade = await daoCidades.buscarUm(res.rows[i].fk_idcidade);
                    let mCondicaoPagamento = daoCondicoesPagamento.buscarUm(res.rows[i].fk_idcondpgto);
                    mListaClientes.push({
                        id: res.rows[i].id,
                        nmcliente : res.rows[i].nmcliente,
                        sexo: res.rows[i].sexo,
                        cpf: res.rows[i].cpf,
                        rg: res.rows[i].rg,
                        datanasc: res.rows[i].datanasc,
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
                        flassociado: res.rows[i].flassociado,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt
                    })
                }
                return resolve(mListaClientes);
            })
        } else {
            var filter = url.split('=')[3];
            console.log(filter);
            pool.query('select * from clientes where nome like ' + "'%" + `${filter.toUpperCase()}` + "%' " + `limit ${limit} offset ${(limit*page)-limit}`, async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaClientes = [];
                console.log(res.rows);
                for (let i = 0; i < res.rowCount ; i++) {
                    let mCidade = await daoCidades.buscarUm(res.rows[i].fk_idcidade);
                    let mCondicaoPagamento = daoCondicoesPagamento.buscarUm(res.rows[i].fk_idcondpgto);
                    mListaClientes.push({
                        id: res.rows[i].id,
                        nmcliente: res.rows[i].nmcliente,
                        sexo: res.rows[i].sexo,
                        cpf: res.rows[i].cpf,
                        rg: res.rows[i].rg,
                        datanasc: res.rows[i].datanasc,
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
                        flassociado: res.rows[i].flassociado,
                        datacad: res.rows[i].datacad,
                        ultalt: res.rows[i].ultalt
                    })
                }
                return resolve(mListaClientes);
            })
        }
    })
};

// @descricao BUSCA UM REGISTRO
// @route GET /api/clientes
async function buscarUm (id) {
    return new Promise((resolve, reject) => {
        pool.query('select * from clientes where id = $1', [id], async (err, res) => {
            if (err) {
                return reject(err);
            }
            if (res.rowCount != 0) {
                const mCidade = await daoCidades.buscarUm(res.rows[0].fk_idcidade);
                const mCondicaoPagamento = await daoCondicoesPagamento.buscarUm(res.rows[0].fk_idcondpgto);
                const mCliente = {
                    id: res.rows[0].id,
                    nmcliente : res.rows[0].nmcliente,
                    sexo: res.rows[0].sexo,
                    cpf: res.rows[0].cpf,
                    rg: res.rows[0].rg,
                    datanasc: res.rows[0].datanasc,
                    email: res.rows[0].email,
                    telefone: res.rows[0].telefone,
                    celular: res.rows[0].celular,
                    cep: res.rows[0].cep,
                    endereco: res.rows[0].endereco,
                    numend: res.rows[0].numend,
                    bairro: res.rows[0].bairro,
                    cidade: mCidade,
                    condicaopagamento: mCondicaoPagamento,
                    flsituacao: res.rows[0].flsituacao,
                    flassociado: res.rows[0].flassociado,
                    datacad: res.rows[0].datacad,
                    ultalt: res.rows[0].ultalt
                }
                return resolve(mCliente);
            }
            return resolve(null);
        })
    })
};

// @descricao SALVA UM REGISTRO
// @route POST /api/clientes
async function salvar (cliente) {
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
                console.log('DAO CLIENTE', cliente);
                client.query(`
                    insert into clientes (
                        nmcliente,
                        sexo,
                        cpf,
                        rg,
                        telefone,
                        celular,
                        email,
                        cep,
                        endereco,
                        numend,
                        bairro,
                        fk_idcidade,
                        fk_idcondpgto,
                        flassociado,
                        flsituacao,
                        datacad,
                        ultalt,
                        datanasc
                    ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
                `, [
                    cliente.nmcliente.toUpperCase(),
                    cliente.sexo.toUpperCase(),
                    cliente.cpf,
                    cliente.rg,
                    cliente.telefone,
                    cliente.celular,
                    cliente.email.toUpperCase(),
                    cliente.cep,
                    cliente.endereco.toUpperCase(),
                    cliente.numend,
                    cliente.bairro.toUpperCase(),
                    cliente.cidade.id,
                    cliente.condicaopagamento.id,
                    cliente.flassociado.toUpperCase(),
                    cliente.flsituacao.toUpperCase(),
                    cliente.datacad,
                    cliente.ultalt,
                    cliente.datanasc
                ], async (err, res) => {
                        if (shouldAbort(err)) return reject(err);
                        client.query('COMMIT', async err => {
                            if (err) {
                                console.error('Erro durante o commit da transação', err.stack);
                                done();
                                return reject(err);
                            }
                            const response = await client.query('select * from clientes where id = (select max(id) from clientes)');
                            done();
                            return resolve(response.rows[0]);
                        })
                    })
            })
        })

    })
};

// @descricao ALTERA UM REGISTRO
// @route PUT /api/clientes/:id
async function alterar (id, cliente) {
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
                    update clientes set
                        id = $1,
                        nmcliente = $2,
                        sexo = $3,
                        cpf = $4,
                        rg = $5,
                        telefone = $6,
                        celular = $7,
                        email = $8,
                        cep = $9,
                        endereco = $10,
                        numend = $11,
                        bairro = $12,
                        fk_idcidade = $13,
                        fk_idcondpgto = $14,
                        flassociado = $15,
                        flsituacao = $16,
                        datacad = $17,
                        ultalt = $18,
                        datanasc = $19
                    where id = $20                
                `, [
                    id,
                    cliente.nmcliente.toUpperCase(),
                    cliente.sexo.toUpperCase(),
                    cliente.cpf,
                    cliente.rg,
                    cliente.telefone,
                    cliente.celular,
                    cliente.email.toUpperCase(),
                    cliente.cep,
                    cliente.endereco.toUpperCase(),
                    cliente.numend,
                    cliente.bairro.toUpperCase(),
                    cliente.cidade.id,
                    cliente.condicaopagamento.id,
                    cliente.flassociado.toUpperCase(),
                    cliente.flsituacao.toUpperCase(),
                    cliente.datacad,
                    cliente.ultalt,
                    cliente.datanasc,
                    id
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
// @route GET /api/clientes/:id
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
                client.query(`delete from clientes where id = ${id}`, (err, res) => {
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

async function validate(cliente) {
    return new Promise( async (resolve, reject) => {
        pool.query(`select * from clientes where cpf like '${cliente.cpf}'`, (err, res) => {
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