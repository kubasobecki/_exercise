'use strict';
let countdown;
const timeLeft = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

function timer(seconds) {
    clearInterval(countdown);
    const startTime = Date.now();
    const stopTime = startTime + seconds * 1000;
    displayTimeLeft(seconds);

    countdown = setInterval(() => {
        const secondsLeft = Math.round((stopTime - Date.now()) / 1000);
        if (secondsLeft < 0) {
            clearInterval(countdown);
            return;
        }
        displayTimeLeft(secondsLeft);
    }, 1000);
}

function displayTimeLeft(secondsLeft) {
    const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
    const seconds = String(secondsLeft % 60).padStart(2, '0');
    timeLeft.textContent = `${minutes}:${seconds}`;

    const backTime = new Date(Date.now() + secondsLeft * 1000);
    const backMin = String(backTime.getHours()).padStart(2, '0');
    const backSec = String(backTime.getMinutes()).padStart(2, '0');

    endTime.textContent = `Be back at ${backMin}:${backSec}`;
}

function startTimer() {
    timer(+this.dataset.time);
}
buttons.forEach(button => button.addEventListener('click', startTimer));

function customTimer(e) {
    e.preventDefault();
    const seconds = +this.minutes.value;
    timer(seconds * 60);
    this.reset();
}
document.customForm.addEventListener('submit', customTimer);
