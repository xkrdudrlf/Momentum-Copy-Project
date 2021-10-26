import * as model from "../models/headerWeatherModel";
import headerWeatherView from "../views/headerWeatherView";

const controlHeaderWeather = async function () {
  try {
    headerWeatherView.renderSpinner();
    await model.getCurrentWeatherData();
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
  headerWeatherView.render(model.state);
};

export const init = function () {
  headerWeatherView.addHandlerRender(controlHeaderWeather);
  headerWeatherView.addHandlerWeeklyWeatherDropdownDisplay(
    controlWeeklyWeatherDropdownDisplay
  );
  headerWeatherView.addHandlerToggleTempUnit(controlToggleTempUnit);
};
