// Game configuration and state variables
const GOAL_CANS = 20;        // Total items needed to collect

const winMessages = [
    "Amazing! You reached the clean water goal!",
    "Great job! Every drop makes a difference!",
    "You did it! Clean water for everyone!"
];

const loseMessages = [
    "Good effort! Try again to reach the goal!",
    "Every drop counts! Give it another try!",
    "Almost there! Keep collecting water!"
];

let currentCans = 0;         // Current number of items collected
let gameActive = false;      // Tracks if game is currently running
let spawnInterval;          // Holds the interval for spawning items
let lastCellIndex = -1;
let timeLeft = 30;
let timerInterval;

// Creates the 3x3 game grid where items will appear
function createGrid() {
  const grid = document.querySelector('.game-grid');
  grid.innerHTML = ''; // Clear any existing grid cells
  for (let i = 0; i < 9; i++) {
    
  const cell = document.createElement('div');
  cell.className = 'grid-cell';

  cell.addEventListener('click', function(event) {
      if (!gameActive) return;

      // Clicking an empty cell reduces the score
      if (!cell.querySelector('.water-can')) {
          currentCans = Math.max(0, currentCans - 1);
          document.getElementById('current-cans').textContent = currentCans;
    }
});

grid.appendChild(cell);

  }
}

// Ensure the grid is created when the page loads
createGrid();

// Spawns a new item in a random grid cell
function spawnWaterCan() {
  if (!gameActive) return; // Stop if the game is not active
  const cells = document.querySelectorAll('.grid-cell');
  
  // Clear all cells before spawning a new water can
  cells.forEach(cell => (cell.innerHTML = ''));

  // Select a random cell from the grid to place the water can
  
let randomIndex;

do {
    randomIndex = Math.floor(Math.random() * cells.length);
} while (randomIndex === lastCellIndex);

lastCellIndex = randomIndex;

const randomCell = cells[randomIndex];


  // Use a template literal to create the wrapper and water-can element
  randomCell.innerHTML = `
    <div class="water-can-wrapper">
      <div class="water-can"></div>
    </div>
  `;
  
  const waterCan = randomCell.querySelector('.water-can');

  waterCan.addEventListener('click', function(event) {
    event.stopPropagation();
      if (!gameActive) return;

      currentCans++;
      document.getElementById('current-cans').textContent = currentCans;

      randomCell.innerHTML = '';
});

}

// Initializes and starts a new game

function startGame() {
    if (gameActive) return;

    gameActive = true;
    currentCans = 0;
    timeLeft = 30;
    lastCellIndex = -1;
    document.getElementById('game-message').textContent = '';
    document.getElementById('confetti-container').innerHTML = '';
    document.getElementById('current-cans').textContent = currentCans;
    document.getElementById('timer').textContent = timeLeft;

    createGrid();
    spawnWaterCan();

    spawnInterval = setInterval(spawnWaterCan, 1000);

    timerInterval = setInterval(function() {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function celebrateWin() {
    const container = document.getElementById('confetti-container');
    container.innerHTML = '';

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';

        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.backgroundColor =
            ['#FFC907', '#2E9DF7', '#8BD1CB', '#FFFFFF'][Math.floor(Math.random() * 4)];

        container.appendChild(confetti);
    }
}

function endGame() {
    gameActive = false;

    clearInterval(spawnInterval);
    clearInterval(timerInterval);

    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.innerHTML = '';
    });

    let message;

    if (currentCans >= GOAL_CANS) {
        console.log("Victory! Starting confetti animation.");
        celebrateWin();
        
        const randomIndex = Math.floor(Math.random() * winMessages.length);
        message = winMessages[randomIndex];
    } else {
        const randomIndex = Math.floor(Math.random() * loseMessages.length);
        message = loseMessages[randomIndex];
    }

    document.getElementById('game-message').textContent = message;
}

function resetGame() {
    gameActive = false;

    clearInterval(spawnInterval);
    clearInterval(timerInterval);

    startGame();
}
// Set up click handler for the start and reset button
document.getElementById('start-game').addEventListener('click', startGame);

document.getElementById('reset-game').addEventListener('click', resetGame);