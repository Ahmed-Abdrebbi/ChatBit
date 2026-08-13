
function registerTypingHandlers(io, socket) {
    socket.on('typing:start', (payload) => {
        const conversationId = Number(payload?.conversationId);
        socket.to(`conversation:${conversationId}`).emit('typing:update', {
            userId: socket.user.id,
            isTyping: true,
        });
    });

    socket.on('typing:stop', (payload) => {
        const conversationId = Number(payload?.conversationId);
        socket.to(`conversation:${conversationId}`).emit('typing:update', {
            userId: socket.user.id,
            isTyping: false,
        });
    });
}

module.exports = registerTypingHandlers;