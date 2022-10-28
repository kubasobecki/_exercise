import View from './View.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No recipes found. Please try another one!`;
  _message = '';

  _generateMarkup() {
    return this._data.reduce((html, item) => {
      return (html += `
        <li class="preview">
            <a class="preview__link preview__link" href="#${item.id}">
            <figure class="preview__fig">
                <img src="${item.image}" alt="${item.title}" />
            </figure>
            <div class="preview__data">
                <h4 class="preview__title">${item.title}</h4>
                <p class="preview__publisher">${item.publisher}</p>
            </div>
            </a>
        </li>
    `);
    }, '');
  }
}

export default new ResultsView();
