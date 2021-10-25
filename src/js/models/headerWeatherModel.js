import * as config from "../config";
import "regenerator-runtime/runtime";

export const state = {
  cityName: null,
  coords: {
    latitude: 0,
    longitude: 0,
  },
  weather: {
    current: {
      day: null,
      description: null,
      temp: null,
      icon: null,
    },
    weekly: [
      {
        day: null,
        maxTemp: null,
        minTemp: null,
        icon: null,
      },
    ],
  },
};

const getCurrentLocation = function () {
  const errorMessage = `Cannot get the current geolocation information from ${config.GEOLOCATION_ADDR}`;

  return new Promise(async function (resolve, reject) {
    const res = await fetch(config.GEOLOCATION_ADDR);
    if (!res.ok) {
      return reject(new Error(errorMessage));
    }
    const data = await res.json();
    state.cityName = data["city"];
    state.coords.latitude = data["latitude"];
    state.coords.longitude = data["longitude"];
    resolve();
  });
};

export const getCurrentWeatherData = async function () {
  const errorMessage = `Cannot get the current weather information from ${config.OPENWEATHER_WEATHER_ADDR}`;

  await getCurrentLocation();

  const res = await fetch(
    `${config.OPENWEATHER_WEATHER_ADDR}?lat=${state.coords.latitude}&lon=${state.coords.longitude}&units=metric&appid=${config.OPENWEATHER_API_KEY}`
  );
  if (!res.ok) throw new Error(errorMessage);
  const data = await res.json();

  const currDay = new Date().getDay();
  // Get current weather data
  state.weather.current.day = config.DATE[currDay];
  state.weather.current.description = data.current.weather[0].description;
  state.weather.current.icon = data.current.weather[0].icon;
  state.weather.current.temp = Math.round(data.current.temp);

  // Get weekly weather data
  const weeklyWeatherData = data.daily.slice(0, 5);
  state.weather.weekly = [];
  weeklyWeatherData.forEach((dayData, i) => {
    const dayWeatherData = {};
    dayWeatherData.day = config.DATE[currDay + i];
    dayWeatherData.maxTemp = Math.round(dayData.temp.max);
    dayWeatherData.minTemp = Math.round(dayData.temp.min);
    dayWeatherData.icon = dayData.weather[0].icon;
    state.weather.weekly.push(dayWeatherData);
  });
};
