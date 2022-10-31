import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

import { async } from 'regenerator-runtime'; // polyfill async await
import 'core-js/stable'; // polyfill everything else

// if (module.hot) module.hot.accept(); // Parcel hot module replacement

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
    recipeView.render(recipe);
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

    // 3. Load search results
    await model.loadSearchResults(query);

    // 4. Clear input
    searchView.clearInput();

    // 5. Render results
    resultsView.render(model.getSearchResultsPage());

    // 6. Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1. Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2. Render NEW pagination
  paginationView.render(model.state.search);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();
