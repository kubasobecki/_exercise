'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
countriesContainer.style.opacity = '1';

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
// FETCH API, THEN() & CHAINING PROMISES
///////////////////////////////////////

// Helper functions
function getJSON(url, error = 'Something went wrong 😭 Ty again!') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${error} (${response.status})`);
    return response.json();
  });
}

function renderError(msg) {
  console.error(msg);
  countriesContainer.parentElement.insertAdjacentText('beforeend', msg);
}

// Get and render country and its neighbours data
function getCountryData(country) {
  getJSON(`https://restcountries.com/v2/name/${country}`, 'Country not found')
    .then(data => {
      renderCountry(data[0]);
      const borders = data[0].borders;
      if (!borders) throw new Error(`This country doesn't have any neighbours`);
      const nbrs = borders.map(b =>
        getJSON(
          `https://restcountries.com/v2/alpha?codes=${b}`,
          `Couldn't get neighbour of code ${b}`
        )
      );
      return nbrs;
    })
    .then(nbrs =>
      nbrs.forEach(n => n.then(data => renderCountry(data[0], 'neighbour')))
    )
    .catch(err => renderError(`💥💥💥 ${err.message} 💥💥💥`))
    .finally(() => (countriesContainer.style.opacity = '1')); // This will ALWAYS run;
}

btn.addEventListener('click', () => getCountryData('sweden'));

///////////////////////////////////////
// Coding Challenge #1
///////////////////////////////////////

/* 
In this challenge you will build a function 'whereAmI' which renders a country ONLY based on GPS coordinates. For that, you will use a second API to geocode coordinates.

Here are your tasks:

PART 1
1. Create a function 'whereAmI' which takes as inputs a latitude value (lat) and a longitude value (lng) (these are GPS coordinates, examples are below).
2. Do 'reverse geocoding' of the provided coordinates. Reverse geocoding means to convert coordinates to a meaningful location, like a city and country name. Use this API to do reverse geocoding: https://geocode.xyz/api.
The AJAX call will be done to a URL with this format: https://geocode.xyz/52.508,13.381?geoit=json. Use the fetch API and promises to get the data. Do NOT use the getJSON function we created, that is cheating 😉
3. Once you have the data, take a look at it in the console to see all the attributes that you recieved about the provided location. Then, using this data, log a messsage like this to the console: 'You are in Berlin, Germany'
4. Chain a .catch method to the end of the promise chain and log errors to the console
5. This API allows you to make only 3 requests per second. If you reload fast, you will get this error with code 403. This is an error with the request. Remember, fetch() does NOT reject the promise in this case. So create an error to reject the promise yourself, with a meaningful error message.

PART 2
6. Now it's time to use the received data to render a country. So take the relevant attribute from the geocoding API result, and plug it into the countries API that we have been using.
7. Render the country and catch any errors, just like we have done in the last lecture (you can even copy this code, no need to type the same code)

TEST COORDINATES 1: 52.508, 13.381 (Latitude, Longitude)
TEST COORDINATES 2: 19.037, 72.873
TEST COORDINATES 2: -33.933, 18.474

GOOD LUCK 😀

function whereAmI(lat, lon) {
    fetch(`https://geocode.xyz/${lat},${lon}?geoit=json`)
    .then(res => {
        if (!res.ok)
        throw new Error(`Problem with reverse geocoding: (${res.status})`);
        return res.json();
    })
    .then(data => {
        console.log(`You are in ${data.city}, ${data.country}`);
        getCountryData(data.country);
    })
    .catch(err => console.error(`💥💥💥 ${err.message} 💥💥💥`));
}

navigator.geolocation.getCurrentPosition(e =>
    whereAmI(e.coords.latitude, e.coords.longitude)
    );
    // whereAmI(52.4052, 16.9339);
    // whereAmI(19.037, 72.873);
    // whereAmI(-33.933, 18.474);
*/

///////////////////////////////////////
// EVENT LOOP, CALL STACK vs. CALLBACK QUEUE vs. MICROTASK QUEUE
///////////////////////////////////////
/*
console.log('test start');
setTimeout(() => console.log(`0 seconds timer`), 0);
Promise.resolve('Resolved promise 1').then(res => console.log(res));
Promise.resolve('Resolved promise 2').then(res => {
  for (let i = 10e8; i > 0; i--) {}
  console.log(res);
});
console.log('test end');
*/
///////////////////////////////////////
// BUILDING PROMISES
///////////////////////////////////////

