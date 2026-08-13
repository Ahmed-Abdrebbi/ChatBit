
const pool = require('../config/db');

const DEFAULT_PAGE_SIZE = 30;

async function createMessage({ conversationId, senderId, content }) {
    const result = await pool.query(
        `INSERT INTO messages (conversationid, senderid, content)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [conversationId, senderId, content]
    );
    return result.rows[0];
}

async function listByConversation(conversationId, { before, limit = DEFAULT_PAGE_SIZE } = {}) {
    const params = [conversationId];
    let cursorClause = '';

    if (before) {
        params.push(before);
        cursorClause = `AND id < $${params.length}`;
    }

    params.push(limit);

    const result = await pool.query(
        `SELECT * FROM messages
         WHERE conversationid = $1 ${cursorClause}
         ORDER BY id DESC
         LIMIT $${params.length}`,
        params
    );

    return result.rows.reverse();
}

async function markAsRead(conversationId, readerId) {
    await pool.query(
        `UPDATE messages
         SET isread = true
         WHERE conversationid = $1 AND senderid != $2 AND isread = false`,
        [conversationId, readerId]
    );
}

module.exports = { createMessage, listByConversation, markAsRead };