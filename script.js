// Game Variables
const images = [
    { src: "images/image1.jpg", answer: "orange" },
    { src: "images/image2.jpg", answer: "bee" },
    { src: "images/image3.jpg", answer: "guitar" },
    { src: "images/image4.jpg", answer: "coffee" },
    { src: "images/image5.jpg", answer: "measuring tape" },
    { src: "images/image6.jpg", answer: "moss" },
]; // Add as many images as you like

let currentImageIndex = 0;
const MAX_ZOOM_LEVEL = 5;
let zoomLevel = MAX_ZOOM_LEVEL; // Initial zoom level of 3 (zoomed in)
const ZOOM_FACTOR = 1;
let teamAScore = 0;
let teamBScore = 0;
let currentTeam = 'A';
let players = []; // Array to hold player names
let teamAPlayers = [];
let teamBPlayers = [];

const playersElem = document.getElementById('players');

const imageElem = document.getElementById('image');
const correctButton = document.getElementById('correctButton');
const wrongButton = document.getElementById('wrongButton');
const messageElem = document.getElementById('message');
const pointsValueElem = document.getElementById('pointsValue');
const scoreAElem = document.getElementById('scoreA');
const scoreBElem = document.getElementById('scoreB');
const currentTeamElem = document.getElementById('currentTeam');
const playerInput = document.getElementById('playerInput');
const addPlayerButton = document.getElementById('addPlayerButton');
const randomizeTeamsButton = document.getElementById('randomizeTeamsButton');
const teamAPlayersElem = document.getElementById('teamAPlayers');
const teamBPlayersElem = document.getElementById('teamBPlayers');

// Set the initial image
loadImage();

// Load the current image based on the index
function loadImage() {
    imageElem.src = images[currentImageIndex].src;
    zoomLevel = MAX_ZOOM_LEVEL; // Reset the zoom level
    imageElem.style.transform = `scale(${zoomLevel})`; // Apply zoom
    updatePointsIndicator();
    messageElem.textContent = ''; // Clear messages
}

// Update points indicator
function updatePointsIndicator() {
    const points = zoomLevel / ZOOM_FACTOR;
    pointsValueElem.textContent = points;
}

// Handle correct guess
function handleCorrectGuess() {
    const points = zoomLevel / ZOOM_FACTOR; // Points system based on zoom level
    if (currentTeam === 'A') {
        teamAScore += points;
        scoreAElem.textContent = teamAScore;
        currentTeam = 'B'; // Switch to Team B
    } else {
        teamBScore += points;
        scoreBElem.textContent = teamBScore;
        currentTeam = 'A'; // Switch to Team A
    }
    currentTeamElem.textContent = `Team ${currentTeam}'s Turn`; // Update current turn display
    messageElem.textContent = `Correct! Team ${currentTeam === 'A' ? 'B' : 'A'} gets ${points} points.`;

    if (currentImageIndex !== images.length - 1) {
        currentImageIndex = (currentImageIndex + 1) % images.length; // Change to next image
        loadImage(); // Load next image
    } else {
        alert("Game over!")
    }
}

// Handle wrong guess
function handleWrongGuess() {
    if (zoomLevel === ZOOM_FACTOR) {
        messageElem.textContent = 'Maximum zoom reached. Switching turns!';
        currentTeam = (currentTeam === 'A') ? 'B' : 'A'; // Switch turns
        currentTeamElem.textContent = `Team ${currentTeam}'s Turn`; // Update current turn display

        if (currentImageIndex !== images.length - 1) {
            currentImageIndex = (currentImageIndex + 1) % images.length; // Change to next image
            loadImage(); // Load next image
        } else {
            alert("Game over!")
        }

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

// Randomize players into two teams
randomizeTeamsButton.addEventListener('click', () => {
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
    teamAPlayersElem.textContent = `${teamAPlayers.join(", ")} (${teamAPlayers.length})`;
    teamBPlayersElem.textContent = `${teamBPlayers.join(", ")} (${teamBPlayers.length})`;

    // Initialize scores and other game states
    teamAScore = 0;
    teamBScore = 0;
    scoreAElem.textContent = teamAScore;
    scoreBElem.textContent = teamBScore;
    currentTeam = 'A';
    currentTeamElem.textContent = `Team A's Turn`;
    loadImage(); // Load the first image
});

// Set team's turn display at the start
currentTeamElem.textContent = `Team ${currentTeam}'s Turn`;

correctButton.addEventListener('click', handleCorrectGuess);
wrongButton.addEventListener('click', handleWrongGuess);