// Game Variables
let currentImageIndex = 0;
const MAX_ZOOM_LEVEL = 5;
let zoomLevel = MAX_ZOOM_LEVEL; // Initial zoom level of 3 (zoomed in)
const ZOOM_FACTOR = 1;
let teamAScore = 0;
let teamBScore = 0;
let currentTeam = '';
let players = []; // Array to hold player names
let teamAPlayers = [];
let teamBPlayers = [];

let timer; // Timer variable
const TIMER_DURATION = 20; // duration in seconds

const playerManagementContainer = document.getElementById('player-management');
const imageContainer = document.getElementById('image-container');

const startGameButton = document.getElementById('startGameButton');
const playersElem = document.getElementById('players');
const imageElem = document.getElementById('image');
const correctButton = document.getElementById('correctButton');
const wrongButton = document.getElementById('wrongButton');
const messageElem = document.getElementById('message');
const pointsValueElem = document.getElementById('pointsValue');
const scoreAElem = document.getElementById('scoreA');
const scoreBElem = document.getElementById('scoreB');
const playerInput = document.getElementById('playerInput');
const addPlayerButton = document.getElementById('addPlayerButton');
const randomizeTeamsButton = document.getElementById('randomizeTeamsButton');
const teamAElem = document.getElementById('teamA');
const teamBElem = document.getElementById('teamB');
const teamAPlayersElem = document.getElementById('teamAPlayers');
const teamBPlayersElem = document.getElementById('teamBPlayers');
const timerDisplay = document.getElementById('timerValue');
const overlay = document.getElementById('overlay');
const fullImage = document.getElementById('fullImage');
const answerText = document.getElementById('answerText');
const nextImageButton = document.getElementById('nextImageButton');
const restartGameButton = document.getElementById('restartGameButton');
const gameOverOverlay = document.getElementById('gameOverOverlay');


function startGame() {

    if (players.length < 2 ) {
        alert("Please add at least two players.");
        return;
    }

    if (!teamsRandomized)
        randomizeTeams()

    playerManagementContainer.style = "display:none";
    imageContainer.style = "display:block";
    
    shuffleImages();

    // Set the initial image
    loadImage();

    changeTeam();

}

let shuffledImages = []; // Array to hold shuffled images

// Shuffle the images array
function shuffleImages() {
    shuffledImages = images.slice(); // Create a copy of the images array
    // Fisher-Yates shuffle algorithm
    for (let i = shuffledImages.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledImages[i], shuffledImages[j]] = [shuffledImages[j], shuffledImages[i]];
    }
}

// Load the current image based on the index
function loadImage() {
    
    if (currentImageIndex >= shuffledImages.length) {
        return; // Stop loading images if all have been used
    }

    const currentImage = shuffledImages[currentImageIndex];
    imageElem.src = currentImage.src;
    console.log(`${Date.now()} : ${currentImage.answer}`);
    zoomLevel = MAX_ZOOM_LEVEL; // Reset the zoom level
    imageElem.style.transform = `scale(${zoomLevel})`; // Apply zoom
    updatePointsIndicator();
    resetTimer(); // Start/reset the timer
    messageElem.textContent = ''; // Clear messages
}

function showGameOverOverlay() {

    clearInterval(timer); // Stop the timer if it's running
    
    // All images have been used, end the game
    let winningTeam = '';
    if (teamAScore > teamBScore) {
        winningTeam = 'Team A Wins!';
    } else if (teamBScore > teamAScore) {
        winningTeam = 'Team B Wins!';
    } else {
        winningTeam = 'It\'s a Tie!';
    }

    document.getElementById('winningTeam').textContent = winningTeam; // Set winning team
    gameOverOverlay.style.display = 'flex'; // Show overlay

}

// Event listener for the Restart Game button
restartGameButton.addEventListener('click', () => {
    resetGame();
    startGame();
});

function resetGame() {

    currentImageIndex = 0;
    currentTeam = '';
    teamAScore = 0;
    teamBScore = 0;
    scoreAElem.textContent = teamAScore;
    scoreBElem.textContent = teamBScore;
    messageElem.textContent = '';
    overlay.style.display = 'none'; // Hide overlays
    gameOverOverlay.style.display = 'none'; // Hide the game over overlay

}

// Update points indicator
function updatePointsIndicator() {
    const points = zoomLevel / ZOOM_FACTOR;
    pointsValueElem.textContent = points;
}