/*
// Executor function
const promise = new Promise(function (resolve, reject) {
  console.log('Lottery draw is taking place right now... 🔮');
  setTimeout(function () {
    if (Math.random() >= 0.5) resolve('You WIN 🥇🥇🥇');
    else reject(new Error('Booo, you lost your money 💩'));
  }, 2000);
});

promise.then(res => console.log(res)).catch(err => console.error(err.message));

// PROMISIFYING setTimeout

function wait(seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
}
*/
// No callback hell, YEY 😊
/*
wait(1)
  .then(() => {
    console.log('1 second passed');
    return wait(1);
  })
  .then(() => {
    console.log('2 second passed');
    return wait(1);
  })
  .then(() => {
    console.log('3 second passed');
    return wait(1);
  })
  .then(() => {
    console.log('4 second passed');
    return wait(1);
  })
  .then(() => {
    console.log('5 second passed');
  });
*/
// Resolved/Rejected immediately
/*
const resolved = Promise.resolve('RESOLVED!');
resolved.then(res => console.log(res));

const rejected = Promise.reject(new Error('REJECTED!'));
rejected.catch(err => console.error(err.message));
*/
///////////////////////////////////////
// PROMISIFY GEOLOCATION
///////////////////////////////////////
/*
function getPosition() {
  return new Promise((resolve, reject) => {
    // navigator.geolocation.getCurrentPosition(
    //   e => resolve(e.coords),
    //   err => reject(new Error(`couldn't get your location: ${err.message}`))
    // );
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}
getPosition()
  .then(res => console.log(res.coords))
  .catch(err => console.error(err.message));

function whereAmI() {
  getPosition()
    .then(res => {
      const { latitude: lat, longitude: lon } = res.coords;
      return fetch(`https://geocode.xyz/${lat},${lon}?geoit=json`);
    })
    .then(res => {
      if (!res.ok)
        throw new Error(`Problem with reverse geocoding: (${res.status})`);
      return res.json();
    })
    .then(data => {
      console.log(`You are in ${data.city}, ${data.country}`);
      getCountryData(data.country);
    })
    .catch(err => console.error(`💥💥💥 ${err.message} 💥💥💥`));
}

whereAmI();
*/

///////////////////////////////////////
// Coding Challenge #2
///////////////////////////////////////

/* 
Build the image loading functionality that I just showed you on the screen.

Tasks are not super-descriptive this time, so that you can figure out some stuff on your own. Pretend you're working on your own 😉

PART 1
1. Create a function 'createImage' which receives imgPath as an input. This function returns a promise which creates a new image (use document.createElement('img')) and sets the .src attribute to the provided image path. When the image is done loading, append it to the DOM element with the 'images' class, and resolve the promise. The fulfilled value should be the image element itself. In case there is an error loading the image ('error' event), reject the promise.

If this part is too tricky for you, just watch the first part of the solution.

PART 2
2. Consume the promise using .then and also add an error handler;
3. After the image has loaded, pause execution for 2 seconds using the wait function we created earlier;
4. After the 2 seconds have passed, hide the current image (set display to 'none'), and load a second image (HINT: Use the image element returned by the createImage promise to hide the current image. You will need a global variable for that 😉);
5. After the second image has loaded, pause execution for 2 seconds again;
6. After the 2 seconds have passed, hide the current image.

TEST DATA: Images in the img folder. Test the error handler by passing a wrong image path. Set the network speed to 'Fast 3G' in the dev tools Network tab, otherwise images load too fast.

GOOD LUCK 😀
*/

/*
const imgContainer = document.querySelector('.images');

function wait(seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
}

// MY SOLUTION
let currentImage;

function createImage(imgPath) {
  return new Promise((resolve, reject) => {
    // using fetch to know if/when image was loaded
    fetch(imgPath)
      .then(response => {
        if (!response.ok) reject(`💥💥💥Couldn't find image💥💥💥`);
        return response.blob();
      })
      .then(blob => {
        const img = document.createElement('img');
        img.classList.add('images');
        img.src = imgPath; // could be img.src = URL.createObjectURL(blob);
        imgContainer.append(img);
        currentImage = img;
        resolve(img);
      });
  });
}

createImage('img/img-1.jpg')
  .then(img => {
    return wait(2);
  })
  .then(() => {
    currentImage.style.display = 'none';
    return createImage('img/img-2.jpg');
  })
  .then(img => {
    return wait(2);
  })
  .then(() => {
    currentImage.style.display = 'none';
    return createImage('img/img-3.jpg');
  })
  .catch(err => console.error(`💥💥💥 ${err.message} 💥💥💥`));
*/
// OTHER SOLUTION (improved)
/*
function createImage2(imgPath) {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.classList.add('images');
    img.src = imgPath;

    img.addEventListener('load', () => {
      currentImage = img;
      imgContainer.append(img);
      resolve(img);
    });

    img.addEventListener('error', () => reject('💥💥💥Image not found💥💥💥'));
  });
}

createImage2('img/img-1.jpg')
  .then(img => {
    console.log('image 1 loaded');
    return wait(2);
  })
  .then(() => {
    return createImage2('img/img-2.jpg');
  })
  .then(img => {
    currentImage.style.display = 'none';
    console.log('image 2 loaded');
    return wait(2);
  })
  .then(() => {
    return createImage2('img/img-3.jpg');
  })
  .then(img => {
    currentImage.style.display = 'none';
    console.log('image 3 loaded');
  })
  .catch(err => console.error(err.message));
*/
// PART 2
// my solution

