import View from "./View";

export default class MainHeadingView extends View {
  _settingsContainer;
  _settingsBtn;
  _settingsModal;

  _addHandlerOutsideClick() {
    window.addEventListener("click", (e) => {
      if (!this._parentElement.contains(e.target)) {
        if (getComputedStyle(this._settingsBtn).visibility === "visible")
          this._settingsBtn.style.visibility = "hidden";
        if (getComputedStyle(this._settingsModal).visibility === "visible")
          this._settingsModal.style.visibility = "hidden";
        return;
      }

      if (!this._settingsContainer.contains(e.target)) {
        if (getComputedStyle(this._settingsModal).visibility === "visible")
          this._settingsModal.style.visibility = "hidden";
        return;
      }
    });
  }

  _addingHandlerSettingsDisplay() {
    // Show & Hide SettingsBtn
    this._parentElement.addEventListener("mouseenter", () => {
      this._settingsBtn.style.visibility = "visible";
    });

    this._parentElement.addEventListener("mouseleave", () => {
      if (getComputedStyle(this._settingsModal).visibility === "visible")
        return;
      this._settingsBtn.style.visibility = "hidden";
    });

    // Show & Hide SettingsModal
    this._settingsBtn.addEventListener("click", (e) => {
      if (
        window.getComputedStyle(this._settingsModal).visibility === "hidden"
      ) {
        this._settingsBtn.style.visibility = "visible";
        this._settingsModal.style.visibility = "visible";
      } else {
        this._settingsModal.style.visibility = "hidden";
      }
    });
  }
}
