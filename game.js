// Load JSON data
let obstacles = [];
let collectibles = [];
let player;
let score = 0;

// Set up the canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Fetch objects from the JSON files
fetch('objects.json')
  .then(response => response.json())
  .then(data => {
    obstacles = data.map(obj => new GameObject(obj));
  });

fetch('collectibles.json')
  .then(response => response.json())
  .then(data => {
    collectibles = data.map(item => new Collectible(item));
  });

// Create the player object
class Player {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = 5;
  }

  move() {
    if (keys.ArrowLeft) this.x -= this.speed;
    if (keys.ArrowRight) this.x += this.speed;
    if (keys.ArrowUp) this.y -= this.speed;
    if (keys.ArrowDown) this.y += this.speed;
  }

  checkCollision(obj) {
    return this.x < obj.x + obj.width &&
      this.x + this.width > obj.x &&
      this.y < obj.y + obj.height &&
      this.y + this.height > obj.y;
  }
}

class GameObject {
  constructor({ x, y, width, height, type }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
  }

  draw() {
    ctx.fillStyle = this.type === "obstacle" ? "red" : "blue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Collectible {
  constructor({ x, y, width, height }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

// Handle player input
let keys = {};

window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// Initialize player
player = new Player(50, 50, 30, 30);

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Move player and check for collisions
  player.move();

  // Check for collision with obstacles
  obstacles.forEach(obj => {
    if (player.checkCollision(obj)) {
      // Handle collision (e.g., stop movement or reset position)
      console.log("Player collided with an obstacle!");
    }
    obj.draw();
  });

  // Check for collision with collectibles
  collectibles.forEach((collectible, index) => {
    if (player.checkCollision(collectible)) {
      collectibles.splice(index, 1); // Remove the collectible
      score++;
      console.log("Collectible picked up! Score: " + score);
    }
    collectible.draw();
  });

  // Draw the player
  ctx.fillStyle = "green";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Display the score
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 20);

  // Call the game loop again
  requestAnimationFrame(gameLoop);
}

gameLoop();
