'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
// OLD SCHOOL WAY OF AJAX REQUEST
///////////////////////////////////////

// function getCountryData(country) {
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v2/name/${country}`);
//   request.send();
//   request.addEventListener('load', function () {
//     const [data] = JSON.parse(this.responseText);
//     console.log(data);

//     const html = `<article class="country">
//   <img class="country__img" src="${data.flag}" />
//   <div class="country__data">
//     <h3 class="country__name">${data.name}</h3>
//     <h4 class="country__region">${data.region}</h4>
//     <p class="country__row"><span>👫</span>${(+data.population / 10e5).toFixed(
//       1
//     )} M</p>
//     <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
//     <p class="country__row"><span>💰</span>${data.currencies[0].code}</p>
//   </div>
//   </article>`;

//     countriesContainer.insertAdjacentHTML('beforeend', html);
//     countriesContainer.style.opacity = '1';
//   });
// }

// getCountryData('poland');
// getCountryData('germany');
// getCountryData('ukraine');

///////////////////////////////////////
// CALLBACK HELL
///////////////////////////////////////

function renderCountry(country, className = '') {
  const html = `<article class="country ${className} ${country.name
    .toLowerCase()
    .replaceAll(' ', '-')}">
    <img class="country__img" src="${country.flag}" />
    <div class="country__data">
      <h3 class="country__name">${country.name}</h3>
      <h4 class="country__region">${country.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +country.population / 10e5
      ).toFixed(1)} M</p>
      <p class="country__row"><span>🗣️</span>${country.languages[0].name}</p>
      <p class="country__row"><span>💰</span>${country.currencies[0].code}</p>
    </div>
    </article>`;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = '1';
}

// function makeRequest() {}

// function getCountryAndNeighbours(country) {
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v2/name/${country}`);
//   request.send();
//   request.addEventListener('load', function () {
//     const [data] = JSON.parse(this.responseText);
//     renderCountry(data);

//     // Get neighbours
//     const neighbourCodes = data.borders;
//     neighbourCodes.forEach(n => {
//       const request = new XMLHttpRequest();
//       request.open('GET', `https://restcountries.com/v2/alpha?codes=${n}`);
//       request.send();
//       request.addEventListener('load', function () {
//         const [data] = JSON.parse(this.responseText);
//         renderCountry(data, 'neighbour');
//       });
//     });
//   });
// }

// getCountryAndNeighbours('poland');

// // Asynchronous events in sequence
// setTimeout(() => {
//   console.log('1 second passed');
//   setTimeout(() => {
//     console.log('2 seconds passed');
//     setTimeout(() => {
//       console.log('3 seconds passed');
//       setTimeout(() => {
//         console.log('4 seconds passed');
//         setTimeout(() => {
//           console.log('5 seconds passed');
//         }, 1000);
//       }, 1000);
//     }, 1000);
//   }, 1000);
// }, 1000);

///////////////////////////////////////
// FETCH API & PROMISES
///////////////////////////////////////

function getCountryDate(country) {
  fetch(`https://restcountries.com/v2/name/${country}`)
    .then(response => response.json())
    .then(data => renderCountry(data[0]));
}

getCountryDate('poland');
