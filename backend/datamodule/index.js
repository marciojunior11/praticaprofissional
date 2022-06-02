const { Pool, Client } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'avpfi',
    password: '1234567890',
    port: 5432
});

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'avpfi',
    password: '1234567890',
    port: 5432
});

module.exports = {
    pool,
    client
}