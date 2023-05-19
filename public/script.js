const socket = io();

const loginContainer = document.getElementById('login-container');
const loginForm = document.getElementById('login-form');
const chatContainer = document.getElementById('chat-container');
const messageList = document.getElementById('messages');
const input = document.getElementById('input');
const usernameInput = document.getElementById('username');
const loggedInUsername = document.getElementById('logged-in-username');

let username = '';

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!username && usernameInput.value.trim()) {
    username = usernameInput.value.trim();
    socket.emit('user login', username);
    loggedInUsername.textContent = `Logged in as: ${username}`;
    loginForm.reset();
    usernameInput.disabled = true;
    loginContainer.style.display = 'none';
    chatContainer.style.display = 'block';
  }
});

const sendMessage = (message) => {
  if (message && username) {
    const data = {
      message: message,
      username: username
    };
    socket.emit('chat message', data);
    input.value = '';
  }
};

document.getElementById('form').addEventListener('submit', (e) => {
  e.preventDefault();
  const message = input.value.trim();
  sendMessage(message);
});

socket.on('chat message', (data) => {
  const { message, username } = data;
  const item = document.createElement('li');
  item.textContent = `${username}: ${message}`;
  messageList.appendChild(item);
  messageList.scrollIntoView(false);
});

socket.on('user joined', (username, timestamp) => {
  const item = document.createElement('li');
  item.textContent = `${username} - joined the chat - (${timestamp})`;
  messageList.appendChild(item);
  messageList.scrollIntoView(false);
});

socket.on('user left', (username, timestamp) => {
  const item = document.createElement('li');
  item.textContent = `${username} - left the chat - (${timestamp})`;
  messageList.appendChild(item);
  messageList.scrollIntoView(false);
});
