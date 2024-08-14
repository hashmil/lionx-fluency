const socket = io('https://your-socket-server.com'); // You'll need to set up a separate WebSocket server

let ideas = [];
let timerStarted = false;
let timerEndTime = null;

socket.on('timerStatus', ({ started, endTime }) => {
    timerStarted = started;
    timerEndTime = endTime;
    updateUI();
});

socket.on('timerStarted', (endTime) => {
    timerStarted = true;
    timerEndTime = endTime;
    updateUI();
});

socket.on('timerEnded', (finalIdeas) => {
    timerStarted = false;
    timerEndTime = null;
    ideas = finalIdeas;
    updateUI();
});

socket.on('newIdea', (idea) => {
    ideas.push(idea);
    updateUI();
});

function startTimer() {
    socket.emit('startTimer');
}

function submitIdea() {
    const idea = document.getElementById('ideaInput').value;
    if (idea && timerStarted) {
        socket.emit('submitIdea', idea);
        document.getElementById('ideaInput').value = '';
    }
}

function updateUI() {
    const timerElement = document.getElementById('timer');
    const ideaInput = document.getElementById('ideaInput');
    const submitButton = document.getElementById('submitIdea');
    const startButton = document.getElementById('startTimer');
    const ideasList = document.getElementById('ideasList');

    if (timerStarted) {
        const remainingTime = Math.max(0, Math.ceil((timerEndTime - Date.now()) / 1000));
        timerElement.textContent = `Time remaining: ${remainingTime}s`;
        ideaInput.disabled = false;
        submitButton.disabled = false;
        startButton.disabled = true;
    } else {
        timerElement.textContent = "Timer not started";
        ideaInput.disabled = true;
        submitButton.disabled = true;
        startButton.disabled = false;
    }

    ideasList.innerHTML = '';
    ideas.forEach(idea => {
        const card = document.createElement('div');
        card.className = 'bg-gray-700 p-4 rounded-lg shadow';
        card.textContent = idea;
        ideasList.appendChild(card);
    });
}

// Update UI every second
setInterval(updateUI, 1000);