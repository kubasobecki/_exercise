'use strict';
const gallery = document.querySelector('.gallery');

const rng = (min, max) => Math.round(Math.random() * (max - min) + min);
const squares = new Array(10).fill([1, 1]);
const digits = [
    ...Array(50)
        .fill(0)
        .map(num => [rng(1, 4), rng(1, 4)]),
    ...squares
];
const generateHTML = ([h, v]) => `
    <div class="item h${h} v${v}">
        <img src="images/${rng(1, 12)}.jpg"/>
        <div class="item__overlay">
            <button>View</button>
        </div>
    </div>`;

const html = digits.map(generateHTML).join('');
gallery.innerHTML = html;

const pictures = document.querySelectorAll('.item');
const overlay = document.querySelector('.overlay');
const overlayClose = overlay.querySelector('.close');
const overlayPic = overlay.querySelector('img');

const popupClose = () => {
    overlayPic.src = '';
    overlay.classList.remove('open');
};
// overlay.addEventListener('click', popupClose);
overlayClose.addEventListener('click', popupClose);

const popupOpen = e => {
    const clickedPic = e.target.closest('.item').querySelector('img');
    overlayPic.src = clickedPic.src;
    overlay.classList.add('open');
};
pictures.forEach(pic => pic.addEventListener('click', popupOpen));
