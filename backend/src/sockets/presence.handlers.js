const userRepository = require('../repositories/user.repository');

async function registerPresenceHandlers(io, socket) {
    await userRepository.setOnlineStatus(socket.user.id, true);
    io.emit('presence:update', { userId: socket.user.id, isOnline: true });

    socket.on('disconnect', async () => {
        await userRepository.setOnlineStatus(socket.user.id, false);
        io.emit('presence:update', { userId: socket.user.id, isOnline: false });
    });
}

module.exports = registerPresenceHandlers;
