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

// Hide dropdowns upon click on other element
window.addEventListener("click", (e) => {
  if (!e.target.closest(".header-search-right"))
    headerSearchEngineDropdown.style.opacity = "0";
});

///////////////////////////////////////////
///////////////////////////////////////////
// 1. Header Search Engine
///////////////////////////////////////////
///////////////////////////////////////////
// 1-1. Header Search Underline Display
headerSearch.addEventListener("mouseenter", () => {
  headerSearchUnderline.style.opacity = "1";
  headerSearchRight.style.opacity = "1";
});

headerSearch.addEventListener("mouseleave", () => {
  if (headerSearchEngineDropdown.style.opacity !== "0") return;
  headerSearchUnderline.style.opacity = "0";
  headerSearchRight.style.opacity = "0";
});

// 1-2. Header Search Engine Dropdown Display
headerSearchEngine.addEventListener("click", () => {
  if (headerSearchEngineDropdown.style.opacity === "0") {
    headerSearchEngineDropdown.style.opacity = config.DROPDOWN_OPACITY;
  } else headerSearchEngineDropdown.style.opacity = "0";
});

headerSearchEngineDropdown.addEventListener("click", (e) => {
  if (e.target.tagName !== "UL") return;
  const selectedSearchEngine = e.target.querySelector("img");
  headerSearchEngine.querySelector("img").remove();
  headerSearchEngine.prepend(selectedSearchEngine.cloneNode(true));
});

// 1-3. Header Search Form
headerSearchForm.addEventListener("submit", (e) => {
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
