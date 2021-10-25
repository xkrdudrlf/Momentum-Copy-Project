import * as model from "../models/headerWeatherModel";
import headerWeatherView from "../views/headerWeatherView";

const controlHeaderWeather = async function () {
  try {
    await model.getCurrentWeatherData();
    headerWeatherView.render(model.state);
  } catch (err) {
    console.error(err);
  }
};

export const init = function () {
  headerWeatherView.addHandlerRender(controlHeaderWeather);
};
