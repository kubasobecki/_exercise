import { async } from 'regenerator-runtime'; // polyfill async await
import { API_URL } from './config.js';
import { API_KEY } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
  },
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
loadSearchResults('pizza');

// async function renderResults(results) {
//   try {
//     const data = await results;
//     const html = data.reduce(
//       (html, result) =>
//         (html += `
//         <li class="preview">
//           <a class="preview__link preview__link--active" href="#${result.id}">
//             <figure class="preview__fig">
//               <img src="${result.image_url}" alt="Test" />
//             </figure>
//             <div class="preview__data">
//               <h4 class="preview__title">${result.title}</h4>
//               <p class="preview__publisher">${result.publisher}</p>
//               <div class="preview__user-generated ${'hidden'}">
//                 <svg>
//                   <use href="${icons}#icon-user"></use>
//                 </svg>
//               </div>
//             </div>
//           </a>
//         </li>`),
//       ''
//     );
//     resultsContainer.insertAdjacentHTML('beforeend', html);
//   } catch (err) {
//     console.error(err.message);
//   }

// }

// renderResults(getRecipes('pizza'));
// results.insertAdjacentHTML('beforeend', renderResults(getRecipes('pizza')));
