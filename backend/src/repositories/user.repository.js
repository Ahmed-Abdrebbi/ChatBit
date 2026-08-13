
const pool = require('../config/db');

async function createUser({ fullname, email, passwordhash, role }) {
    const result = await pool.query(
        `INSERT INTO users (fullname, email, passwordhash, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, fullname, email, role, isonline, createdat`,
        [fullname, email, passwordhash, role]
    );
    return result.rows[0];
}

async function findByEmail(email) {
    const result = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );
    return result.rows[0] || null;
}

async function findById(id) {
    const result = await pool.query(
        `SELECT id, fullname, email, role, isonline, createdat
         FROM users WHERE id = $1`,
        [id]
    );
    return result.rows[0] || null;
}

async function setOnlineStatus(id, isOnline) {
    await pool.query(
        `UPDATE users SET isonline = $1 WHERE id = $2`,
        [isOnline, id]
    );
}

module.exports = { createUser, findByEmail, findById, setOnlineStatus };