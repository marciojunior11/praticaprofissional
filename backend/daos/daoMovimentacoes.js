const { pool } = require('../datamodule/index');
const daoClientes = require('./daoClientes');
const daoFornecedores = require('./daoFornecedores');

// @descricao BUSCA TODOS OS REGISTROS
// @route GET /api/grades
async function getQtd(url) {
    return new Promise((resolve, reject) => {
        pool.query('select * from movimentacoes', (err, res) => {
            if (err) {
                return reject(err);
            }
            return resolve(res.rowCount);
        })
    })
};

async function buscarTodosComPg (url) {
    var limit = url.split('=')[2];
    var page = url.split('=')[1];
    limit = limit.replace(/[^0-9]/g, '');
    page = page.replace(/[^0-9]/g, '');
    return new Promise((resolve, reject) => {
        if (url.endsWith('=')) {
            pool.query(`select * from movimentacoes order by id asc limit ${limit} offset ${(limit*page)-limit}`, async (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaMovimentacoes = [];
                for (let i = 0; i < res.rows.length; i++) {
                    let movimentacao = res.rows[i];
                    let pessoa = {};
                    if (movimentacao.tipo == 'E') {
                        let response = await daoClientes.buscarUm(movimentacao.idpessoa);
                        pessoa = response.rows[0];
                        mListaMovimentacoes.push({
                            id: movimentacao.id,
                            tipo: movimentacao.tipo,
                            dtmovimentacao: movimentacao.dtmovimentacao,
                            valor: movimentacao.valor,
                            pessoa: pessoa
                        })
                    } else {
                        let response = await daoFornecedores.buscarUm(movimentacao.idpessoa);
                        pessoa = response.rows[0];
                        mListaMovimentacoes.push({
                            id: movimentacao.id,
                            tipo: movimentacao.tipo,
                            dtmovimentacao: movimentacao.dtmovimentacao,
                            valor: movimentacao.valor,
                            pessoa: pessoa
                        })
                    }
                }
                return resolve(mListaMovimentacoes);
            })
        } else {
            var filter = url.split('=')[3];
            if (filter.includes('ENTRADA')) {
                filter = 'E';
            } else if (filter.includes('SAIDA')) {
                filter = 'S';
            }
            pool.query(`select * from movimentacoes where tipo = '${filter}' limit ${limit} offset ${(limit*page)-limit}`, (err, res) => {
                if (err) {
                    return reject(err);
                }
                const mListaMovimentacoes = [];
                for (let i = 0; i < res.rows.length; i++) {
                    let movimentacao = res.rows[i];
                    let pessoa = {};
                    if (movimentacao.tipo == 'E') {
                        let response = await daoClientes.buscarUm(movimentacao.idpessoa);
                        pessoa = response.rows[0];
                        mListaMovimentacoes.push({
                            id: movimentacao.id,
                            tipo: movimentacao.tipo,
                            dtmovimentacao: movimentacao.dtmovimentacao,
                            valor: movimentacao.valor,
                            pessoa: pessoa
                        })
                    } else {
                        let response = await daoFornecedores.buscarUm(movimentacao.idpessoa);
                        pessoa = response.rows[0];
                        mListaMovimentacoes.push({
                            id: movimentacao.id,
                            tipo: movimentacao.tipo,
                            dtmovimentacao: movimentacao.dtmovimentacao,
                            valor: movimentacao.valor,
                            pessoa: pessoa
                        })
                    }
                }
                return resolve(mListaMovimentacoes);
            })
        }
    })
};

module.exports = {
    getQtd,
    buscarTodosComPg,
}