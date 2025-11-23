let gameArea = document.getElementById('gameArea');
let basket = document.getElementById('basket');
let scoreDisplay = document.getElementById('score');
let livesDisplay = document.getElementById('lives');
let startGameButton = document.getElementById('startGame');

let score = 0;
let lives = 3;
let gameInterval;
let objectSpeed = 2000; // Initial speed of falling objects

// Function to start the game
function startGame() {
    score = 0;
    lives = 3;
    objectSpeed = 2000;
    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;

    // Clear the game area
    gameArea.innerHTML = '<div id="basket"></div>'; // Reset game area
    basket = document.getElementById('basket'); // Re-select basket
    basket.style.left = '50%';
    basket.style.transform = 'translateX(-50%)';

    // Start spawning objects
    gameInterval = setInterval(spawnObject, objectSpeed);
    startGameButton.disabled = true;
}

// Function to spawn an object
function spawnObject() {
    const object = document.createElement('div');
    object.classList.add('object');
    object.style.left = Math.random() * (gameArea.clientWidth - 30) + 'px';
    gameArea.appendChild(object);

    let fallInterval = setInterval(() => {
        object.style.top = (object.offsetTop + 5) + 'px';

        // Check for collision with basket
        if (isCaught(object)) {
            score++;
            scoreDisplay.textContent = score;
            clearInterval(fallInterval);
            gameArea.removeChild(object);
        }

        // Check if object falls past the basket
        if (object.offsetTop > gameArea.clientHeight) {
            clearInterval(fallInterval);
            gameArea.removeChild(object);
            loseLife();
        }
    }, 20);
}

// Function to check if an object is caught by the basket
function isCaught(object) {
    const objectRect = object.getBoundingClientRect();
    const basketRect = basket.getBoundingClientRect();
    return (
        objectRect.bottom >= basketRect.top &&
        objectRect.left + objectRect.width >= basketRect.left &&
        objectRect.left <= basketRect.left + basketRect.width
    );
}

// Function to lose a life
function loseLife() {
    lives--;
    livesDisplay.textContent = lives;
    if (lives === 0) {
        endGame();
    }
}

// Function to end the game
function endGame() {
    clearInterval(gameInterval);
    startGameButton.disabled = false;
    alert(`Game Over! Your final score: ${score}`);
}

// Control the basket with arrow keys
document.addEventListener('keydown', (event) => {
    const basketRect = basket.getBoundingClientRect();
    const gameAreaRect = gameArea.getBoundingClientRect();
    const basketWidth = 100; // Width of the basket

    if (event.key === 'ArrowLeft' && basketRect.left > gameAreaRect.left) {
        basket.style.left = (basketRect.left - 20) + 'px'; // Move left
    } else if (event.key === 'ArrowRight' && basketRect.right < gameAreaRect.right) {
        basket.style.left = (basketRect.left + 20) + 'px'; // Move right
    }

    // Ensure the basket stays within the bounds of the game area
    if (basketRect.left < gameAreaRect.left) {
        basket.style.left = gameAreaRect.left + 'px'; // Prevent moving left out of bounds
    } else if (basketRect.right > gameAreaRect.right) {
        basket.style.left = (gameAreaRect.right - basketWidth) + 'px'; // Prevent moving right out of bounds
    }
});

// Start the game when the button is clicked
startGameButton.addEventListener('click', startGame);