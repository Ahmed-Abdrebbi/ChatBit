

const http = require('http');
const { Server } = require('socket.io');
const env = require('./config/env');
const app = require('./app');
const initSockets = require('./sockets');

const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: '*' },
});

app.set('io', io);
initSockets(io);

server.listen(env.port, () => {
    console.log(`ChatBit backend listening on port ${env.port}`);
});