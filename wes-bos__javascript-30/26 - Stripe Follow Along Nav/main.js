'use strict';
const navTopLinks = document.querySelectorAll('.cool > li');

const dropdownBG = document.querySelector('.dropdownBackground');
const dropdownArrow = dropdownBG.querySelector('.arrow');

function navEffectHandler(e) {
    if (e.type === 'mouseenter') navShow(this);
    if (e.type === 'mouseleave') navHide(this);
}

function navShow(el) {
    el.classList.add('trigger-enter');

    const dropdown = el.querySelector('.dropdown');
    const { width, height } = dropdown.getBoundingClientRect();

    dropdownBG.style.width = `${width}px`;
    dropdownBG.style.height = `${height}px`;
    const dropdownPosX = el.offsetLeft + (el.offsetWidth - width) / 2;
    const dropdownPosY = el.offsetTop + el.offsetHeight;
    dropdownBG.style.translate = `${dropdownPosX}px ${dropdownPosY}px`;

    setTimeout(() => el.classList.add('trigger-enter-active'), 150);
    dropdownBG.classList.add('open');
}

function navHide(el) {
    el.classList.remove('trigger-enter', 'trigger-enter-active');
    dropdownBG.classList.remove('open');
}

navTopLinks.forEach(link => {
    link.addEventListener('mouseenter', navEffectHandler);
    link.addEventListener('mouseleave', navEffectHandler);
});
