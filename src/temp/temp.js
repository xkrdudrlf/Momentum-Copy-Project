import View from "./View";

class FooterTodoModalView extends View {
  _parentElement = document.querySelector(".todo-modal");
  _currDir;
  _defaultContent;
  _mainText;
  _subText;
  _addItemBtn;
  _itemContainer;
  _todoInput;
  _categoryModal;
  _openSettingsModal = null;
  _openSettingsModalOverlay = null;

  addHandlerRender(handler) {
    handler();
    this._setChangingElements();
    this._addHandlerDisplay();
    this._addHandlerAddItemBtn();
    this._addHandlerTodoItemSettings();
    this._addHandlerClickOutsideCloseModal();
  }

  _addHandlerDisplay() {
    window.addEventListener("click", (e) => {
      if (e.target.classList.contains("todo-btn")) {
        if (getComputedStyle(this._parentElement).display === "flex") {
          this._parentElement.style.display = "none";
        } else {
          this._parentElement.style.display = "flex";
        }
      }
    });
  }

  addHanlderSwitchCategory(handler) {
    this._parentElement.addEventListener("click", (e) => {
      if (e.target.closest(".sub-text")) {
        let newCategory = "Today";
        if (this._data.todo.currDir === "Today") newCategory = "Inbox";
        handler(newCategory);
      }
    });
  }

  addHandlerCategoryDropdown(handler) {
    this._parentElement.addEventListener("click", (e) => {
      if (e.target.closest(".todo-category")) {
        if (getComputedStyle(this._categoryModal).display !== "flex") {
          this._resizeTodoModalOpen();
          this._categoryModal.style.display = "flex";
        } else {
          this._resizeTodoModalClose();
          this._categoryModal.style.display = "none";
          let newCategory = e.target.dataset.category;
          if (newCategory) handler(newCategory);
        }
      }
    });
  }

