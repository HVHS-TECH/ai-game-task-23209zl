// Get the canvas element and its context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Define the game settings
const gridSize = 20;
const canvasSize = 400;
let snake = [{ x: 160, y: 160 }];
let food = { x: 0, y: 0 };
let dx = gridSize;
let dy = 0;
let score = 0;
let gameOver = false;
let snakeColor = "green";  // Default snake color
let isPaused = false;  // Game paused flag
let gameInterval;  // Store the game loop interval

// Game loop
function gameLoop() {
    if (gameOver) {
        alert("Game Over! Your score: " + score);
        resetGame();
        return;
    }

    if (!isPaused) {
        setTimeout(() => {
            clearCanvas();
            moveSnake();
            checkCollisions();
            drawFood();
            drawSnake();
            updateScore();
            gameLoop();
        }, 100); // 100ms to control game speed
    }
}

// Clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Move the snake
function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // If the snake eats the food, increase the score and generate new food
    if (head.x === food.x && head.y === food.y) {
        score++;
        spawnFood(); // Spawn new food when snake eats food
    } else {
        snake.pop(); // Remove last part of the snake
    }
}

// Check for collisions with walls or itself
function checkCollisions() {
    const head = snake[0];

    // Check if snake hits the wall
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        gameOver = true;
    }

    // Check if snake hits itself
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
        }
    }
}

// Draw the snake on the canvas
function drawSnake() {
    ctx.fillStyle = snakeColor;  // Use the current snake color
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x, snake[i].y, gridSize, gridSize);
    }
}

// Spawn food at a random location, ensuring it doesn't spawn on the snake
function spawnFood() {
    let valid = false;
    while (!valid) {
        food = {
            x: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize,
            y: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize,
        };
        valid = !isFoodOnSnake();
    }
}

// Check if food spawns on the snake
function isFoodOnSnake() {
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === food.x && snake[i].y === food.y) {
            return true; // Food is on the snake
        }
    }
    return false;
}

// Draw the food on the canvas
function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

// Update the score
function updateScore() {
    document.getElementById("score").textContent = "Score: " + score;
}

// Handle keyboard inputs for snake direction
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && dy === 0) {
        dx = 0;
        dy = -gridSize;
    } else if (event.key === "ArrowDown" && dy === 0) {
        dx = 0;
        dy = gridSize;
    } else if (event.key === "ArrowLeft" && dx === 0) {
        dx = -gridSize;
        dy = 0;
    } else if (event.key === "ArrowRight" && dx === 0) {
        dx = gridSize;
        dy = 0;
    }
});

// Reset the game
function resetGame() {
    snake = [{ x: 160, y: 160 }];
    food = { x: 0, y: 0 };
    dx = gridSize;
    dy = 0;
    score = 0;
    gameOver = false;
    spawnFood(); // Spawn food after reset
    gameLoop(); // Start game loop
}

// Start the game
spawnFood(); // Initial food spawn
gameLoop(); // Start the game loop

// Add event listener to the "Pause" button
document.getElementById("pauseButton").addEventListener("click", () => {
    isPaused = !isPaused; // Toggle pause state

    const button = document.getElementById("pauseButton");
    if (isPaused) {
        button.textContent = "Resume"; // Change button text to "Resume"
    } else {
        button.textContent = "Pause"; // Change button text to "Pause"
    }

    if (!isPaused) {
        gameLoop(); // Resume the game loop
    }
});

// Add event listener to the "Change Snake Color" button
document.getElementById("changeColorButton").addEventListener("click", () => {
    // Array of possible snake colors
    const colors = ["green", "blue", "purple", "orange", "yellow", "pink", "red"];
    // Randomly select a color from the array
    snakeColor = colors[Math.floor(Math.random() * colors.length)];
});
