import * as config from "../config";
import View from "./View";

class HeaderWeatherView extends View {
  _parentElement = document.querySelector(".header-right");

  addHandlerRender(handler) {
    window.addEventListener("load", () => {
      this.renderSpinner();
      handler();
      this._addHandlerOutsideClick();
      this._addHandlerWeatherBoxWeeklyDropdwnDisplay();
      this._addHandlerWeatherOptionDisplay();
      this._addHandlerLocationLiveSearchDisplay();
      this._addHandlerWeatherItemSelection();
    });
  }

  addHandlerRegularUpdate(handler) {
    setInterval(() => {
      handler(
        this._data.coords.latitude,
        this._data.coords.longitude,
        this._data.cityName
      );
    }, config.WEATHER_UPDATE_INTERVAL);
  }

  addHandlerGetCurrentLocationWeather(handler) {
    this._parentElement.addEventListener("click", (e) => {
      if (e.target.classList.contains("find-curr-location")) {
        const locationSearchModal = this._parentElement.querySelector(
          ".location-search-modal"
        );
        locationSearchModal.style.display = "none";
        handler();
        return;
      }
    });
  }

  addHandlerGetSelectedLocationWeather(handler) {
    this._parentElement.addEventListener("click", (e) => {
      if (e.target.classList.contains("location-search-result")) {
        const locationSearchModal = this._parentElement.querySelector(
          ".location-search-modal"
        );
        locationSearchModal.style.display = "none";

        // For Update function. Both HTML Nodes should have the same number of Nodes.
        const locationSearchResultsContainer =
          this._parentElement.querySelector(
            ".location-search-results-container"
          );
        locationSearchResultsContainer.style.display = "none";
        locationSearchResultsContainer.innerHTML = "";

        const dataset = e.target.dataset;
        handler(dataset.latitude, dataset.longitude, dataset.location);
        return;
      }
    });
  }

