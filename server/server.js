// API
const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors')

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST']
    }
})

io.on('connection', socket => {
    console.log('Client Connected:', socket.id);

    socket.on('message', data => {
        console.log('收到訊息:', data);
        socket.broadcast.emit('message', data); // 轉發訊息給其他人
    });

    socket.on('disconnect', () => {
        console.log('用戶已斷線:', socket.id);
    });
    socket.on('send_message', (data) => {
        console.log('Received message: ', data.message);
        socket.emit('receive_message', { message: data.message });
    });
});

server.listen(3001, () => {
    console.log('Server Run');
})
