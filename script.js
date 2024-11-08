// Get all card elements and store them in an array
const cards = Array.from(document.querySelectorAll('.card')); 

// Select the timer element from the DOM
const timerElement = document.querySelector('.timer');

// Select the win modal and time display elements
const modal = document.getElementById('winModal');
const winTimeElement = document.querySelector('.win-time');

// Initialize game variables
let flippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchedPairs = 0;
let timer;
let seconds = 0;

// Function to start the timer and update the time on the screen
function startTimer() {
    timer = setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const displaySeconds = seconds % 60;
        // Display the current time in minutes and seconds format
        timerElement.textContent = `Time: ${minutes}:${displaySeconds < 10 ? '0' : ''}${displaySeconds}`;
    }, 1000);
}

// Function to stop the timer when the game ends
function stopTimer() {
    clearInterval(timer);
}

// Function to flip a card and check if two cards are flipped
function flipCard() {
    // Prevent action if board is locked or the same card is clicked twice
    if (lockBoard) return;
    if (this === firstCard) return;

    // Flip the card and remove the hidden class
    this.classList.add('flipped');
    this.classList.remove('hidden');

    // If it's the first card, just remember it
    if (!flippedCard) {
        flippedCard = true;
        firstCard = this;
        return;
    }

    // If it's the second card, check for a match
    secondCard = this;
    checkForMatch();
}

// Function to check if the two flipped cards match
function checkForMatch() {
    // Check if both cards have the same data attribute
    let isMatch = firstCard.dataset.card === secondCard.dataset.card;
    // If they match, disable them, otherwise unflip them
    isMatch ? disableCards() : unflipCards();
}

// Function to disable matched cards and increment matched pairs count
function disableCards() {
    // Remove the click event listeners to prevent further flipping
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    matchedPairs++;

    // If all pairs are matched, show the win modal
    if (matchedPairs === 8) {
        setTimeout(showWinModal, 500);
    }

    // Reset the board for the next set of flipped cards
    resetBoard();
}

// Function to unflip cards if they do not match
function unflipCards() {
    lockBoard = true; // Lock the board to prevent further flips

    setTimeout(() => {
        // Remove flipped class and add hidden class again
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.classList.add('hidden');
        secondCard.classList.add('hidden');
        
        // Reset the board for the next turn
        resetBoard();
    }, 1000);
}

// Function to reset the board state for the next turn
function resetBoard() {
    [flippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Function to shuffle the cards randomly
function shuffle() {
    const shuffledCards = cards.sort(() => 0.5 - Math.random()); 
    const gameContainer = document.querySelector('.game-container');
    gameContainer.innerHTML = ''; // Clear current cards in the container

    // Re-add the shuffled cards to the container
    shuffledCards.forEach(card => {
        gameContainer.appendChild(card); 
        card.classList.add('hidden'); // Hide all cards initially
        card.addEventListener('click', flipCard); // Add event listener for each card
    });
}

// Function to initialize the game when the page loads
window.onload = function () {
    shuffle(); // Shuffle the cards at the beginning
    
    // Show all cards as flipped for a brief period
    cards.forEach(card => {
        card.classList.remove('hidden'); 
        card.classList.add('flipped'); 
    });

    setTimeout(() => {
        // Hide all cards after 3 seconds
        cards.forEach(card => {
            card.classList.remove('flipped'); 
            card.classList.add('hidden'); 
        });
        startTimer(); // Start the timer after hiding the cards
    }, 3000);
};

// Function to show the win modal when all pairs are matched
function showWinModal() {
    stopTimer(); // Stop the timer when the game is won
    const minutes = Math.floor(seconds / 60);
    const displaySeconds = seconds % 60;
    // Display the final time on the win modal
    winTimeElement.textContent = `Time: ${minutes}:${displaySeconds < 10 ? '0' : ''}${displaySeconds}`;
    modal.style.display = 'flex'; // Show the modal
}

// Function to restart the game
function restartGame() {
    modal.style.display = 'none'; // Hide the win modal
    seconds = 0;
    matchedPairs = 0;
    timerElement.textContent = 'Time: 0:00'; // Reset the timer display
    location.reload(); // Reload the page to reset the game

    // Hide and reset cards to initial state
    cards.forEach(card => {
        card.classList.remove('flipped');
        card.classList.add('hidden');
        card.addEventListener('click', flipCard);
    });

    shuffle(); // Shuffle the cards again
    startTimer(); // Start the timer again
}
