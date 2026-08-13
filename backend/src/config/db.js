
const { Pool } = require('pg')
const env = require('./env')

const pool = new Pool ({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.database,
})

pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client', err)
    process.exit(1)
})

module.exports = pool