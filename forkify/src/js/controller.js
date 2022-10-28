import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';

import { async } from 'regenerator-runtime'; // polyfill async await
import 'core-js/stable'; // polyfill everything else

const controlRecipes = async function () {
  try {
    // Get recipe ID from the hash in URL
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Show spinner
    recipeView.renderSpinner();

    // 1. Load recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;

    // 2. Render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // 1. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. Clear input
    searchView.clearInput();

    // 3. Load search results
    await model.loadSearchResults(query);
    searchView.clearInput();

    // 4. Render results
    console.log(model.state.search.results);
  } catch (err) {
    console.log(err);
  }
};

controlSearchResults();

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};
init();
