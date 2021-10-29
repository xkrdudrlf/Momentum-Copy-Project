import * as model from "../models/headerWeatherModel";
import headerWeatherView from "../views/headerWeatherView";

const controlHeaderWeather = async function () {
  try {
    // await model.getWeatherData();
    headerWeatherView.render(model.state);
  } catch (err) {
    console.error(err);
  }
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

const controlGetCurrentLocationWeather = async function () {
  await model.getWeatherData();
  headerWeatherView.update(model.state);
};

const controlGetSelectedLocationWeather = async function (
  latitude,
  longitude,
  location
) {
  await model.getWeatherData(latitude, longitude, location);
  headerWeatherView.update(model.state);
};

export const init = function () {
  headerWeatherView.addHandlerRender(controlHeaderWeather);
  headerWeatherView.addHandlerRegularUpdate(controlGetSelectedLocationWeather);
  headerWeatherView.addHandlerToggleTempUnit(controlToggleTempUnit);
  headerWeatherView.addHandlerLocationLiveSearch(controlLocationLiveSearch);
  headerWeatherView.addHandlerGetCurrentLocationWeather(
    controlGetCurrentLocationWeather
  );
  headerWeatherView.addHandlerGetSelectedLocationWeather(
    controlGetSelectedLocationWeather
  );
};
