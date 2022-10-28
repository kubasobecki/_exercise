import 'core-js/stable'; // polyfill everything else
import 'regenerator-runtime'; // polyfill async await
import icons from 'url:../img/icons.svg';

const API_KEY = '63fc6966-cce0-42ea-ba6b-573ef866f5a4';
const recipeContainer = document.querySelector('.recipe');
const resultsContainer = document.querySelector('.results');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const renderSpinner = function (parentEl) {
  const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
  `;
  parentEl.innerHTML = '';
  parentEl.insertAdjacentHTML('afterbegin', markup);
};

const showRecipe = async function () {
  try {
    // Get recipe ID from the hash in URL
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Show spinner
    renderSpinner(recipeContainer);

    // Load recipe
    const apiURL = `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`;
    const res = await fetch(apiURL);
    const json = await res.json();
    if (!res.ok) throw new Error(`${json.message} ${res.status}`);
    let { recipe } = json.data;
    recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    console.log(recipe);
    // return recipe;

    // Render recipe
    const markup = `
      <figure class="recipe__fig">
        <img src="${recipe.image}" alt="${recipe.title}" class="recipe__img" />
        <h1 class="recipe__title">
          <span>${recipe.title}</span>
        </h1>
      </figure>

      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${
            recipe.cookingTime
          }</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${
            recipe.servings
          }</span>
          <span class="recipe__info-text">servings</span>

          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--increase-servings">
              <svg>
                <use href="${icons}#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--increase-servings">
              <svg>
                <use href="${icons}#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>

        <div class="recipe__user-generated">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
        </div>
        <button class="btn--round">
          <svg class="">
            <use href="${icons}#icon-bookmark-fill"></use>
          </svg>
        </button>
      </div>

      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
          ${recipe.ingredients.reduce(
            (html, ing) =>
              (html += `
            <li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${ing?.quantity ?? ''}</div>
              <div class="recipe__description">
                <span class="recipe__unit">${ing?.unit ?? ''}</span>
                ${ing.description}
              </div>
            </li>
          `),
            ''
          )}
        </ul>
      </div>

      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${
            recipe.publisher
          }</span>. Please check out
          directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href="${recipe.sourceUrl}"
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </a>
      </div>
    `;

    recipeContainer.innerHTML = '';
    recipeContainer.insertAdjacentHTML('afterbegin', markup);
  } catch (err) {
    console.error(err);
  }
};

showRecipe();

['hashchange', 'load'].forEach(ev => window.addEventListener(ev, showRecipe));

async function renderResults(results) {
  try {
    const data = await results;
    const html = data.reduce(
      (html, result) =>
        (html += `
        <li class="preview">
          <a class="preview__link preview__link--active" href="#${result.id}">
            <figure class="preview__fig">
              <img src="${result.image_url}" alt="Test" />
            </figure>
            <div class="preview__data">
              <h4 class="preview__title">${result.title}</h4>
              <p class="preview__publisher">${result.publisher}</p>
              <div class="preview__user-generated ${'hidden'}">
                <svg>
                  <use href="${icons}#icon-user"></use>
                </svg>
              </div>
            </div>
          </a>
        </li>`),
      ''
    );
    resultsContainer.insertAdjacentHTML('beforeend', html);
  } catch (err) {
    console.error(err.message);
  }

  // return html;
}

// renderResults(getRecipes('pizza'));
// results.insertAdjacentHTML('beforeend', renderResults(getRecipes('pizza')));
