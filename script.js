// Game Variables
const images = [
    { src: "images/image1.jpg", answer: "orange" },
    { src: "images/image2.jpg", answer: "bee" },
    { src: "images/image3.jpg", answer: "guitar" },
    { src: "images/image4.jpg", answer: "coffee" },
    { src: "images/image5.jpg", answer: "measuring tape" }
]; // Add as many images as you like

let currentImageIndex = 0;
const MAX_ZOOM_LEVEL = 5;
let zoomLevel = MAX_ZOOM_LEVEL; // Initial zoom level of 3 (zoomed in)
const ZOOM_FACTOR = 1;
let teamAScore = 0;
let teamBScore = 0;
let currentTeam = 'A';

const imageElem = document.getElementById('image');
const zoomOutButton = document.getElementById('zoomOutButton');
const guessInput = document.getElementById('guessInput');
const submitGuessButton = document.getElementById('submitGuessButton');
const messageElem = document.getElementById('message');
const pointsValueElem = document.getElementById('pointsValue');
const scoreAElem = document.getElementById('scoreA');
const scoreBElem = document.getElementById('scoreB');
const currentTeamElem = document.getElementById('currentTeam');

// Set the initial image
loadImage();

// Load the current image based on the index
function loadImage() {
    imageElem.src = images[currentImageIndex].src;
    zoomLevel = MAX_ZOOM_LEVEL; // Reset the zoom level
    imageElem.style.transform = `scale(${zoomLevel})`; // Apply zoom
    updatePointsIndicator();
    guessInput.value = ''; // Clear the guess input
    messageElem.textContent = ''; // Clear messages
}

// Update points indicator
function updatePointsIndicator() {
    const points = zoomLevel / ZOOM_FACTOR;
    pointsValueElem.textContent = points;
}

// Check guess
function checkGuess() {
    const guess = guessInput.value.toLowerCase();
    const correctAnswer = images[currentImageIndex].answer; // Get the correct answer

    if (guess === correctAnswer) {
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

    } else {
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
            messageElem.textContent = 'Incorrect, try zooming out and guess again!';
        }
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

// Set team's turn display at the start
currentTeamElem.textContent = `Team ${currentTeam}'s Turn`;

zoomOutButton.addEventListener('click', zoomOut);
submitGuessButton.addEventListener('click', checkGuess);