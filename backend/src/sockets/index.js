
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const registerPresenceHandlers = require('./presence.handlers');
const registerConversationHandlers = require('./conversation.handlers');
const registerMessageHandlers = require('./message.handlers');
const registerTypingHandlers = require('./typing.handlers');

function initSockets(io) {
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;

        if (!token) {
            return next(new Error('Authentication required'));
        }

        try {
            const payload = jwt.verify(token, env.jwt.secret);
            socket.user = { id: payload.sub, role: payload.role };
            next();
        } catch (error) {
            next(new Error('Invalid or expired token'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`Socket connected: user ${socket.user.id} (${socket.user.role})`);

        registerPresenceHandlers(io, socket);
        registerConversationHandlers(io, socket);
        registerMessageHandlers(io, socket);
        registerTypingHandlers(io, socket);
    });
}

module.exports = initSockets;