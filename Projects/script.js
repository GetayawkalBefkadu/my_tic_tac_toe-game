//let us do the css part
// Define constants for the X and O classes
const X_CLASS = 'x';
const O_CLASS = 'o';

// Winning combinations that determine the winner
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Select all necessary elements from the HTML
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageElement = document.getElementById('winningMessage');
const restartButton = document.getElementById('restartButton');
const restartButton2 = document.getElementById('restartButton2');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');

// Variable to track the current turn (true for O, false for X)
let oTurn;

// Call the startGame function to initialize the game
startGame();

// Add event listeners to the restart buttons to reset the game when clicked
restartButton.addEventListener('click', startGame);
restartButton2.addEventListener('click', startGame);

/**
 * Initializes the game by clearing the board and setting the initial state.
 */
function startGame() {
    oTurn = false; // X starts first
    // Remove all classes and event listeners from cells
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS); // Remove X class
        cell.classList.remove(O_CLASS); // Remove O class
        cell.removeEventListener('click', handleClick); // Remove previous click listener
        cell.addEventListener('click', handleClick, { once: true }); // Add new click listener
    });
    setBoardHoverClass(); // Set the hover class for the board
    winningMessageElement.classList.remove('show'); // Hide the winning message
}

/**
 * Handles click events on the cells.
 * Places the mark, checks for a win or draw, and swaps turns.
 * @param {Event} e - The click event.
 */
function handleClick(e) {
    const cell = e.target;
    const currentClass = oTurn ? O_CLASS : X_CLASS; // Set class based on turn
    placeMark(cell, currentClass); // Place the mark in the cell

    // Check for a win or draw, and end the game accordingly
    if (checkWin(currentClass)) {
        endGame(false); // False indicates a win
    } else if (isDraw()) {
        endGame(true); // True indicates a draw
    } else {
        swapTurns(); // Swap turns if no win or draw
        setBoardHoverClass(); // Update board hover class
    }
}

/**
 * Ends the game and displays the appropriate message based on the result.
 * @param {boolean} draw - Indicates if the game ended in a draw.
 */
function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = '🤝 አስተናግዷል!'; // Draw message with emoji
    } else {
        winningMessageTextElement.innerText = `${oTurn ? "⭕ O አሸንፏል!" : "❌ X አሸንፏል!"}`; // Winning message with emojis
    }
    winningMessageElement.classList.add('show'); // Show the winning message
}

/**
 * Checks if the game is a draw (all cells filled with no winner).
 * @returns {boolean} True if it's a draw, false otherwise.
 */
function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

/**
 * Places the mark (X or O) in the specified cell.
 * @param {Element} cell - The cell where the mark will be placed.
 * @param {string} currentClass - The class representing X or O.
 */
function placeMark(cell, currentClass) {
    cell.classList.add(currentClass); // Add class to the cell
}

/**
 * Swaps turns between X and O.
 */
function swapTurns() {
    oTurn = !oTurn; // Toggle the turn
}

/**
 * Sets the hover class on the board based on whose turn it is.
 */
function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);
    if (oTurn) {
        board.classList.add(O_CLASS); // Add hover effect for O's turn
    } else {
        board.classList.add(X_CLASS); // Add hover effect for X's turn
    }
}

/**
 * Checks if the current player has won based on the winning combinations.
 * @param {string} currentClass - The class representing X or O.
 * @returns {boolean} True if the player has won, false otherwise.
 */
function checkWin(currentClass) {
    // Check if any winning combination has all cells with the current class
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}
