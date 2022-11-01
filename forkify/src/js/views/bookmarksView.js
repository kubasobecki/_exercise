import View from './View.js';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');

  _generateMarkup() {
    const curId = window.location.hash.slice(1);

    return this._data.reduce(
      (html, item) =>
        (html += `
        <li class="preview">
            <a class="preview__link ${
              curId === item.id ? 'preview__link--active' : ''
            }" href="#${item.id}">
            <figure class="preview__fig">
                <img src="${item.image}" alt="${item.title}" />
            </figure>
            <div class="preview__data">
                <h4 class="preview__title">${item.title}</h4>
                <p class="preview__publisher">${item.publisher}</p>
                <div class="preview__user-generated hidden">
                    <svg>
                        <use href="${icons}#icon-user"></use>
                    </svg>
                </div>
            </div>
            </a>
        </li>
    `),
      ''
    );
  }
}

export default new BookmarksView();
