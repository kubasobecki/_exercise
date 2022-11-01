import { async } from 'regenerator-runtime'; // polyfill async await
import { API_URL } from './config.js';
import { API_KEY } from './config.js';
import { RES_PER_PAGE } from './config.js';
import { getJSON } from './helpers.js';
import { isBookmarked } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    currentPage: 1,
  },
  bookmarks: [],
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}`);

    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
      bookmarked: isBookmarked(recipe, state.bookmarks),
    };
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    const data = await getJSON(`${API_URL}?search=${query}&key=${API_KEY}`);
    state.search.query = query;
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.currentPage) {
  state.search.currentPage = page;
  const start = (state.search.currentPage - 1) * state.search.resultsPerPage;
  const end = start + state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  const oldServings = state.recipe.servings;
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = ing.quantity * (newServings / oldServings);
  });

  state.recipe.servings = newServings;
};

export const updateBookmarks = function (recipe) {
  if (!isBookmarked(recipe, state.bookmarks)) {
    // 1. Add bookmark
    state.bookmarks.push(recipe);
    // 2. Mark recipe as bookmark
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  } else {
    // 1. Remove bookmark
    const newBookmarks = state.bookmarks.filter(r => r.id !== state.recipe.id);
    state.bookmarks = newBookmarks;
    // 2. Unmark recipe as bookmark
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = false;
  }

  // Store bookmarks in local storage
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();