  addHandlerToggleTempUnit(handler) {
    this._parentElement.addEventListener("click", (e) => {
      if (e.target.classList.contains("metricUnitCheckbox")) {
        handler();
        return;
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
        if (e.target.value.length < config.MIN_SEARCH_INPUT_LENGTH) return;
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

  _addHandlerOutsideClick() {
    // Hide Weather Box Weekly Dropdown upon click outside the parentElement.
    window.addEventListener("click", (e) => {
      // Edge Case 1
      if (e.target.closest(".weather-box-current")) return;

      if (!e.target.closest(".weather-box-weekly-dropdown")) {
        // Edge Case 2
        if (e.target.classList.contains("location-search-result")) return;

        // 1. Hide the WeatherBox Dropdown if open
        const weatherBoxWeeklyDropdown = this._parentElement.querySelector(
          ".weather-box-weekly-dropdown"
        );
        if (getComputedStyle(weatherBoxWeeklyDropdown).display !== "flex")
          return;

        weatherBoxWeeklyDropdown.style.display = "none";

        // 2. Hide the Weather Option if open
        const weatherOptionContainer = this._parentElement.querySelector(
          ".weekly-weather-option-container"
        );
        if (getComputedStyle(weatherOptionContainer).display === "flex") {
          weatherOptionContainer.style.display = "none";
        }

        // 3. Hide the locationSearch Modal if open
        const locationSearchModal = this._parentElement.querySelector(
          ".location-search-modal"
        );
        if (getComputedStyle(locationSearchModal).display === "flex") {
          locationSearchModal.style.display = "none";
        }
      }
    });
  }

  _addHandlerWeatherBoxWeeklyDropdwnDisplay() {
    // Show & Hide Weather Box Weekly Dropdown
    this._parentElement.addEventListener("click", (e) => {
      if (e.target.closest(".weather-box-current")) {
        const weatherBoxWeeklyDropdown = this._parentElement.querySelector(
          ".weather-box-weekly-dropdown"
        );

        if (weatherBoxWeeklyDropdown.style.display === "none") {
          weatherBoxWeeklyDropdown.style.display = "flex";
        } else {
          weatherBoxWeeklyDropdown.style.display = "none";
        }
        return;
      }
    });
  }

  _addHandlerWeatherOptionDisplay() {
    // Show & Hide Weekly Weather Option Submodal
    this._parentElement.addEventListener("click", (e) => {
      const weatherOptionContainer = this._parentElement.querySelector(
        ".weekly-weather-option-container"
      );
      if (e.target.classList.contains("weather-settings")) {
        if (window.getComputedStyle(weatherOptionContainer).display === "none")
          weatherOptionContainer.style.display = "flex";
        else weatherOptionContainer.style.display = "none";
        return;
      }
    });
  }

  _addHandlerLocationLiveSearchDisplay() {
    // Show & Hide Location Live Search Modal
    this._parentElement.addEventListener("click", (e) => {
      const locationSearchModal = this._parentElement.querySelector(
        ".location-search-modal"
      );
      const locationSearchInput = this._parentElement.querySelector(
        ".location-search-input"
      );
      const weatherOptionContainer = this._parentElement.querySelector(
        ".weekly-weather-option-container"
      );
      if (e.target.closest(".edit-location")) {
        locationSearchModal.style.display = "flex";
        weatherOptionContainer.style.display = "none";
        locationSearchInput.select();
        return;
      }

      if (e.target.classList.contains("close-location-search")) {
        locationSearchModal.style.display = "none";
        return;
      }
    });
  }

  _addHandlerWeatherItemSelection() {
    this._parentElement.addEventListener("click", (e) => {
      // Update upon Weekly Weather Item Selection
      if (e.target.closest(".weekly-weather-item")) {
        // Update Background
        const weeklyWeatherItems = this._parentElement.querySelectorAll(
          ".weekly-weather-item"
        );
        let firstWeeklyItem = null;
        weeklyWeatherItems.forEach((el, i) => {
          if (i === 0) firstWeeklyItem = el;
          el.style.backgroundColor = "";
        });

        const selectedWeeklyWeatherItem = e.target.closest(
          ".weekly-weather-item"
        );
        selectedWeeklyWeatherItem.style.backgroundColor = getComputedStyle(
          selectedWeeklyWeatherItem
        ).backgroundColor;

        // Update Weather Content for the Selected Item
        const day = this._parentElement.querySelector(".selected-day");
        const description = this._parentElement.querySelector(".weather");
        const img = this._parentElement
          .querySelector(".weather-icon")
          .querySelector("img");
        const temp = this._parentElement.querySelector(".selected-temp");

        if (firstWeeklyItem === selectedWeeklyWeatherItem) {
          day.textContent = "";
          description.textContent = this._data.weather.current.description;
          img.setAttribute(
            "src",
            `${config.OPENWEATHER_IMG_ADDR}/${this._data.weather.current.icon}.png`
          );
          temp.textContent = `${this._data.weather.current.temp}°`;
          return;
        }

        const dataset = selectedWeeklyWeatherItem.dataset;
        day.textContent = dataset.day;
        description.textContent = dataset.description;
        img.setAttribute("src", dataset.img);
        temp.textContent = `${dataset.maxtemp}°`;
        return;
      }
    });
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
            <div class="weather-box-weekly-top-left-top">
              <span class="region">${this._data.cityName}</span>
              <span class="selected-day"></span>
              <div class="spinner-box"></div>
            </div>
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
            <div class="temperature currTemp selected-temp">${this._data.weather.current.temp}°</div>
          </div>

          <div class="weekly-weather">
            ${this._data.weather.weekly.map((dayWeatherData, i) => {
              return `
                <div class="weekly-weather-item"
                  data-day="${this._data.weather.weekly[i].day}"
                  data-description="${this._data.weather.weekly[i].description}"
                  data-img="${config.OPENWEATHER_IMG_ADDR}/${this._data.weather.weekly[i].icon}.png"
                  data-maxtemp="${this._data.weather.weekly[i].maxTemp}"
                  data-mintemp="${this._data.weather.weekly[i].minTemp}"
                >
                  <span>${this._data.weather.weekly[i].day}</span>
                  <img src="${config.OPENWEATHER_IMG_ADDR}/${this._data.weather.weekly[i].icon}.png" 
                      alt="weather-icon"
                  >
                  <div>
                    <span>${this._data.weather.weekly[i].maxTemp}°</span>
                    /
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
          data-latitude="${result.coords.latitude}" 
          data-longitude="${result.coords.longitude}"
          data-location="${result.location.split(",")[0]}">
          ${result.location}
        </div>
      `;
    });

    return markup;
  }
}

export default new HeaderWeatherView();
