import * as model from "../models/headerWeatherModel";
import headerWeatherView from "../views/headerWeatherView";

const controlHeaderWeather = async function () {
  try {
    // await model.getCurrentWeatherData();
    headerWeatherView.render(model.state);
  } catch (err) {
    console.error(err);
  }
};

const controlWeeklyWeatherDropdownDisplay = function (displayStatus) {
  model.setWeeklyWeatherDropdownDisplay(displayStatus);
};

const controlToggleTempUnit = function () {
  model.toggleTempUnit();
  headerWeatherView.toggleTempUnit(model.state);
};

const controlLocationLiveSearch = async function (keyword) {
  try {
    await model.getSearchResult(keyword);
    headerWeatherView.displaySearchResult(model.state);
  } catch (err) {
    console.error(err.message);
  }
};

const controlGetCurrentLocationWeather = function () {
  // await model.getCurrentWeatherData();
  // headerWeatherView.update(model.state);
};

export const init = function () {
  headerWeatherView.addHandlerRender(controlHeaderWeather);
  headerWeatherView.addHandlerWeeklyWeatherDropdownDisplay(
    controlWeeklyWeatherDropdownDisplay
  );
  headerWeatherView.addHandlerToggleTempUnit(controlToggleTempUnit);
  headerWeatherView.addHandlerLocationLiveSearch(controlLocationLiveSearch);
  headerWeatherView.addHandlerGetCurrentLocationWeather(
    controlGetCurrentLocationWeather
  );
};
