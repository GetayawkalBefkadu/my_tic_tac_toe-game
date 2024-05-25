// Constants for X and O classes
const X_CLASS = 'x';
const O_CLASS = 'o';

// Winning combinations
const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Selecting all cells and necessary elements
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageElement = document.getElementById('winningMessage');
const restartButtons = document.getElementsByClassName('restart-button'); // Changed to class
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
const startButton = document.getElementById('startButton');
const gameSection = document.querySelector('.game-section');
const welcomeSection = document.querySelector('.welcome-section');
let oTurn; // Variable to track whose turn it is

// Start the game
startGame();

// Event listeners for start and restart buttons
startButton.addEventListener('click', () => {
    welcomeSection.style.display = 'none';
    gameSection.style.display = 'block';
});

for (let button of restartButtons) {
    button.addEventListener('click', startGame);
}

function startGame() {
    oTurn = false; // X goes first
    // Clear the board
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS, O_CLASS); // Removed duplicate removals
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
    winningMessageElement.classList.remove('show');
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = oTurn? O_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
        if (!oTurn) aiMove(); // AI move for "O" only if it's not O's turn
    }
}

function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = 'አስተናግዷል'; // Draw message
    } else {
        winningMessageTextElement.innerText = `${oTurn? "O አሸንፏል!" : "X አሸንፏል!"}`; // Winning message
    }
    winningMessageElement.classList.add('show');
}

function isDraw() {
    return [...cellElements].every(cell => cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS));
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass, currentClass === X_CLASS? 'x' : 'o');
}

function swapTurns() {
    oTurn =!oTurn;
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS, O_CLASS); // Removed duplicate removals
    if (oTurn) {
        board.classList.add(O_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => combination.every(index => cellElements[index].classList.contains(currentClass)));
}

function aiMove() {
    const emptyCells = [...cellElements].filter(cell =>!cell.classList.contains(X_CLASS) &&!cell.classList.contains(O_CLASS));
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const selectedCell = emptyCells[randomIndex];
    setTimeout(() => {
        placeMark(selectedCell, O_CLASS);
        if (checkWin(O_CLASS)) {
            endGame(false);
        } else if (isDraw()) {
            endGame(true);
        } else {
            swapTurns();
            setBoardHoverClass();
        }
    }, 1000); // Simulate delay for AI move
}
