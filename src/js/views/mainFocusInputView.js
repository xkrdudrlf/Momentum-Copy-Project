import View from "./View";

class MainFocusInputView extends View {
  _parentElement = document.querySelector(".focus-input-container");

  addHandlerRender(handler) {
    handler();
    if (this._data.mode !== "input") {
      this._parentElement.style.display = "none";
      this._parentElement.style.opacity = 0;
    }
  }

  addHandlerFocusTaskInput(handler) {
    const focusInput = this._parentElement.querySelector("#focus-input");
    this._parentElement.addEventListener("submit", (e) => {
      e.preventDefault();
      if (focusInput.value === "") return;

      this._parentElement.style.opacity = 0;
      handler(focusInput.value);
    });
  }

  display(updatedFocusTask) {
    this._parentElement.style.display = "flex";
    this._parentElement.style.opacity = 1;
    const focusInput = this._parentElement.querySelector("#focus-input");
    focusInput.value = updatedFocusTask;
  }

  hide() {
    this._parentElement.style.opacity = 0;
    setTimeout(() => {
      this._parentElement.style.display = "none";
    }, 1000);
  }

  _generateMarkup() {
    return `
      <span class="focus-heading">
        What is your main focus for today?
      </span>
      <form>
        <input type="text" 
               name="focus" 
               id="focus-input" 
               value="${this._data.focusTask}"
               autocomplete="off"
        />
      </form>
    `;
  }
}

export default new MainFocusInputView();
