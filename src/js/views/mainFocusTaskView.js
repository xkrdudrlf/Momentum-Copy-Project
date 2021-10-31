import View from "./View";

class MainFocusTaskView extends View {
  _parentElement = document.querySelector(".focus-task-container");

  addHandlerRender(handler) {
    handler();

    if (this._data.mode !== "task") {
      this._parentElement.style.display = "none";
      this._parentElement.style.opacity = 0;
    }

    this._addHandlerTaskCheckbox();
    this._addHandlerFocusSettingsModal();
  }

  addHandlerChangeFocusTask(handler) {
    const focusTaskCheckbox = this._parentElement.querySelector(
      ".focus-task-checkbox"
    );
    const focusTaskContent = this._parentElement.querySelector(
      ".focus-task-content"
    );

    this._parentElement.addEventListener("click", (e) => {
      if (e.target.classList.contains("edit-focus-task")) {
        focusTaskContent.style.textDecoration = "none";
        focusTaskCheckbox.checked = false;
        handler(this._data.focusTask);
        return;
      }

      if (e.target.classList.contains("clear-focus-task")) {
        focusTaskContent.style.textDecoration = "none";
        focusTaskCheckbox.checked = false;
        handler("");
        return;
      }
    });
  }

  _addHandlerTaskCheckbox() {
    const focusTaskContent = this._parentElement.querySelector(
      ".focus-task-content"
    );
    this._parentElement.addEventListener("change", (e) => {
      if (e.target.checked) {
        focusTaskContent.style.textDecoration = "line-through";
      } else {
        focusTaskContent.style.textDecoration = "none";
      }
    });
  }

  _addHandlerFocusSettingsModal() {
    const focusSettingsModalContainer = this._parentElement.querySelector(
      ".focus-settings-modal-container"
    );
    window.addEventListener("click", (e) => {
      if (e.target.classList.contains("focus-settings-btn")) {
        if (getComputedStyle(focusSettingsModalContainer).display === "none") {
          focusSettingsModalContainer.style.display = "block";
        } else {
          focusSettingsModalContainer.style.display = "none";
        }
      } else {
        focusSettingsModalContainer.style.display = "none";
      }
    });
  }

  display(updatedFocusTask) {
    this._parentElement.style.display = "flex";
    this._parentElement.style.opacity = 1;
    const focusTaskContent = this._parentElement.querySelector(
      ".focus-task-content"
    );
    focusTaskContent.textContent = updatedFocusTask;
  }

  hide() {
    this._parentElement.style.opacity = 0;

    setTimeout(() => {
      this._parentElement.style.display = "none";
    }, 1000);
  }

  _generateMarkup() {
    return `
      <label>Today</label>
      <div class="focus-task">
        <input class="focus-task-checkbox" type="checkbox" />
        <span class="focus-task-content">${this._data.focusTask}</span>
        <div class="focus-settings">
          <i class="fas fa-ellipsis-h focus-settings-btn"></i>
          <div class="focus-settings-modal-container">
            <div class="focus-settings-modal-arrow-up"></div>
            <div class="focus-settings-modal">
              <div class="focus-settings-modal-item edit-focus-task">
                <i class="fas fa-edit"></i> Edit
              </div>
              <div class="focus-settings-modal-item clear-focus-task">
                <i class="fas fa-times"></i>Clear
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

export default new MainFocusTaskView();
