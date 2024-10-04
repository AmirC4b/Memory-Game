const cards = Array.from(document.querySelectorAll('.card')); 
const timerElement = document.querySelector('.timer');
const modal = document.getElementById('winModal');
const winTimeElement = document.querySelector('.win-time');
let flippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchedPairs = 0;
let timer;
let seconds = 0;

function startTimer() {
    timer = setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const displaySeconds = seconds % 60;
        timerElement.textContent = `Time: ${minutes}:${displaySeconds < 10 ? '0' : ''}${displaySeconds}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');
    this.classList.remove('hidden');

    if (!flippedCard) {
        flippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.card === secondCard.dataset.card;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    matchedPairs++;

    if (matchedPairs === 8) {
        setTimeout(showWinModal, 500);
    }

    resetBoard();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.classList.add('hidden');
        secondCard.classList.add('hidden');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [flippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function shuffle() {
    const shuffledCards = cards.sort(() => 0.5 - Math.random()); 
    const gameContainer = document.querySelector('.game-container');
    gameContainer.innerHTML = ''; 
    shuffledCards.forEach(card => {
        gameContainer.appendChild(card); 
        card.classList.add('hidden'); 
        card.addEventListener('click', flipCard); 
    });
}

window.onload = function () {
    shuffle(); 
    cards.forEach(card => {
        card.classList.remove('hidden'); 
        card.classList.add('flipped'); 
    });

    
    setTimeout(() => {
        cards.forEach(card => {
            card.classList.remove('flipped'); 
            card.classList.add('hidden'); 
        });
        startTimer(); 
    }, 3000);
};

function showWinModal() {
    stopTimer();
    const minutes = Math.floor(seconds / 60);
    const displaySeconds = seconds % 60;
    winTimeElement.textContent = `Time: ${minutes}:${displaySeconds < 10 ? '0' : ''}${displaySeconds}`;
    modal.style.display = 'flex';
}

function restartGame() {
    modal.style.display = 'none';
    seconds = 0;
    matchedPairs = 0;
    timerElement.textContent = 'Time: 0:00';

    cards.forEach(card => {
        card.classList.remove('flipped');
        card.classList.add('hidden');
        card.addEventListener('click', flipCard);
    });

    shuffle();
    startTimer(); 
}
