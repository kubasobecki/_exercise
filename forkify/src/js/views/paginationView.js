import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const curPage = this._data.currentPage;
    const lastPage = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    const prevBtnMarkup =
      curPage > 1
        ? `
        <button class="btn--inline pagination__btn--prev" data-goto="${
          curPage - 1
        }">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
        </button>`
        : '';

    const nextBtnMarkup =
      curPage !== lastPage
        ? `
        <button class="btn--inline pagination__btn--next" data-goto="${
          curPage + 1
        }">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>`
        : '';

    return prevBtnMarkup + nextBtnMarkup;
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
}

export default new PaginationView();
