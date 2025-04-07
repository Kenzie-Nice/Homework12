const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Score
let score = 0;

// Display score
function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
}

// Player class
class Player {
    constructor(x, y, size, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
    }

    move() {
        let newX = this.x;
        let newY = this.y;

        if (keys.ArrowLeft) newX -= this.speed;
        if (keys.ArrowRight) newX += this.speed;
        if (keys.ArrowUp) newY -= this.speed;
        if (keys.ArrowDown) newY += this.speed;

        if (!this.checkCollision(newX, newY)) {
            this.x = newX;
            this.y = newY;
        }
    }

    checkCollision(x, y) {
        return obstacles.some(obstacle =>
            x < obstacle.x + obstacle.width &&
            x + this.size > obstacle.x &&
            y < obstacle.y + obstacle.height &&
            y + this.size > obstacle.y
        );
    }

    draw() {
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

// Obstacle class
class Obstacle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Global Variables
let player = new Player(50, 50, 30, 5);
let obstacles = [];
let keys = {};

// Load obstacles from JSON
fetch('objects.json')
    .then(response => response.json())
    .then(data => {
        obstacles = data.map(obj => new Obstacle(obj.x, obj.y, obj.width, obj.height));
        console.log("Obstacles loaded:", obstacles);  // ✅ Debug log
    })
    .catch(error => console.error("Error loading JSON:", error));

// Key Listeners
window.addEventListener("keydown", (e) => keys[e.key] = true);
window.addEventListener("keyup", (e) => keys[e.key] = false);

// Game Loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.move();
    player.draw();

    obstacles.forEach(obstacle => obstacle.draw());

    drawScore(); // ✅ Keeps the score displayed

    requestAnimationFrame(gameLoop);
}

// Start Game
gameLoop();
