
const conversationRepository = require('../repositories/conversation.repository');

function canAccessConversation(conversation, user) {
    if (!conversation) return false;
    if (user.role === 'client') return conversation.clientid === user.id;
    if (user.role === 'agent') {
        return conversation.agentid === user.id || conversation.status === 'en_attente';
    }
    return false;
}

function registerConversationHandlers(io, socket) {
    socket.on('conversation:join', async (payload, callback) => {
        const conversationId = Number(payload?.conversationId);
        const conversation = await conversationRepository.findById(conversationId);

        if (!canAccessConversation(conversation, socket.user)) {
            socket.emit('error', { message: 'You cannot join this conversation' });
            return callback?.({ ok: false });
        }

        socket.join(`conversation:${conversationId}`);
        callback?.({ ok: true });
    });

    socket.on('conversation:leave', (payload) => {
        const conversationId = Number(payload?.conversationId);
        socket.leave(`conversation:${conversationId}`);
    });
}

module.exports = registerConversationHandlers;