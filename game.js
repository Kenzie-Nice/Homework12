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

// Collectible class
class Collectible {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.collected = false;
    }

    draw() {
        if (!this.collected) {
            ctx.fillStyle = "blue"; // Collectibles are blue
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    checkCollision(player) {
        if (!this.collected) {
            const distX = Math.abs(player.x + player.size / 2 - (this.x + this.width / 2));
            const distY = Math.abs(player.y + player.size / 2 - (this.y + this.height / 2));
            if (distX <= (player.size / 2 + this.width / 2) && distY <= (player.size / 2 + this.height / 2)) {
                this.collected = true;
                score += 10; // Increment score
            }
        }
    }
}

// Global Variables
let player = new Player(100, 100, 30, 5); // Player starts at position (100, 100)
let obstacles = [];
let collectibles = [];
let keys = {}; // For tracking key presses

// Load obstacles and collectibles from JSON files
Promise.all([
