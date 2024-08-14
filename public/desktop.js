const socket = io();

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
    ideas = [];
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

document.getElementById('startTimer').addEventListener('click', () => {
    socket.emit('startTimer');
});

function updateUI() {
    const timerElement = document.getElementById('timer');
    const startButton = document.getElementById('startTimer');
    const ideasList = document.getElementById('ideasList');

    if (timerStarted) {
        const remainingTime = Math.max(0, Math.ceil((timerEndTime - Date.now()) / 1000));
        timerElement.textContent = `Time remaining: ${remainingTime}s`;
        startButton.disabled = true;
    } else {
        timerElement.textContent = "Timer not started";
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

setInterval(updateUI, 1000);