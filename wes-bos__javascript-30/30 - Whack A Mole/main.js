'use strict';

const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const moles = document.querySelectorAll('.mole');
let score = 0;
let timeUp = false;
let lastHole = 99;
let thisHole = 99;

function startGame() {
    score = 0;
    updateScore(score);
    holes.forEach(hole => hole.classList.remove('up'));
    timeUp = false;
    setTimeout(() => (timeUp = true), 10000);
    showMole();
}

const randomScope = (min, max) => Math.round(Math.random() * (max - min) + min);

function showMole() {
    const time = randomScope(200, 1000);
    while (thisHole === lastHole) thisHole = randomScope(0, 5);
    const hole = holes[thisHole];
    console.log(`current hole: ${thisHole}`);
    lastHole = thisHole;
    hole.classList.add('up');
    hole.querySelector('.mole').addEventListener('click', hit, {
        once: true
    });

    setTimeout(() => {
        hole.classList.remove('up');
        if (!timeUp) showMole();
    }, time);
}

function hit(e) {
    if (e.isTrusted) return; // cheater!
    score++;
    updateScore();
}

function updateScore() {
    scoreBoard.textContent = score;
}
