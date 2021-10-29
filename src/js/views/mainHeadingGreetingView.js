import MainHeadingView from "./mainHeadingView";

class MainHeadingGreetingView extends MainHeadingView {
  _parentElement = document.querySelector(".greeting-container");

  addHandlerRender(handler) {
    handler();

    this._settingsContainer =
      this._parentElement.querySelector(".name-settings");
    this._settingsBtn = this._parentElement.querySelector(".name-settings-btn");
    this._settingsModal = this._parentElement.querySelector(
      ".name-settings-modal-container"
    );

    this._addHandlerOutsideClickExtended();
    this._addHandlerRegularGreetingUpdate();
    this._addingHandlerSettingsDisplay();
  }

  _addHandlerOutsideClickExtended() {
    this._addHandlerOutsideClick();
    const usernameContainer = this._parentElement.querySelector(
      "#username-container"
    );
    const usernameInput = this._parentElement.querySelector("#username");
    window.addEventListener("click", (e) => {
      if (!this._parentElement.contains(e.target)) {
        usernameInput.style.opacity = 0;
        usernameInput.disabled = true;
        usernameContainer.style.opacity = 1;
      }
    });
  }

  addHandlerEditUsername(handler) {
    // Mimic Auto-sizing Input Effect
    const usernameContainer = this._parentElement.querySelector(
      "#username-container"
    );
    const usernameInput = this._parentElement.querySelector("#username");
    usernameContainer.textContent = usernameInput.value;
    usernameInput.style.width = usernameContainer.offsetWidth + "px";

    this._parentElement.addEventListener("input", (e) => {
      usernameContainer.textContent = usernameInput.value;
      usernameInput.style.width = usernameContainer.offsetWidth + "px";
    });

    // Hide Input & Show Container & Update username
    this._parentElement.addEventListener("submit", (e) => {
      e.preventDefault();

      usernameInput.style.opacity = 0;
      usernameInput.disabled = true;
      usernameContainer.style.opacity = 1;

      const updatedUsername = e.target.elements["username"].value;
      handler(updatedUsername);
    });

    // Show Input & Hide Container
    this._parentElement.addEventListener("click", (e) => {
      if (e.target.classList.contains("name-settings-modal-item")) {
        this._settingsBtn.style.visibility = "hidden";
        this._settingsModal.style.visibility = "hidden";
        usernameContainer.style.opacity = 0;
        usernameInput.disabled = false;
        usernameInput.style.opacity = 1;
        usernameInput.focus();
      }
    });
  }
  // prettier-ignore
  _addHandlerRegularGreetingUpdate() {
    const greetingMsgTime = this._parentElement.querySelector(
      "#greeting-message-time"
    );
    setInterval(() => {
      const today = new Date();
      const hours = today.getHours() % 24;
      const greetingMessage =
        hours > 18  ? "Good evening" : 
        hours > 11  ? "Good afternoon" :
        hours > 4   ? "Good morning" : "Good evening";
        
      greetingMsgTime.textContent = `${greetingMessage}, `;
    }, 500);
  }

  // prettier-ignore
  _generateMarkup() {
    const today = new Date();
    const hours = today.getHours() % 24;
    const greetingMessage =
      hours > 18  ? "Good evening" : 
      hours > 11  ? "Good afternoon" :
      hours > 4   ? "Good morning" : "Good evening";

    return `
      <span class="greeting-message">
        <span id="greeting-message-time">${greetingMessage}, </span>
        <span id="username-container"></span>
        <form id="username-form">
          <input type="text" id="username" name="username" value="${this._data.username}" disabled>
        </form>
      </span>
      <div class="name-settings">
        <i class="fas fa-ellipsis-h name-settings-btn"></i>
        <div class="name-settings-modal-container">
          <div class="name-settings-modal-arrow-up"></div>
          <div class="name-settings-modal">
            <div class="name-settings-modal-item">Edit your name</div>
          </div>
        </div>
      </div>
    `;
  }
}

export default new MainHeadingGreetingView();
