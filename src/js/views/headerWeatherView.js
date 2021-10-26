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
    - toggle unit (metric <-> farenheit)
      => update only the changed parts(temperatures/checkbox checked status)
      => do not just render again.
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
      handler();
      this._parentElement.addEventListener("click", (e) => {
        if (e.target.classList.contains("weather-settings")) {
          const weatherOptionContainer = this._parentElement.querySelector(
            ".weekly-weather-option-container"
          );
          if (weatherOptionContainer.style.display === "none")
            weatherOptionContainer.style.display = "flex";
          else weatherOptionContainer.style.display = "none";
        }
      });
    });
  }

  addHandlerWeeklyWeatherDropdownDisplay(handler) {
    this._parentElement.addEventListener("click", (e) => {
      if (e.target.closest(".weather-box-current")) {
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
          ${this._data.weather.current.temp}°
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
              <div class="weekly-weather-option-item">
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
            <div class="temperature">${this._data.weather.current.temp}°</div>
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
}

export default new HeaderWeatherView();
