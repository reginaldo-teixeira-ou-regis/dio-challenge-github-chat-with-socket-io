const socket = io();

const form = document.querySelector('#form');
const input = document.querySelector('#input');
const messageList = document.querySelector('#messages');


form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

socket.on('chat message', (message) => {
  const item = document.createElement('li');
  item.textContent = message;
  messageList.appendChild(item);
  messageList.scrollIntoView(false);
});