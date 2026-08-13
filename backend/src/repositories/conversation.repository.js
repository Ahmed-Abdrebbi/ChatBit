
const pool = require('../config/db');

async function createConversation({ clientId, subject }) {
    const result = await pool.query(
        `INSERT INTO conversations (subject, clientid)
         VALUES ($1, $2)
         RETURNING *`,
        [subject, clientId]
    );
    return result.rows[0];
}

async function findById(id) {
    const result = await pool.query(
        `SELECT * FROM conversations WHERE id = $1`,
        [id]
    );
    return result.rows[0] || null;
}

async function listForClient(clientId) {
    const result = await pool.query(
        `SELECT * FROM conversations
         WHERE clientid = $1
         ORDER BY createdat DESC`,
        [clientId]
    );
    return result.rows;
}

async function listForAgent(agentId) {
    const result = await pool.query(
        `SELECT * FROM conversations
         WHERE status = 'en_attente' OR agentid = $1
         ORDER BY createdat DESC`,
        [agentId]
    );
    return result.rows;
}

async function assignAgent(conversationId, agentId) {
    const result = await pool.query(
        `UPDATE conversations
         SET agentid = $1, status = 'en_cours'
         WHERE id = $2 AND status = 'en_attente'
         RETURNING *`,
        [agentId, conversationId]
    );
    return result.rows[0] || null;
}

async function closeConversation(conversationId) {
    const result = await pool.query(
        `UPDATE conversations
         SET status = 'fermee', closedat = now()
         WHERE id = $1
         RETURNING *`,
        [conversationId]
    );
    return result.rows[0] || null;
}

module.exports = {
    createConversation,
    findById,
    listForClient,
    listForAgent,
    assignAgent,
    closeConversation,
};