const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let ideas = [];
let timerStarted = false;
let timerEndTime = null;
let timerInterval;

io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.emit('timerStatus', { started: timerStarted, endTime: timerEndTime });

  socket.on('startTimer', () => {
    startTimer();
  });

  socket.on('resetTimer', () => {
    resetTimer();
  });

  socket.on('submitIdea', (idea) => {
    if (timerStarted) {
      ideas.push(idea);
      io.emit('newIdea', idea);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

function startTimer() {
  timerStarted = true;
  timerEndTime = Date.now() + 60000; // 60 seconds
  io.emit('timerStarted', timerEndTime);
  
  clearTimeout(timerInterval);
  timerInterval = setTimeout(() => {
    endTimer();
  }, 60000);
}

function resetTimer() {
  endTimer();
  startTimer();
}

function endTimer() {
  timerStarted = false;
  timerEndTime = null;
  clearTimeout(timerInterval);
  io.emit('timerEnded', ideas);
  ideas = [];
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/mobile', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mobile.html'));
});

app.get('/desktop', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'desktop.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));