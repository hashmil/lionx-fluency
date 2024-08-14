const socket = io();

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

socket.on('timerEnded', () => {
    timerStarted = false;
    timerEndTime = null;
    updateUI();
});

document.getElementById('submitIdea').addEventListener('click', () => {
    const idea = document.getElementById('ideaInput').value;
    if (idea && timerStarted) {
        socket.emit('submitIdea', idea);
        document.getElementById('ideaInput').value = '';
    }
});

function updateUI() {
    const timerElement = document.getElementById('timer');
    const ideaInput = document.getElementById('ideaInput');
    const submitButton = document.getElementById('submitIdea');

    if (timerStarted) {
        const remainingTime = Math.max(0, Math.ceil((timerEndTime - Date.now()) / 1000));
        timerElement.textContent = `Time remaining: ${remainingTime}s`;
        ideaInput.disabled = false;
        submitButton.disabled = false;
    } else {
        timerElement.textContent = "Waiting for timer to start...";
        ideaInput.disabled = true;
        submitButton.disabled = true;
    }
}

setInterval(updateUI, 1000);