
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

document.getElementById('timerButton').addEventListener('click', () => {
    if (timerStarted) {
        // Reset timer
        socket.emit('resetTimer');
    } else {
        // Start timer
        socket.emit('startTimer');
    }
});

function updateUI() {
    const timerElement = document.getElementById('timer');
    const timerButton = document.getElementById('timerButton');
    const ideasList = document.getElementById('ideasList');

    if (timerStarted) {
        const remainingTime = Math.max(0, Math.ceil((timerEndTime - Date.now()) / 1000));
        timerElement.textContent = `Time remaining: ${remainingTime}s`;
        timerButton.textContent = 'Reset Timer';
        timerButton.classList.remove('bg-primary-600', 'hover:bg-primary-700');
        timerButton.classList.add('bg-red-600', 'hover:bg-red-700');
    } else {
        timerElement.textContent = "Timer not started";
        timerButton.textContent = 'Start Timer';
        timerButton.classList.remove('bg-red-600', 'hover:bg-red-700');
        timerButton.classList.add('bg-primary-600', 'hover:bg-primary-700');
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