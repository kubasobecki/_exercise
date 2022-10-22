'use strict';
const video = document.querySelector('video');
const playBtn = document.querySelector('.player__button.toggle');
const progress = document.querySelector('.progress');
const progressBar = progress.querySelector('.progress__filled');
const speedAndVolume = document.querySelectorAll('.player__slider');
const skipBtns = document.querySelectorAll('.player__button');

const togglePlay = () => {
    if (video.paused) {
        playBtn.textContent = '■';
        video.play();
    } else {
        playBtn.textContent = '►';
        video.pause();
    }
};
video.addEventListener('click', togglePlay);
playBtn.addEventListener('click', togglePlay);

const progressUpdate = e => {
    const percent = (e.target.currentTime / e.target.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
};
video.addEventListener('timeupdate', progressUpdate);

const sliderMove = e => {
    if (e.type === 'mousemove' && e.buttons !== 1) return;
    const posClicked = e.layerX;
    const widthTotal = progress.offsetWidth;
    video.currentTime = (posClicked / widthTotal) * video.duration;
};
progress.addEventListener('click', sliderMove);
progress.addEventListener('mousemove', sliderMove);

const skip = e => (video.currentTime += +e.target.dataset.skip);
skipBtns.forEach(btn => btn.addEventListener('click', skip));

const setSpeedOrVolume = e => (video[e.target.name] = e.target.value);
speedAndVolume.forEach(i => i.addEventListener('input', setSpeedOrVolume));
