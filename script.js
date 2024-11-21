// Game Variables
const images = [
    // { id: 1, src: "images/image1.jpg", answer: "strawberry" },
    // { id: 2, src: "images/image2.jpg", answer: "fly" },
    // { id: 3, src: "images/image3.jpg", answer: "turtle" },
    // { id: 4, src: "images/image4.jpg", answer: "coffee beans" },
    // { id: 5, src: "images/image5.jpg", answer: "measuring tape" },
    // { id: 6, src: "images/image6.jpg", answer: "moss" },
    // { id: 7, src: "images/image7.jpg", answer: "nail clipper" }, // needs work
    // { id: 8, src: "images/image8.jpg", answer: "coin" }, // needs work
    // { id: 9, src: "images/image9.jpg", answer: "chocolate" },
    // { id: 10, src: "images/image10.jpg", answer: "onion" },
    // { id: 11, src: "images/image11.jpg", answer: "dandelion" },
    // { id: 12, src: "images/image12.jpg", answer: "egg" },
    // { id: 13, src: "images/image13.jpg", answer: "cuttlery" },
    // { id: 14, src: "images/image14.jpg", answer: "sunflower" }, // needs work
    // { id: 15, src: "images/image15.jpg", answer: "pinata" }, // needs work
    // { id: 16, src: "images/image16.jpg", answer: "hard drive" }, // needs work
    // { id: 17, src: "images/image17.jpg", answer: "watch" },
    // { id: 18, src: "images/image18.jpg", answer: "ginger" },
    // { id: 19, src: "images/image19.jpg", answer: "grasshopper" }, // needs work
    // { id: 20, src: "images/image20.jpg", answer: "legos" },
    // { id: 21, src: "images/image21.jpg", answer: "matchstick" },
    // { id: 22, src: "images/image22.jpg", answer: "badminton" },
    // { id: 23, src: "images/image23.jpg", answer: "basketball hoop" },
    // { id: 24, src: "images/image24.jpg", answer: "cat iris" }, // needs work
    // { id: 25, src: "images/image25.jpg", answer: "rose" },
    // { id: 26, src: "images/image26.jpg", answer: "monkey" },
    // { id: 27, src: "images/image27.jpg", answer: "oats" },
    // { id: 28, src: "images/image28.jpg", answer: "bike wheel" },
    // { id: 29, src: "images/image29.jpg", answer: "cockatoo" },
    // { id: 30, src: "images/image30.jpg", answer: "lion" },
    // { id: 31, src: "images/image31.jpg", answer: "speaker" },
    // { id: 32, src: "images/image32.jpg", answer: "mushroom" },
    { id: 33, src: "images/image33.jpg", answer: "kiwi" },
    { id: 34, src: "images/image34.jpg", answer: "candle" },
    { id: 35, src: "images/image35.jpg", answer: "tennis ball" },
    { id: 36, src: "images/image36.jpg", answer: "chain" },
    { id: 37, src: "images/image37.jpg", answer: "newspaper" },
    { id: 38, src: "images/image38.jpg", answer: "microscope" },
    { id: 39, src: "images/image39.jpg", answer: "koala bear" },

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
const currentTeamElem = document.getElementById('currentTeam');
const playerInput = document.getElementById('playerInput');
const addPlayerButton = document.getElementById('addPlayerButton');
const randomizeTeamsButton = document.getElementById('randomizeTeamsButton');
const teamAPlayersElem = document.getElementById('teamAPlayers');
const teamBPlayersElem = document.getElementById('teamBPlayers');
const timerDisplay = document.getElementById('timerValue');


function startGame() {
    playerManagementContainer.style = "display:none";
    imageContainer.style = "display:block";
    shuffleImages();
    // Set the initial image
    loadImage();
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
        messageElem.textContent = 'All images have been used!';
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
        clearInterval(timer);
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
            clearInterval(timer);
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
    // loadImage(); // Load the first image
});

// Set team's turn display at the start
currentTeamElem.textContent = `Team ${currentTeam}'s Turn`;

startGameButton.addEventListener('click', startGame);
correctButton.addEventListener('click', handleCorrectGuess);
wrongButton.addEventListener('click', handleWrongGuess);