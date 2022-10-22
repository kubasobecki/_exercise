'use strict';
const speed = document.querySelector('.speed');
const speedBar = document.querySelector('.speed-bar');
const video = document.querySelector('video.flex');
const speedX1 = speedBar.offsetHeight;

speed.addEventListener('mousemove', changeSpeed);

function changeSpeed(e) {
    const speedBarHeight = (e.offsetY / speed.offsetHeight) * 100;
    speedBar.style.height = `${speedBarHeight}%`;

    const rate = speedBar.offsetHeight / speedX1;
    speedBar.textContent = `${rate.toFixed(2)}×`;
    video.playbackRate = rate;
}
