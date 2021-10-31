export default class View {
  _parentElement;
  _data;

  render(data = null) {
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  update(data) {
    this._data = data;
    const markup = this._generateMarkup();
    const newDOM = new Range().createContextualFragment(markup);

    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const curElements = Array.from(this._parentElement.querySelectorAll("*"));
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // Update Changed Texts
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        curEl.textContent = newEl.textContent;
      }

      // Updates changed ATTRIBUES
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach((attr) =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
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

  // renderError(message = this._errorMessage) {}
}
