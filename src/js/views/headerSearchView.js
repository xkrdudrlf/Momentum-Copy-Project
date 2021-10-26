import images from "../../img/*.svg";
import View from "./View";

class HeaderSearchView extends View {
  _parentElement = document.querySelector(".header-search");

  addHandlerSearchOpacity(handler) {
    this._parentElement.addEventListener("mouseenter", () => {
      if (!handler("mouseenter")) return;
      this._setSearchOpacity("0.6");
    });

    this._parentElement.addEventListener("mouseleave", () => {
      if (!handler("mouseleave")) return;
      this._setSearchOpacity("0");
    });
  }

  addHandlerSearchEngineDropdownDisplay(handler) {
    const headerSearchEngineDropdown = this._parentElement.querySelector(
      ".search-engine-dropdown"
    );

    this._parentElement.addEventListener("click", (e) => {
      let displayStatus;
      let searchInputFocused = null;
      if (e.target.closest(".header-search-right")) {
        if (headerSearchEngineDropdown.style.display === "flex") {
          displayStatus = "none";
        } else {
          displayStatus = "flex";
        }
      } else {
        displayStatus = "none";
        this._parentElement.querySelector("input").focus();
        searchInputFocused = true;
      }

      headerSearchEngineDropdown.style.display = displayStatus;

      this._setSearchOpacity("1");
      handler(displayStatus, searchInputFocused);
    });
  }

  addHandlerSearchEngineDropdownSelection(handler) {
    const headerSearchEngineDropdown = this._parentElement.querySelector(
      ".search-engine-dropdown"
    );
    const headerSearchEngine =
      this._parentElement.querySelector(".search-engine");

    headerSearchEngineDropdown.addEventListener("click", (e) => {
      if (e.target.tagName !== "UL") {
        e.stopPropagation();
        return;
      }
      const selectedSearchEngine = e.target.querySelector("img");
      headerSearchEngine.querySelector("img").remove();
      headerSearchEngine.prepend(selectedSearchEngine.cloneNode(true));

      this._parentElement.querySelector("input").focus();
      handler();
    });
  }

  addHandlerSearchForm(handler) {
    this._parentElement.addEventListener("submit", (e) => {
      e.preventDefault();
      const searchKeyword = e.target.querySelector("input").value;
      const headerSearchEngine =
        this._parentElement.querySelector(".search-engine");
      const currSearchEngine =
        headerSearchEngine.querySelector("img").dataset.engineName;

      let searchURL;
      if (currSearchEngine !== "duckduckgo") {
        searchURL = `https://www.${currSearchEngine}.com/search?q=${searchKeyword}`;
      } else {
        searchURL = `https://duckduckgo.com/?q=${searchKeyword}`;
      }
      handler(searchURL);
    });
  }

  addHandlerOutsideClick(handler) {
    const headerSearchUnderline = this._parentElement.querySelector(
      ".header-search-underline"
    );
    const headerSearchRight = this._parentElement.querySelector(
      ".header-search-right"
    );
    const headerSearchEngineDropdown = headerSearchRight.querySelector(
      ".search-engine-dropdown"
    );

    window.addEventListener("click", (e) => {
      if (!e.target.closest(".header-search")) {
        headerSearchUnderline.style.opacity = "0";
        headerSearchRight.style.opacity = "0";
        headerSearchEngineDropdown.style.display = "none";
        handler();
      }
    });
  }

  _setSearchOpacity(opacity) {
    const headerSearchUnderline = this._parentElement.querySelector(
      ".header-search-underline"
    );
    const headerSearchRight = this._parentElement.querySelector(
      ".header-search-right"
    );
    headerSearchUnderline.style.opacity = opacity;
    headerSearchRight.style.opacity = opacity;
  }

  _generateMarkup() {
    return `
      <div class="header-search-underline"></div>
      <div class="header-search-left">
        <i class="fas fa-search"></i>
      </div>
      <div class="header-search-center">
        <form class="header-search-form">
          <input class="header-search-input" type="text" />
        </form>
      </div>
      <div class="header-search-right">
        <div class="search-engine">
          <img
            src=${images["google"]}
            alt="google-icon"
            height="15"
            width="15"
            data-engine-name="google"
          />
          <i class="fas fa-caret-down"></i>
        </div>
        <div class="search-engine-dropdown">
          <header>SEARCH WITH</header>
          <ul>
            <img
              src=${images["google"]}
              alt="google-icon"
              height="15"
              width="15"
              data-engine-name="google"
            />
            Google
          </ul>
          <ul>
            <img
              src=${images["bing"]}
              alt="bing-icon"
              height="15"
              width="15"
              data-engine-name="bing"
            />
            Bing
          </ul>
          <ul>
            <img
              src=${images["duckduckgo"]}
              alt="duckduckgo-icon"
              height="15"
              width="15"
              data-engine-name="duckduckgo"
            />
            DuckDuckGo
          </ul>
        </div>
      </div>
    `;
  }
}

export default new HeaderSearchView();
