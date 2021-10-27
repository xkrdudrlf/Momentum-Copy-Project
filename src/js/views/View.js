export default class View {
  _parentElement;
  _data;

  render(data = null) {
    this._data = data;

    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  _clear(element = null) {
    if (!element) {
      this._parentElement.innerHTML = "";
      return;
    }
    this._parentElement.querySelector(element).innerHTML = "";
  }

  renderSpinner(element = null) {
    const markup = `
      <div class="spinner">
        <i class="fas fa-spinner"></i>
      </div>
    `;

    if (!element) {
      this._clear();
      this._parentElement.insertAdjacentHTML("afterbegin", markup);
    } else {
      this._clear(element);
      this._parentElement
        .querySelector(element)
        .insertAdjacentHTML("afterbegin", markup);
    }
  }

  _generateMarkupSlider(inputClass, isChecked = false) {
    return `
      <label class="switch">
        <input class="${inputClass}" type="checkbox" ${
      isChecked ? "checked" : ""
    }>
        <span class="slider"></span>
      </label>
    `;
  }

  // update(data) {}
  // renderError(message = this._errorMessage) {}
}
