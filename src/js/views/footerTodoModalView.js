import View from "./View";

class FooterTodoModalView extends View {
  _parentElement = document.querySelector(".todo-modal");

  addHandlerRender(handler) {
    handler();
    this._addHandlerAddItemBtn();
  }

  // Evidence of necesssity ro the further modularization
  _updateSwitchCategory() {
    /*
      Update 6 things for the Category Change
      1. currDir
      2. length for 3 categories
      3. todo-content-default-display
      4. mainText, subText
      4-1. addItemBtn
      5. Items
      6. input Display
    */
    const currDir = this._parentElement.querySelector(".currDir");
    currDir.textContent = this._data.todo.currDir;

    const categories = this._parentElement
      .querySelector(".todo-category-modal")
      .querySelectorAll("div");
    categories[0].querySelector("span").textContent =
      this._data.todo.Inbox.length;
    categories[1].querySelector("span").textContent =
      this._data.todo.Today.length;
    categories[2].querySelector("span").textContent =
      this._data.todo.Done.length;

    const defaultContent = this._parentElement.querySelector(
      ".todo-content-default"
    );
    if (this._getCurrCategory().length > 0) {
      if (!defaultContent.classList.contains("hidden__none"))
        defaultContent.classList.add("hidden__none");
    } else {
      if (defaultContent.classList.contains("hidden__none"))
        defaultContent.classList.remove("hidden__none");
    }

    const mainText = this._parentElement.querySelector(".main-text");
    mainText.textContent = this._getMaintext();
    const subText = this._parentElement.querySelector(".sub-text");
    subText.textContent = this._getSubtext();

    const addItemBtn = this._parentElement.querySelector(".todo-add-item");
    if (this._getCurrCategory().length === 0) {
      if (addItemBtn.classList.contains("hidden__opacity")) {
        addItemBtn.classList.remove("hidden__opacity");
      }
    }

    const itemContainer = this._parentElement.querySelector(
      ".todo-item-container"
    );
    itemContainer.innerHTML = this._generateMarkupAllItems();

    const todoInput = this._parentElement.querySelector(".todo-input");
    if (this._getCurrCategory().length > 0) {
      if (todoInput.classList.contains("hidden__visibility"))
        todoInput.classList.remove("hidden__visibility");
    } else {
      if (!todoInput.classList.contains("hidden__visibility"))
        todoInput.classList.add("hidden__visibility");
    }
  }

  addHanlderSwitchCategory(handler) {
    this._parentElement.addEventListener("click", (e) => {
      if (e.target.closest(".sub-text")) {
        let newCategory = "Today";
        if (this._data.todo.currDir === "Today") newCategory = "Inbox";
        this._data = handler(newCategory);
        this._updateSwitchCategory();
        return;
      }
    });
  }

  addHandlerCategoryDropdown(handler) {
    const todoCategoryModal = this._parentElement.querySelector(
      ".todo-category-modal"
    );
    this._parentElement.addEventListener("click", (e) => {
      if (e.target.closest(".todo-category")) {
        if (getComputedStyle(todoCategoryModal).display !== "flex") {
          todoCategoryModal.style.display = "flex";
          return;
        }
        todoCategoryModal.style.display = "none";
        let newCategory = e.target.dataset.category;
        if (!newCategory) return;
        this._data = handler(newCategory);
        this._updateSwitchCategory();
        return;
      }
    });
  }

  // Add, delete, move, edit
  addHandlerAddItem(handler) {
    const todoContentDefault = this._parentElement.querySelector(
      ".todo-content-default"
    );
    const itemContainer = this._parentElement.querySelector(
      ".todo-item-container"
    );

    this._parentElement.addEventListener("submit", (e) => {
      e.preventDefault();
      const newItemInput = e.target.elements["newItem"];
      const newItemInputValue = newItemInput.value;
      newItemInput.value = "";
      this._data = handler(newItemInputValue);

      if (!todoContentDefault.classList.contains("hidden__none")) {
        todoContentDefault.classList.add("hidden__none");
      }

      const newItem = {
        checked: false,
        name: newItemInputValue,
      };
      const itemMarkup = this._generateMarkupItem(newItem);
      itemContainer.insertAdjacentHTML("beforeend", itemMarkup);
    });
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

  // prettier-ignore
  _generateMarkup() {
    return `
      <div class="todo-category">
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
      </div>
      <div class="todo-content">
        <div class="todo-content-default ${this._getCurrCategory().length > 0 ? "hidden__none" : ""}">
          <span class="main-text">
            ${this._getMaintext()}
          </span>
          <span class="sub-text">
            <span>${this._getSubtext()}</span>
            <i class="fas fa-chevron-right"></i>
          </span>
          <button class="todo-add-item">New Todo</button>
        </div>
        <div class="todo-item-container">${this._generateMarkupAllItems()}</div>
        <form class="todo-input-form">
          <input class="todo-input ${this._getCurrCategory().length > 0 ? "" : "hidden__visibility"}" 
                type="text"
                name="newItem" 
                placeholder="New Todo" />
        </form>
      </div>
    `;
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
        subText = `${this._data.Inbox.length} todo in Inbox`;
      }
    } else {
      subText = "Get started in Today";
    }
    return subText;
  }

  _getCurrCategory() {
    return this._data.todo[this._data.todo.currDir];
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

export default new FooterTodoModalView();
