export const state = {
  opacity: {
    searchUnderline: 0,
    searchRight: 0,
  },
  searchEngineDropdownDisplay: "none",
  searchInputFocused: false,
};

export const setSearchOpacity = function (opacity) {
  state.opacity.searchUnderline = opacity;
  state.opacity.searchRight = opacity;
};

export const setSearchEngineDropdownDisplay = function (displayStatus) {
  state.searchEngineDropdownDisplay = displayStatus;
};

export const setSearchInputFocused = function (focused) {
  state.searchInputFocused = focused;
};
