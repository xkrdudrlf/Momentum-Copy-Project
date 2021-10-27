import * as config from "../config";
import View from "./View";

/*
  < To do >
  // 1. weather-box-current => dropdown toggle.
  2. ... button on the right-top corner of dropdown
    // - cursor: pointer;
    // - created submodal for ... click
    // - need to make a slider.
    // - Loading spinner implemented.
    // - modularize modal/slider with mixin
    // - toggle submodal

    // - toggle unit (metric <-> farenheit)
      // => update only the changed parts(temperatures/checkbox checked status)
      // => do not just render again.
    - find & edit location with changes applied to the rest of weather information
  3. weekly weather slot.
    - stress the current selected weather slot
    - select weather slot with changes applied to the rest of weather information
  4. regular update every certain minute or time.
    - give a user right to change for that
*/
class HeaderWeatherView extends View {
  _parentElement = document.querySelector(".header-right");

  addHandlerRender(handler) {
    window.addEventListener("load", () => {
      this.renderSpinner();

      handler();

      this._parentElement.addEventListener("click", (e) => {
        // Show & Hide Weekly Weather Option Submodal
        const weatherOptionContainer = this._parentElement.querySelector(
          ".weekly-weather-option-container"
        );
        if (e.target.classList.contains("weather-settings")) {
          if (
            window.getComputedStyle(weatherOptionContainer).display === "none"
          )
            weatherOptionContainer.style.display = "flex";
          else weatherOptionContainer.style.display = "none";
          return;
        }

        // Show & Hide Location Live Search Modal
        const locationSearchModal = this._parentElement.querySelector(
          ".location-search-modal"
        );
        if (e.target.classList.contains("edit-location")) {
          locationSearchModal.style.display = "flex";
          weatherOptionContainer.style.display = "none";
          return;
        }

        if (e.target.classList.contains("close-location-search")) {
          locationSearchModal.style.display = "none";
          return;
        }
      });
    });
  }

  addHandlerGetCurrentLocationWeather(handler) {
    // Update Weather Information based on the current location
    this._parentElement.addEventListener("click", () => {
      if (e.target.classList.contains("find-curr-location")) {
        locationSearchModal.style.display = "none";
        handler();
      }
    });
  }

  addHandlerWeeklyWeatherDropdownDisplay(handler) {
    this._parentElement.addEventListener("click", (e) => {
      if (!e.target.closest(".weather-box-current")) return;

      const weeklyWeatherDropdown = this._parentElement.querySelector(
        ".weather-box-weekly-dropdown"
      );

      if (weeklyWeatherDropdown.style.display === "none") {
        weeklyWeatherDropdown.style.display = "flex";
        handler("flex");
      } else {
        weeklyWeatherDropdown.style.display = "none";
        handler("none");
      }
    });
  }

  addHandlerToggleTempUnit(handler) {
    this._parentElement.addEventListener("click", (e) => {
      if (e.target.classList.contains("metricUnitCheckbox")) {
        handler();
      }
    });
  }

  addHandlerLocationLiveSearch(handler) {
    let inputTimer;

    // Get Search Keyword Input and Render the Search Results
    this._parentElement.addEventListener("keyup", (e) => {
      if (!e.target.classList.contains("location-search-input")) return;

      const searchResultContainer = this._parentElement.querySelector(
        ".location-search-results-container"
      );

      // 1. Do not respond when search keyworld lenght < 3
      if (e.target.value.length < config.MIN_SEARCH_INPUT_LENGTH) {
        if (window.getComputedStyle(searchResultContainer).display === "flex")
          searchResultContainer.style.display = "none";
        return;
      }

      // 2. Reset the timer and render the searchResult
      clearTimeout(inputTimer);

      if (window.getComputedStyle(searchResultContainer).display === "none") {
        searchResultContainer.style.display = "flex";
      }

      this.renderSpinner(".location-search-results-container");

      inputTimer = setTimeout(() => {
        handler(e.target.value);
      }, config.SEARCH_INPUT_DELAY_TIME);
    });
  }

