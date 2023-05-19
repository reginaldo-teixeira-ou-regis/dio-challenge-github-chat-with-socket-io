const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/view/index.html');
});

const users = {};

const getCurrentDateTime = () => {
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();
  return `${date} - ${time}`;
};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('user login', (username) => {
    users[socket.id] = {
      username: username,
      timestamp: getCurrentDateTime()
    };
    io.emit('user joined', username, users[socket.id].timestamp);
  });

  socket.on('chat message', (data) => {
    const { message, username } = data;
    console.log(`User ${username} sent a message: ${message}`);
    io.emit('chat message', { message, username });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    const userData = users[socket.id];
    if (userData) {
      const { username, timestamp } = userData;
      delete users[socket.id];
      io.emit('user left', username, timestamp);
    }
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
