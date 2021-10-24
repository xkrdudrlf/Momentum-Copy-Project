import * as model from "../models/headerSearchModel";
import headerSearchView from "../views/headerSearchView";

// 0. Global Click Display Logic
const controlOutsideClick = function () {
  model.state.searchInputFocused = false;

  model.state.opacity.searchUnderline = "0";
  model.state.opacity.searchRight = "0";

  model.state.searchEngineDropdownDisplay = "none";
};

// 1. Header Search Underline/Right Display
const controlSearchOpacity = function (event) {
  if (model.state.searchInputFocused) return false;
  if (model.state.searchEngineDropdownDisplay === "flex") return false;

  if (event === "mouseenter") {
    model.setSearchOpacity("0.6");
  }
  if (event === "mouseleave") {
    model.setSearchOpacity("0");
  }

  return true;
};

// 2. Header Search Engine Dropdown Display
const controlSearchEngineDropdownDisplay = function (
  displayStatus,
  searchInputFocused
) {
  model.setSearchOpacity("1");

  model.setSearchEngineDropdownDisplay(displayStatus);

  if (searchInputFocused === null) return;
  model.setSearchInputFocused(searchInputFocused);
};

// 3. Header Search Engine Dropdown Selection
const controlSearchEngineDropdownSelection = function () {
  model.setSearchInputFocused(true);
};

// 4. Header Search Form
const controlSearchForm = function (searchURL) {
  window.location.replace(searchURL);
};

export const init = function () {
  headerSearchView.render();
  headerSearchView.addHandlerOutsideClick(controlOutsideClick);
  headerSearchView.addHandlerSearchOpacity(controlSearchOpacity);
  headerSearchView.addHandlerSearchEngineDropdownDisplay(
    controlSearchEngineDropdownDisplay
  );
  headerSearchView.addHandlerSearchEngineDropdownSelection(
    controlSearchEngineDropdownSelection
  );
  headerSearchView.addHandlerSearchForm(controlSearchForm);
};
