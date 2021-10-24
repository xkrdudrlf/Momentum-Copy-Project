import * as config from "../config";

const headerSearch = document.querySelector(".header-search");
const headerSearchUnderline = headerSearch.querySelector(
  ".header-search-underline"
);
const headerSearchForm = headerSearch.querySelector(".header-search-form");
const headerSearchRight = headerSearch.querySelector(".header-search-right");
const headerSearchEngine = headerSearchRight.querySelector(".search-engine");
const headerSearchEngineDropdown = headerSearchRight.querySelector(
  ".search-engine-dropdown"
);

///////////////////////////////////////////
///////////////////////////////////////////
// 1. Header Search Engine
///////////////////////////////////////////
///////////////////////////////////////////
const state = {
  opacity: {
    searchUnderline: 0,
    searchRight: 0,
  },
  searchEngineDropdownDisplay: "none",
  searchInputFocused: false,
};

// 0. Global Click Display Logic
window.addEventListener("click", (e) => {
  if (!e.target.closest(".header-search")) {
    state.searchInputFocused = false;

    headerSearchUnderline.style.opacity = "0";
    headerSearchRight.style.opacity = "0";
    state.opacity.searchUnderline = "0";
    state.opacity.searchRight = "0";

    headerSearchEngineDropdown.style.display = "none";
    state.searchEngineDropdownDisplay = "none";
  }
});

// 1-1. Header Search Underline/Right Display
headerSearch.addEventListener("mouseenter", () => {
  if (state.searchInputFocused) return;
  headerSearchUnderline.style.opacity = "0.6";
  headerSearchRight.style.opacity = "0.6";
  state.opacity.searchUnderline = "0.6";
  state.opacity.searchRight = "0.6";
});

headerSearch.addEventListener("mouseleave", (e) => {
  if (state.searchInputFocused) return;
  headerSearchUnderline.style.opacity = "0";
  headerSearchRight.style.opacity = "0";
  state.opacity.searchUnderline = "0";
  state.opacity.searchRight = "0";
});

// 1-2. Header Search Engine Dropdown Display
headerSearch.addEventListener("click", (e) => {
  headerSearchUnderline.style.opacity = "1";
  headerSearchRight.style.opacity = "1";
  state.opacity.searchUnderline = "1";
  state.opacity.searchRight = "1";
  if (e.target.closest(".header-search-right")) {
    if (state.searchEngineDropdownDisplay === "flex") {
      headerSearchEngineDropdown.style.display = "none";
      state.searchEngineDropdownDisplay = "none";
    } else {
      headerSearchEngineDropdown.style.display = "flex";
      state.searchEngineDropdownDisplay = "flex";
    }
  } else {
    headerSearchEngineDropdown.style.display = "none";
    state.searchEngineDropdownDisplay = "none";

    headerSearch.querySelector("input").focus();
    state.searchInputFocused = true;
  }
});

// 1-3. Header Search Engine Dropdown Selection
headerSearchEngineDropdown.addEventListener("click", (e) => {
  if (e.target.tagName !== "UL") {
    e.stopPropagation();
    return;
  }
  const selectedSearchEngine = e.target.querySelector("img");
  headerSearchEngine.querySelector("img").remove();
  headerSearchEngine.prepend(selectedSearchEngine.cloneNode(true));

  headerSearch.querySelector("input").focus();
  state.searchInputFocused = true;
});

// 1-4. Header Search Form
headerSearch.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchKeyword = e.target.querySelector("input").value;
  const currSearchEngine =
    headerSearchEngine.querySelector("img").dataset.engineName;

  let searchURL;
  if (currSearchEngine !== "duckduckgo") {
    searchURL = `https://www.${currSearchEngine}.com/search?q=${searchKeyword}`;
  } else {
    searchURL = `https://duckduckgo.com/?q=${searchKeyword}`;
  }

  window.location.replace(searchURL);
});

/*
  To do [Tomrrow]:
    1. Refactoring the code for header left into the View/Controller 
    2. Finish header weather app[not till refactoring though]
*/

export const init = function () {};

init();
