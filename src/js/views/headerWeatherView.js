import * as config from "../config";

/*
  < To do >
  1. weather-box-current => dropdown toggle.
  2. ... button on the right-top corner of dropdown
    - cursor: pointer;
    - toggle unit (metric <-> farenheit)
    - find & edit location with changes applied to the rest of weather information
  3. weekly weather slot.
    - stress the current selected weather slot
    - select weather slot with changes applied to the rest of weather information
  4. regular update every certain minute or time.
    - give a user right to change for that
*/
class HeaderWeatherView {
  _parentElement = document.querySelector(".header-right");
  _data;

  render(data) {
    this._data = data;

    const markup = this._generateMarkup();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  addHandlerRender(handler) {
    window.addEventListener("load", () => {
      handler();
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
            <i class="fas fa-ellipsis-h"></i>
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