  toggleTempUnit(data) {
    this._data = data;
    const currentTemp = this._parentElement.querySelectorAll(".currTemp");
    currentTemp.forEach((currTempNode) => {
      currTempNode.textContent = this._data.weather.current.temp + "°";
    });

    const weeklyWeatherItems = this._parentElement.querySelectorAll(
      ".weekly-weather-item"
    );
    weeklyWeatherItems.forEach((weeklyWeatherItem, i) => {
      const dayWeatherData = weeklyWeatherItem.querySelectorAll("span");
      dayWeatherData.item(1).textContent =
        this._data.weather.weekly[i].maxTemp + "°";
      dayWeatherData.item(2).textContent =
        this._data.weather.weekly[i].minTemp + "°";
    });
  }

  displaySearchResult(data) {
    this._data = data;

    const searchResultsContainer = this._parentElement.querySelector(
      ".location-search-results-container"
    );
    searchResultsContainer.innerHTML = "";
    searchResultsContainer.insertAdjacentHTML(
      "afterbegin",
      this._generateSearchResultMarkup()
    );
  }

  _generateMarkup() {
    let markup = "";
    markup += this._generateMarkupCurrentWeather();
    markup += this._generateMarkupWeeklyWeather();
    return markup;
  }

  _generateMarkupCurrentWeather() {
    return `
      <div class="weather-box-current">
        <span class="temperature">
          <img src="${config.OPENWEATHER_IMG_ADDR}/${this._data.weather.current.icon}.png" 
              alt="weather-icon"
          >
          <span class="currTemp">${this._data.weather.current.temp}°</span>
        </span>
        <span class="location">${this._data.cityName}</span>
      </div>
    `;
  }

  //prettier-ignore
  _generateMarkupWeeklyWeather() {
    return `
      <div class="weather-box-weekly-dropdown">
        <div class="weather-box-weekly-top">
          <div class="location-search-modal">
            <div class="location-search-container">  
              <input class="location-search-input" 
                type="text" 
                placeholder="Location"
                value=${this._data.cityName}
              >
              <div class="location-search-btns">
                <i class="fas fa-map-marker-alt find-curr-location"></i>
                <i class="fas fa-times close-location-search"></i>
              </div>
            </div>
            <div class="location-search-results-container">
            </div>
          </div>
          <div class="weather-box-weekly-top-left">
            <span class="region">${this._data.cityName}</span>
            <span class="weather">${
              this._data.weather.current.description
            }</span>
          </div>
          <div class="weather-box-weekly-top-right">
            <i class="fas fa-ellipsis-h weather-settings"></i>
            <div class="weekly-weather-option-container">
              <div class="weekly-weather-option-item">
                <span>Metric units</span>
                ${this._generateMarkupSlider("metricUnitCheckbox", true)}
              </div>
              <div class="weekly-weather-option-item edit-location">
                <span>Edit location</span>
              </div>
            </div>
          </div>
        </div>
        <div class="weather-box-weekly-mid">
          <div class="current-weather">
            <div class="weather-icon">
              <img src="${config.OPENWEATHER_IMG_ADDR}/${this._data.weather.current.icon}.png" 
                  alt="weather-icon"
              >
            </div>
            <div class="temperature currTemp">${this._data.weather.current.temp}°</div>
          </div>

          <div class="weekly-weather">
            ${this._data.weather.weekly.map((dayWeatherData, i) => {
              return `
                <div class="weekly-weather-item">
                  <span>${this._data.weather.weekly[i].day}</span>
                  <img src="${config.OPENWEATHER_IMG_ADDR}/${this._data.weather.weekly[i].icon}.png" 
                      alt="weather-icon"
                  >
                  <div>
                    <span>${this._data.weather.weekly[i].maxTemp}°</span>
                    <span>${this._data.weather.weekly[i].minTemp}°</span>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
        <div class="weather-box-weekly-bot">
          <a href="https://openweathermap.org/">
            <span>OpenWeather More weather</span>
            <i class="fas fa-long-arrow-alt-right"></i>
          </a>
        </div>
      </div>
    `;
  }

  _generateSearchResultMarkup() {
    let markup = "";

    this._data.locationSearchResult.forEach((result) => {
      markup += `
        <div class="location-search-result" 
          data-lat="${result.location.latitude}" 
          data-lon="${result.location.longitude}">
          ${result.location}
        </div>
      `;
    });

    return markup;
  }
}

export default new HeaderWeatherView();
