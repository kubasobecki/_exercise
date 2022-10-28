import * as model from './model.js';
import recipeView from './views/recipeView.js';

import { async } from 'regenerator-runtime'; // polyfill async await
import 'core-js/stable'; // polyfill everything else

const recipeContainer = document.querySelector('.recipe');
const resultsContainer = document.querySelector('.results');

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
    recipeView.renderError();
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
};
init();

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
