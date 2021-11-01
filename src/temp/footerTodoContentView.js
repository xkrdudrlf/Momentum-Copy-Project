import View from "./View";

class FooterTodoContentView extends View {
  _parentElement = document.querySelector(".todo-content");

  addHandlerRender(handler) {
    handler();
    this._addHandlerAddItemBtn();
  }

  // prettier-ignore
  _addHandlerAddItemBtn() {
    const todoAddItemBtn = this._parentElement.querySelector(".todo-add-item");
    const todoInput = this._parentElement.querySelector(".todo-input");
    this._parentElement.addEventListener("click", (e) => {
      if (e.target === todoAddItemBtn) {
        todoAddItemBtn.classList.add("hidden__opacity");
        todoInput.classList.remove("hidden__visibility");
      }
    });
  }

  _generateMarkup() {
    return `
      <div class="todo-content-default ${
        this._getCurrCategory().length > 0 ? "hidden__none" : ""
      }">
        <span class="main-text">
          ${this._getMaintext()}
        </span>
        <span class="sub-text">
          <span>${this._getSubtext()}</span>
          <i class="fas fa-chevron-right"></i>
        </span>
        <button class="todo-add-item">New Todo</button>
      </div>
      <div class="todo-item-container">
        ${this._generateMarkupAllItems()}
      </div>
      <form class="todo-input-form">
        <input class="todo-input ${
          this._getCurrCategory().length > 0 ? "" : "hidden__visibility"
        }" 
              type="text"
              name="newItem" 
              placeholder="New Todo"
              autocomplete="off"
        />
      </form>
    `;
  }

  _getCurrCategory() {
    return this._data.todo[this._data.todo.currDir];
  }

  _getMaintext() {
    let mainText;
    if (this._data.todo.currDir === "Inbox") {
      mainText = "Add a todo to get started";
    } else if (this._data.todo.currDir === "Today") {
      if (this._data.todo.Inbox.length === 0) {
        mainText = "Add a todo to get started";
      } else {
        mainText = "No todos yet";
      }
    } else {
      mainText = "No completed todos yet";
    }
    return mainText;
  }

  _getSubtext() {
    let subText;
    if (this._data.todo.currDir === "Inbox") {
      subText = "Switch to Today";
    } else if (this._data.todo.currDir === "Today") {
      if (this._data.todo.Inbox.length === 0) {
        subText = "Switch to Inbox";
      } else {
        subText = `${this._data.todo.Inbox.length} todo in Inbox`;
      }
    } else {
      subText = "Get started in Today";
    }
    return subText;
  }

  _generateMarkupAllItems() {
    return this._getCurrCategory()
      .map((item) => this._generateMarkupItem(item))
      .join("");
  }

  _generateMarkupItem(itemData) {
    return `
      <div class="todo-content-item">
        <div class="todo-content-item-left">
          <input type="checkbox" ${itemData.checked ? "checked" : ""}/>
          ${itemData.name}
        </div>
        <span class="todo-content-item-right">
          <div class="todo-item-settings-modal">
            <div class="edit">Edit</div>
            <div class="moveToToday">Move to Today</div>
            <div class="moveToOther">Move to...</div>
            <div class="delete">Delete</div>
          </div>
          <i class="fas fa-ellipsis-h todo-item-settings"></i>
        </span>
      </div>
    `;
  }
}

export default new FooterTodoContentView();
