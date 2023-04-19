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

// on = evento de escuta
// emit = evento de emissão

io.on('connection', (socket) => {
  console.log(`Uma pessoa se conectou ao backend com o id: ${socket.id}`);

  socket.on('chat message', (message) => {
    console.log(`A pessoa usuaria de id: ${socket.id} enviou a seguinte mensagem: ${message}`);
    io.emit('chat message', message);
  });

  io.on('disconnect', () => {
    console.log(`A pessoa de id: ${socket.id} se desconectou`);
  });
});

server.listen(3000, () => console.log('O PAI TA ON NA PORTA 3000'));