// Handle timer countdown
function startTimer() {
    let timeRemaining = TIMER_DURATION;
    timerDisplay.textContent = timeRemaining;

    timer = setInterval(() => {
        timeRemaining--;
        timerDisplay.textContent = timeRemaining;

        if (timeRemaining <= 0) {
            clearInterval(timer);
            handleWrongGuess(); // Automatically handle as wrong guess
        }
    }, 1000);
}

// Reset timer function
function resetTimer() {
    clearInterval(timer); // Clear the previous timer
    startTimer(); // Start a new timer
}

// Show overlay with full image and answer
function showOverlay() {
    const currentImage = shuffledImages[currentImageIndex];
    fullImage.src = currentImage.src; // Set full size image
    answerText.textContent = `Answer: ${currentImage.answer}`; // Display the answer
    overlay.style.display = 'flex'; // Show overlay
}

// Hide overlay and load next image
nextImageButton.addEventListener('click', () => {

    overlay.style.display = 'none'; // Hide overlay

    if (currentImageIndex !== images.length - 1) {
        changeTeam();
        currentImageIndex = (currentImageIndex + 1) % images.length; // Change to next image
        loadImage(); // Load next image
    } else {
        showGameOverOverlay();
    }

});

function changeTeam() {

    if (currentTeam === 'A') {
        currentTeam = 'B'; // Switch to Team B

        // Apply styling to the switched teams
        teamBElem.style.fontSize = '20px';
        teamBElem.style.color = 'white';
        teamBElem.style.backgroundColor = 'green';

        teamAElem.style.fontSize = '';
        teamAElem.style.color = 'black';
        teamAElem.style.backgroundColor = 'white';

    } else {
        currentTeam = 'A'; // Switch to Team A

        // Apply styling to the switched teams
        teamAElem.style.fontSize = '20px';
        teamAElem.style.color = 'white';
        teamAElem.style.backgroundColor = 'green';

        teamBElem.style.fontSize = '';
        teamBElem.style.color = 'black';
        teamBElem.style.backgroundColor = 'white';

    }

}

// Handle correct guess
function handleCorrectGuess() {

    const points = zoomLevel / ZOOM_FACTOR; // Points system based on zoom level

    if (currentTeam === 'A') {

        teamAScore += points;
        scoreAElem.textContent = teamAScore;

    } else {

        teamBScore += points;
        scoreBElem.textContent = teamBScore;

    }

    messageElem.textContent = `Correct! Team ${currentTeam === 'A' ? 'B' : 'A'} gets ${points} points.`;

    showOverlay(); // Show overlay on right guess

}

// Handle wrong guess
function handleWrongGuess() {
    if (zoomLevel === ZOOM_FACTOR) {

        messageElem.textContent = 'Maximum zoom reached. Switching turns!';
        showOverlay(); // Show overlay on wrong guess

    } else {

        zoomOut()
        messageElem.textContent = 'Incorrect, try zooming out and guess again!';

    }
}

// Zoom out the image
function zoomOut() {
    if (zoomLevel > ZOOM_FACTOR) {
        zoomLevel -= ZOOM_FACTOR; // Decrease zoom level
        imageElem.style.transform = `scale(${zoomLevel})`;
        updatePointsIndicator(); // Update points available
        resetTimer();
    } else {
        messageElem.textContent = "Maximum zoom level reached!";
    }
}

// Add player to the list
addPlayerButton.addEventListener('click', () => {
    const playerName = playerInput.value.trim();
    if (playerName) {
        players.push(playerName);
        playerInput.value = ''; // Clear input field
        playersElem.textContent = `${players.join(", ")} (${players.length})`;
    }
});

var teamsRandomized = false;
function randomizeTeams() {

    if (players.length < 2) {
        alert("Please add at least two players.");
        return;
    }

    // Shuffle players
    players.sort(() => Math.random() - 0.5);
    const mid = Math.ceil(players.length / 2);
    teamAPlayers = players.slice(0, mid);
    teamBPlayers = players.slice(mid);

    // Display team members
    teamAPlayersElem.innerHTML = `<p>${teamAPlayers.join("<br/>")}</p>`;
    document.getElementById("teamAPlayersCount").textContent = teamAPlayers.length;

    teamBPlayersElem.innerHTML = `<p>${teamBPlayers.join("<br/>")}</p>`;
    document.getElementById("teamBPlayersCount").textContent = teamBPlayers.length;

    teamsRandomized = true;

}

// Randomize players into two teams
randomizeTeamsButton.addEventListener('click', randomizeTeams);

startGameButton.addEventListener('click', startGame);
correctButton.addEventListener('click', handleCorrectGuess);
wrongButton.addEventListener('click', handleWrongGuess);