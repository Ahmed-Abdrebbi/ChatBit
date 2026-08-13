require('dotenv').config()

function required(name) {
    const value = process.env[name]
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`)
    }
    return value
}

module.exports = {
    port: process.env.PORT || 3000,
    db: {
        host: required('DB_HOST'),
        port: Number(process.env.DB_PORT) || 5432,
        user: required('DB_USER'),
        password: required('DB_PASSWORD'),
        database: required('DB_NAME'),
    },
    jwt: {
        secret: required('JWT_SECRET'),
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
}