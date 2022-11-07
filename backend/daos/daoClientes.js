const { pool } = require('../datamodule/index');
const daoCidades = require('../daos/daoCidades');

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
                    mListaClientes.push({
                        id: res.rows[i].id,
                        nome : res.rows[i].nome,
                        cpf: res.rows[i].cpf,
                        rg: res.rows[i].rg,
                        telefone: res.rows[i].telefone,
                        endereco: res.rows[i].endereco,
                        numEnd: res.rows[i].numend,
                        bairro: res.rows[i].bairro,
                        cidade: mCidade
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
                    mListaClientes.push({
                        id: res.rows[i].id,
                        nome : res.rows[i].nome,
                        cpf: res.rows[i].cpf,
                        rg: res.rows[i].rg,
                        telefone: res.rows[i].telefone,
                        endereco: res.rows[i].endereco,
                        numEnd: res.rows[i].numend,
                        bairro: res.rows[i].bairro,
                        cidade: mCidade
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
                    mListaClientes.push({
                        id: res.rows[i].id,
                        nome : res.rows[i].nome,
                        cpf: res.rows[i].cpf,
                        rg: res.rows[i].rg,
                        telefone: res.rows[i].telefone,
                        endereco: res.rows[i].endereco,
                        numEnd: res.rows[i].numend,
                        bairro: res.rows[i].bairro,
                        cidade: mCidade
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
                for (let i = 0; i < res.rowCount ; i++) {
                    let mCidade = await daoCidades.buscarUm(res.rows[i].fk_idcidade);
                    mListaClientes.push({
                        id: res.rows[i].id,
                        nome : res.rows[i].nome,
                        cpf: res.rows[i].cpf,
                        rg: res.rows[i].rg,
                        telefone: res.rows[i].telefone,
                        endereco: res.rows[i].endereco,
                        numEnd: res.rows[i].numend,
                        bairro: res.rows[i].bairro,
                        cidade: mCidade
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
                const mCliente = {
                    id: res.rows[0].id,
                        nome : res.rows[0].nome,
                        cpf: res.rows[0].cpf,
                        rg: res.rows[0].rg,
                        telefone: res.rows[0].telefone,
                        endereco: res.rows[0].endereco,
                        numEnd: res.rows[0].numend,
                        bairro: res.rows[0].bairro,
                        cidade: mCidade
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
            client.query('insert into clientes (nome, cpf, rg, telefone, endereco, numend, bairro, fk_idcidade, associado) values($1, $2, $3, $4, $5, $6, $7, $8, $9)', [cliente.nome, cliente.cpf, cliente.rg, cliente.telefone, cliente.endereco, cliente.numEnd, cliente.bairro, cliente.cidade.id, cliente.associado], async (err, res) => {
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
                client.query('update clientes set  id = $1, nome = $2, cpf = $3, rg = $4, telefone = $5, endereco = $6, numend = $7, bairro = $8, fk_idcidade = $9, associado = $10 where id = $11', [cliente.id, cliente.nome, cliente.cpf, cliente.rg, cliente. telefone, cliente.endereco, cliente.numEnd, cliente.bairro, cliente.cidade.id, cliente.associado, id], (err, res) => {
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