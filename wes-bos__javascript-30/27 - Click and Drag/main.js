'use strict';

const items = document.querySelector('.items');
let mouseX;
let itemsLastX = 0;

items.addEventListener('mousedown', dragOn);
items.addEventListener('mouseup', dragOff);

function dragOn(e) {
    items.classList.add('active');
    mouseX = e.clientX;
    items.addEventListener('mousemove', drag);
}

function dragOff(e) {
    items.classList.remove('active');
    items.removeEventListener('mousemove', drag);
    itemsLastX = items.scrollLeft;
}

function drag(e) {
    const mouseXNew = e.clientX;
    const dragged = mouseXNew - mouseX;
    items.scrollLeft = -dragged * 2 + itemsLastX;
}
