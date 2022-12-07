const { pool } = require('../datamodule/index');

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
            pool.query(`select * from grades order by id asc limit ${limit} offset ${(limit*page)-limit}`,(err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res.rows);
            })
        } else {
            var filter = url.split('=')[3];
            pool.query(`select * from grades where descricao like '%${filter.toUpperCase()}%' limit ${limit} offset ${(limit*page)-limit}`, (err, res) => {
                if (err) {
                    return reject(err);
                }
                console.log(res);
                return resolve(res.rows);
            })
        }
    })
};

module.exports = {
    getQtd,
    buscarTodosComPg,
}