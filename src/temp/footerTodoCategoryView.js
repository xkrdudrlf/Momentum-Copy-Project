import View from "./View";

class FooterTodoCategoryView extends View {
  _parentElement = document.querySelector(".todo-category");

  addHandlerRender(handler) {
    handler();
  }

  addHandlerCategoryDropdown(handler) {
    const todoCategoryModal = this._parentElement.querySelector(
      ".todo-category-modal"
    );
    this._parentElement.addEventListener("click", (e) => {
      if (getComputedStyle(todoCategoryModal).display !== "flex") {
        todoCategoryModal.style.display = "flex";
        return;
      }
      todoCategoryModal.style.display = "none";
      let newCategory = e.target.dataset.category;
      if (!newCategory) return;
      handler(newCategory);
    });
  }

  _generateMarkup() {
    return `
      <span class="currDir">${this._data.todo.currDir}</span>
      <i class="fas fa-chevron-down"></i>
      <div class="todo-category-modal">
        <div data-category="Inbox">
          Inbox <span>${this._data.todo.Inbox.length}</span>
        </div>
        <div data-category="Today">
          Today <span>${this._data.todo.Today.length}</span>
        </div>
        <div data-category="Done">
          Done <span>${this._data.todo.Done.length}</span>
        </div>
      </div>
    `;
  }
}

export default new FooterTodoCategoryView();
