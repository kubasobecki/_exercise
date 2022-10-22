'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
// let map, mapEvent;

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
  }
}

class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace() {
    this.pace = this.duration / this.distance; // min/km
    return this.pace;
  }
}

class Cycling extends Workout {
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60); // km/h
    return this.speed;
  }
}

//////////////////////////////
// APPLICATION ARCHITECTURE //
//////////////////////////////

class App {
  #map;
  #mapEvent;
  #workouts = new Array();

  constructor() {
    this._getPosition();
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
  }

  _getPosition() {
    if (!('geolocation' in navigator)) {
      console.error('Geolocation is not available 😢');
      return;
    }

    navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () =>
      alert('Could not get your position 😢')
    );
  }

  _loadMap(position) {
    // Set coords for the first time with navigator data
    let { latitude: lat, longitude: lon } = position.coords;

    // Initiate map
    this.#map = L.map('map').setView([lat, lon], 13);

    // Add tiles to the map
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.#map);

    // Handling clicks on map
    this.#map.on('click', mapE => {
      this.#mapEvent = mapE;
      this._showForm();
    });
  }

  _showForm() {
    form.style.display = 'grid';
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _validateFields() {
    if (
      !+inputDistance.value > 0 ||
      !+inputDuration.value > 0 ||
      (inputType.value === 'running' && !+inputCadence.value > 0) ||
      (inputType.value === 'cycling' && !isFinite(+inputElevation.value))
    ) {
      alert('☝ All inputs must be positive integers!');
      return false;
    }
    return true;
  }

  _toggleElevationField() {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    e.preventDefault();

    // Get data from the form
    const type = inputType.value;
    const coords = this.#mapEvent.latlng;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const cadence = +inputCadence.value;
    const elevation = +inputElevation.value;

    // Validate data
    if (!this._validateFields()) return;

    // Initialize workout
    let workout;

    // If running workout, create Running object
    if (type === 'running')
      workout = new Running(coords, distance, duration, cadence);

    // If cycling workout, create Cycling object
    if (type === 'cycling')
      workout = new Cycling(coords, distance, duration, elevation);

    // Add new object to the workouts array
    console.log(workout);
    console.log();
    this.#workouts.push(workout);

    // Render workout on the map as a marker and popup
    this._renderWorkoutMarkerAndPopup(workout);

    // Render workout on the list
    this._renderWorkoutData(workout);

    // Hide and clear form
    form.classList.add('hidden');
    form.style.display = 'none';
    inputDistance.value = '';
    inputDuration.value = '';
    inputCadence.value = '';
    inputElevation.value = '';
  }

  // Render workout on the map as a marker and popup
  _renderWorkoutMarkerAndPopup(workout) {
    const type = workout.constructor.name.toLocaleLowerCase();
    const popup = L.popup({
      className: `${type}-popup`,
      autoClose: false,
      closeOnClick: false,
    }).setContent(
      `${type === 'running' ? '🏃‍♂️' : '🚴‍♂️'} on ${
        months[workout.date.getMonth()]
      } ${workout.date.getDate()}`
    );

    L.marker(workout.coords).addTo(this.#map).bindPopup(popup).openPopup();
  }

  // Render workout on the list
  _renderWorkoutData(workout) {
    const type = workout.constructor.name.toLocaleLowerCase();
    let workoutHTML = `
      <li class="workout workout--${type}" data-id="${workout.id}">
          <h2 class="workout__title">${
            type[0].toUpperCase() + type.slice(1)
          } on ${months[workout.date.getMonth()]} ${workout.date.getDate()}</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              workout.type === 'running' ? '🏃‍♂️' : '🚴‍♂️'
            }</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>`;

    if (type === 'running')
      workoutHTML += `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>
      `;

    if (type === 'cycling')
      workoutHTML += `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit"></span>
          </div>
        </li>
      `;

    form.insertAdjacentHTML('afterend', workoutHTML);
  }
}

const app = new App();
