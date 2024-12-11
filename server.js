const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from public directory
app.use(express.static('public'));

// Handle socket connections
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('playerMove', (data) => {
        // Broadcast player movement to other players
        socket.broadcast.emit('playerMoved', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