  addHandlerAddItem(handler) {
    const addItemInputForm = this._todoInput.closest("form");
    addItemInputForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newItemInput = e.target.elements["newItem"];
      const newItemInputValue = newItemInput.value;
      newItemInput.value = "";
      this._data = handler(newItemInputValue);

      if (!this._defaultContent.classList.contains("hidden__none")) {
        this._defaultContent.classList.add("hidden__none");
      }

      const newItem =
        this._getCurrCategory()[this._getCurrCategory().length - 1];
      const itemMarkup = this._generateMarkupItem(newItem);
      this._itemContainer.insertAdjacentHTML("beforeend", itemMarkup);

      this.update(this._data);
    });
  }

  addHandlerItemCheckbox(handler) {
    this._parentElement.addEventListener("click", (e) => {
      if (e.target.type === "checkbox") {
        const itemContent = e.target.closest(".todo-content-item-left");
        if (e.target.checked) {
          itemContent.style.textDecoration = "line-through";
        } else {
          itemContent.style.textDecoration = "";
        }

        const updatedItem = {
          checked: e.target.checked,
          name: itemContent.textContent,
          id: e.target.dataset.id,
        };

        handler(updatedItem);
      }
    });
  }

  addHandlerMoveItem(handler) {
    this._parentElement.addEventListener("click", (e) => {
      if (e.target.classList.contains("move")) {
        const todoContentItem = e.target.closest(".todo-content-item");
        const itemId = e.target.parentElement.dataset.id;
        todoContentItem.remove();

        const destCategory = e.target.dataset.category;
        handler(destCategory, itemId);
      }
    });
  }

  addHandlerDeleteItem(handler) {
    this._parentElement.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete")) {
        const todoContentItem = e.target.closest(".todo-content-item");
        const itemId = e.target.parentElement.dataset.id;
        todoContentItem.remove();
        handler(itemId);
      }
    });
  }

  // prettier-ignore
  addHandlerUpdateItem(handler) {
    // [Edit] Enable todoEditInput & Hide todoItemSettings Modal
    this._parentElement.addEventListener("click", (e) => {
      if (e.target.classList.contains("edit")) {
        const todoContentItem = e.target.closest(".todo-content-item");
        const settingsModalOverlay = todoContentItem.querySelector(".todo-item-settings-modal-overlay");
        const [todoSpan, todoEditInput] = todoContentItem.querySelector("form").children;
        e.target.parentElement.style.display = "none";
        settingsModalOverlay.style.display = "none";

        todoSpan.style.visibility = "hidden";
        todoEditInput.style.visibility = "visible";
        todoEditInput.disabled = false;
        todoEditInput.focus();
      }
    });

    // [Submit] Disable todoEditInput on Focusout
    this._parentElement.addEventListener("focusout", (e) => {
      if (e.target.type === "text" && !e.target.classList.contains("todo-input")) {
        const todoEditInput = e.target; 
        todoEditInput.style.visibility = "hidden";
        todoEditInput.disabled = true;

        const todoSpan = todoEditInput.previousElementSibling;
        todoSpan.textContent = todoEditInput.value;
        todoSpan.style.visibility = "visible";

        const updatedItem = {
          checked: this._getCurrCategory()[e.target.dataset.id].checked,
          name: todoSpan.textContent,
          id: e.target.dataset.id,
        };

        handler(updatedItem);
      }
    });

    // [Submit] Disable todoEditInput on form submit
    this._parentElement.addEventListener("submit", (e) => {
      if (e.target.closest(".todo-item-container")) {
        e.preventDefault();
        const todoEditInput = e.target.querySelector("input");
        todoEditInput.style.visibility = "hidden";
        todoEditInput.disabled = true;

        const todoSpan = todoEditInput.previousElementSibling;
        todoSpan.textContent = todoEditInput.value;
        todoSpan.style.visibility = "visible";

        const updatedItem = {
          checked: this._getCurrCategory()[todoEditInput.dataset.id].checked,
          name: todoSpan.textContent,
          id: todoEditInput.dataset.id,
        };

        handler(updatedItem);
      }
    });
  }

  update(data) {
    this._data = data;
    // 1. Update currDir
    this._currDir.textContent = this._data.todo.currDir;

    // 2. Update lengths of categories
    this._categories[0].querySelector("span").textContent =
      this._data.todo.Inbox.length;
    this._categories[1].querySelector("span").textContent =
      this._data.todo.Today.length;
    this._categories[2].querySelector("span").textContent =
      this._data.todo.Done.length;

    // 3. Update display of todo-content-default
    if (this._getCurrCategory().length > 0) {
      if (!this._defaultContent.classList.contains("hidden__none"))
        this._defaultContent.classList.add("hidden__none");
    } else {
      if (this._defaultContent.classList.contains("hidden__none"))
        this._defaultContent.classList.remove("hidden__none");
    }

    // 4. Update mainText & subText
    this._mainText.textContent = this._getMaintext();
    this._subText.textContent = this._getSubtext();

    // 5. Update addItemBtn
    if (this._getCurrCategory().length === 0) {
      if (this._addItemBtn.classList.contains("hidden__opacity")) {
        this._addItemBtn.classList.remove("hidden__opacity");
      }
    }

    // 6. Update todoItems
    this._itemContainer.innerHTML = this._generateMarkupAllItems();

    // 7. Update display of todoInput
    if (this._getCurrCategory().length > 0) {
      if (this._todoInput.classList.contains("hidden__visibility"))
        this._todoInput.classList.remove("hidden__visibility");
    } else {
      if (!this._todoInput.classList.contains("hidden__visibility"))
        this._todoInput.classList.add("hidden__visibility");
    }
  }

  // prettier-ignore
  _addHandlerAddItemBtn() {
    this._parentElement.addEventListener("click", (e) => {
      if (e.target === this._addItemBtn) {
        this._addItemBtn.classList.add("hidden__opacity");
        this._todoInput.classList.remove("hidden__visibility");
      }
    });
  }

  _addHandlerClickOutsideCloseModal() {
    window.addEventListener("click", (e) => {
      if (this._openSettingsModal && this._openSettingsModalOverlay) {
        if (!e.target.closest(".todo-content-item-right")) {
          this._openSettingsModal.style.display = "none";
          this._openSettingsModalOverlay.style.display = "none";
          this._openSettingsModal = null;
          this._openSettingsModalOverlay = null;
        }
      }

      if (this._categoryModal.style.display === "flex") {
        if (!e.target.closest(".todo-category")) {
          this._resizeTodoModalClose();
          this._categoryModal.style.display = "none";
        }
      }
    });
  }

  _addHandlerTodoItemSettings() {
    this._parentElement.addEventListener("click", (e) => {
      if (e.target.classList.contains("todo-item-settings")) {
        const todoItemSettingsModal = e.target.previousElementSibling;
        const modalOverlay = e.target.nextElementSibling;
        if (todoItemSettingsModal.style.display === "block") {
          todoItemSettingsModal.style.display = "none";
          modalOverlay.style.display = "none";
          this._openSettingsModal = null;
          this._openSettingsModalOverlay = null;
        } else {
          if (this._openSettingsModal && this._openSettingsModalOverlay) {
            this._openSettingsModal.style.display = "none";
            this._openSettingsModalOverlay.style.display = "none";
          }

          const todoContentItem = e.target.closest(".todo-content-item");
          const inputTop = this._todoInput.getBoundingClientRect().top;
          const settingsModalHeight = getComputedStyle(
            todoItemSettingsModal
          ).height.split("px")[0];
          const settingsModalBtm = e.target.getBoundingClientRect().bottom;

          if (inputTop - settingsModalBtm >= settingsModalHeight) {
            todoContentItem.style.height =
              getComputedStyle(todoContentItem).height;
            todoItemSettingsModal.style.top = "5px";
          } else {
          }

          todoItemSettingsModal.style.display = "block";
          modalOverlay.style.display = "block";
          this._openSettingsModal = todoItemSettingsModal;
          this._openSettingsModalOverlay = modalOverlay;
        }
      }
    });
  }

  _;

  _setChangingElements() {
    this._currDir = this._parentElement.querySelector(".currDir");
    this._categories = this._parentElement
      .querySelector(".todo-category-modal")
      .querySelectorAll("div");
    this._defaultContent = this._parentElement.querySelector(
      ".todo-content-default"
    );
    this._mainText = this._parentElement.querySelector(".main-text");
    this._subText = this._parentElement.querySelector(".sub-text");
    this._addItemBtn = this._parentElement.querySelector(".todo-add-item");
    this._itemContainer = this._parentElement.querySelector(
      ".todo-item-container"
    );
    this._todoInput = this._parentElement.querySelector(".todo-input");
    this._categoryModal = this._parentElement.querySelector(
      ".todo-category-modal"
    );
  }

  _resizeTodoModalOpen() {
    const todoTop = this._parentElement.querySelector(".todo-top");
    if (getComputedStyle(todoTop).height.split("px")[0] < 150) {
      todoTop.style.height = "150px";
    }
  }

  _resizeTodoModalClose() {
    const todoTop = this._parentElement.querySelector(".todo-top");
    const todoItemContainer = this._parentElement.querySelector(
      ".todo-item-container"
    );
    if (getComputedStyle(todoItemContainer).height.split("px")[0] < 150) {
      todoTop.style.height = "auto";
    }
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
        <div class="todo-top">
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
        </div>
        <form>
          <input class="todo-input ${this._getCurrCategory().length > 0 ? "" : "hidden__visibility"}" 
                type="text"
                name="newItem" 
                placeholder="New Todo"
                autocomplete="off"
          />
        </form>
      </div>
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
      <div class="todo-content-item" >
        <div class="todo-content-item-left">
          <input type="checkbox" 
                 ${itemData.checked ? "checked" : ""}
                 data-id="${itemData.id}"
          />
          <form>
            <span style="text-decoration: ${
              itemData.checked ? "line-through" : ""
            }">
              ${itemData.name}
            </span>
            <input type="text" 
                   value="${itemData.name}"
                   data-id="${itemData.id}" 
                   disabled>
          </form>
        </div>
        <span class="todo-content-item-right">
          <div class="todo-item-settings-modal"
               data-id="${itemData.id}">
            <div class="edit">Edit</div>
            ${["Inbox", "Today", "Done"]
              .map((dirName) => {
                if (dirName !== this._data.todo.currDir) {
                  return `
                    <div class="move" data-category="${dirName}">
                      Move to ${dirName}
                    </div>`;
                }
              })
              .join("")}
            <div class="delete">Delete</div>
          </div>
          <i class="fas fa-ellipsis-h todo-item-settings"></i>
        </span>
      </div>
    `;
  }
}

export default new FooterTodoModalView();
