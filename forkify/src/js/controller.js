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

    // 2. Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 3. Show spinner
    recipeView.renderSpinner();

    // 4. Load recipe
    await model.loadRecipe(id);

    // 5. Render recipe
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

const controlServings = function (newServings) {
  // 1. Update the recipe servings (in state)
  model.updateServings(newServings);

  // 2. Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlPagination = function (goToPage) {
  // 1. Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2. Render NEW pagination
  paginationView.render(model.state.search);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();
