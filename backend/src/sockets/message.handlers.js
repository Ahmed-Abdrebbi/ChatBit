
const conversationRepository = require('../repositories/conversation.repository');
const messageRepository = require('../repositories/message.repository');

function registerMessageHandlers(io, socket) {
    socket.on('message:send', async (payload) => {
        const conversationId = Number(payload?.conversationId);
        const content = (payload?.content || '').trim();

        if (!content) {
            return socket.emit('error', { message: 'Message content cannot be empty' });
        }

        const conversation = await conversationRepository.findById(conversationId);

        if (!conversation) {
            return socket.emit('error', { message: 'Conversation not found' });
        }

        if (conversation.status === 'fermee') {
            return socket.emit('error', { message: 'This conversation is closed' });
        }

        const isParticipant =
            (socket.user.role === 'client' && conversation.clientid === socket.user.id) ||
            (socket.user.role === 'agent' && conversation.agentid === socket.user.id);

        if (!isParticipant) {
            return socket.emit('error', { message: 'You are not part of this conversation' });
        }

        const message = await messageRepository.createMessage({
            conversationId,
            senderId: socket.user.id,
            content,
        });

        io.to(`conversation:${conversationId}`).emit('message:new', message);
    });
}

module.exports = registerMessageHandlers;