import MainHeadingView from "./mainHeadingView";

class MainHeadingTimeView extends MainHeadingView {
  _parentElement = document.querySelector(".time-container");

  addHandlerRender(handler) {
    handler();
    this._settingsContainer =
      this._parentElement.querySelector(".time-settings");
    this._settingsBtn = this._parentElement.querySelector(".time-settings-btn");
    this._settingsModal = this._parentElement.querySelector(
      ".time-settings-modal-container"
    );

    this._addHandlerOutsideClick();
    this._addHandlerRegularTimeUpdate();
    this._addingHandlerSettingsDisplay();
    this._addHandlerClockModeToggle();
  }

  _addHandlerRegularTimeUpdate() {
    const timeSpan = this._parentElement.querySelector(".time");
    setInterval(() => {
      const today = new Date();
      const hours = today.getHours() % this._data.clockMode;
      let minutes = today.getMinutes();
      minutes = minutes > 9 ? minutes : "0" + `${minutes}`;
      const time = hours + ":" + minutes;

      timeSpan.textContent = time;
    }, 500);
  }

  _addHandlerClockModeToggle() {
    this._parentElement.addEventListener("click", (e) => {
      if (e.target.classList.contains("clock-mode-toggler")) {
        this._data.clockMode = this._data.clockMode === 24 ? 12 : 24;
      }
    });
  }

  _generateMarkup() {
    const today = new Date();
    const hours = today.getHours() % this._data.clockMode;
    let minutes = today.getMinutes();
    minutes = minutes > 9 ? minutes : "0" + `${minutes}`;
    const time = hours + ":" + minutes;

    return `
      <span class="time">${time}</span>
      <div class="time-settings">
        <i class="fas fa-ellipsis-h time-settings-btn"></i>
        <div class="time-settings-modal-container">
          <div class="time-settings-modal-arrow-up"></div>
          <div class="time-settings-modal">
            <div class="time-settings-modal-item">
              24-hour clock
              <label class="switch">
                <input class="clock-mode-toggler" type="checkbox" />
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

export default new MainHeadingTimeView();
