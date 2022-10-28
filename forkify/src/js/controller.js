import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';

import { async } from 'regenerator-runtime'; // polyfill async await
import 'core-js/stable'; // polyfill everything else

if (module.hot) module.hot.accept(); // Parcel hot module replacement

const controlRecipes = async function () {
  try {
    // 1. Get recipe ID from the hash in URL
    const id = window.location.hash.slice(1);
    if (!id) return;

    // 2. Show spinner
    recipeView.renderSpinner();

    // 3. Load recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;

    // 4. Render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // 1. Show spinner
    resultsView.renderSpinner();

    // 2. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 3. Clear input
    searchView.clearInput();

    // 4. Load search results
    await model.loadSearchResults(query);
    searchView.clearInput();

    // 5. Render results
    resultsView.render(model.state.search.results);
  } catch (err) {
    console.log(err);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};
init();
