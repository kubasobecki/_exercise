import * as model from './model.js';
import recipeView from './views/recipeView.js';

import 'core-js/stable'; // polyfill everything else
import 'regenerator-runtime'; // polyfill async await

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
    console.error(err);
  }
};

controlRecipes();

['hashchange', 'load'].forEach(ev =>
  window.addEventListener(ev, controlRecipes)
);

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
