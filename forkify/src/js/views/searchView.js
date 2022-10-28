class SearchView {
  #parentElement = document.querySelector('.search');
  #data;
  #errorMessage = `We couldn't find that recipe. Please try another one!`;
  #message = '';

  getQuery() {
    return this.#parentElement.querySelector('.search__field').value;
  }

  clearInput() {
    this.#parentElement.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this.#parentElement.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