///////////////////////////////////////
// CONSUMING PROMISES WITH ASYNC/AWAIT
///////////////////////////////////////

// This is:
// const res = await fetch(`https://restcountries.com/v2/name/${country}`);
// const data = await res.json();
// renderCountry(data[0]);

// the same as:
// const res2 = fetch(`https://restcountries.com/v2/name/${country}`);
// res2.then(res => res.json()).then(data => renderCountry(data[0]));
/*
const getPosition = () =>
  new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject)
  );

async function whereAmI() {
  try {
    // Geolocation
    const geo = await getPosition();
    const { latitude: lat, longitude: lon } = geo.coords;

    // Reversed geocoding
    const rGeo = await fetch(`https://geocode.xyz/${lat},${lon}?geoit=json`);
    if (!rGeo.ok) throw new Error(`Couldn't get your location 💩`);
    const rGeoData = await rGeo.json();

    // Country data
    const res = await fetch(
      `https://restcountries.com/v2/name/${rGeoData.country}`
    );
    if (!res.ok) throw new Error(`Couldn't get country data 💩`);
    const data = await res.json();
    renderCountry(data[0]);

    return `You are in ${rGeoData.city}, ${rGeoData.country}`;
  } catch (err) {
    renderError(err.message);
    // Re-throw an error
    throw err;
  } finally {
    console.log('As always... this always runs');
  }
}

// whereAmI()
//   .then(cityCountry => console.log(cityCountry))
//   .catch(err => console.log(err.message))
//   .finally(() => console.log('Finished! LoL'));

(async () => {
  try {
    console.log(await whereAmI());
  } catch (err) {
    console.log(err.message);
  } finally {
    console.log('Finished! LoL');
  }
})();
*/

///////////////////////////////////////
// RUNNING PROMISES IN PARALLEL
///////////////////////////////////////

async function get3Countries(c1, c2, c3) {
  try {
    // const [[data1], [data2], [data3]] = await Promise.all([
    //   getJSON(`https://restcountries.com/v2/name/${c1}`),
    //   getJSON(`https://restcountries.com/v2/name/${c2}`),
    //   getJSON(`https://restcountries.com/v2/name/${c3}`),
    // ]);
    // console.log(data1.capital, data2.capital, data3.capital);
    const data = await Promise.all([
      getJSON(`https://restcountries.com/v2/name/${c1}`),
      getJSON(`https://restcountries.com/v2/name/${c2}`),
      getJSON(`https://restcountries.com/v2/name/${c3}`),
    ]);
    console.log(data.map(c => c[0].capital));
  } catch (err) {
    console.error(err.message);
  }
}

get3Countries('germany', 'usa', 'poland');

///////////////////////////////////////
// Coding Challenge #3
///////////////////////////////////////

/* 
PART 1
Write an async function 'loadNPause' that recreates Coding Challenge #2, this time using async/await (only the part where the promise is consumed). Compare the two versions, think about the big differences, and see which one you like more.
Don't forget to test the error handler, and to set the network speed to 'Fast 3G' in the dev tools Network tab.

PART 2
1. Create an async function 'loadAll' that receives an array of image paths 'imgArr';
2. Use .map to loop over the array, to load all the images with the 'createImage' function (call the resulting array 'imgs')
3. Check out the 'imgs' array in the console! Is it like you expected?
4. Use a promise combinator function to actually get the images from the array 😉
5. Add the 'paralell' class to all the images (it has some CSS styles).

TEST DATA: ['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg']. To test, turn off the 'loadNPause' function.

GOOD LUCK 😀
*/
