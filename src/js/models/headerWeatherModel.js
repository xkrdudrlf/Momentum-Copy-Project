import * as config from "../config";
import { getDateWithOffset } from "../utility";
import "regenerator-runtime/runtime";

export let state = {
  time: 0,
  cityName: "Not Found",
  coords: {
    latitude: 0,
    longitude: 0,
  },
  tempUnit: "metric",
  weather: {
    current: {
      day: "MON",
      description: "Sunny",
      temp: 0,
      icon: "01d",
    },
    weekly: [
      {
        day: "Mon",
        maxTemp: 0,
        minTemp: 0,
        icon: "01d",
        description: "Sunny",
      },
    ],
  },
  locationSearchResult: [],
};

const getCurrentLocation = function () {
  const errorMessage = `Cannot get the current geolocation information from ${config.GEOLOCATION_ADDR}`;

  return new Promise(async function (resolve, reject) {
    try {
      const res = await fetch(config.GEOLOCATION_ADDR);

      if (!res.ok) {
        return reject(new Error(errorMessage));
      }

      const data = await res.json();
      state.cityName = data["city"];
      state.coords.latitude = data["latitude"];
      state.coords.longitude = data["longitude"];

      resolve();
    } catch (err) {
      return reject(new Error(err.message));
    }
  });
};

export const getWeatherData = async function (
  latitude = null,
  longitude = null,
  location = null
) {
  const errorMessage = `Cannot get the current weather information from ${config.OPENWEATHER_WEATHER_ADDR}`;

  if (!latitude && !longitude & !location) {
    await getCurrentLocation();
  } else {
    state.coords.latitude = latitude;
    state.coords.longitude = longitude;
    state.cityName = location;
  }

  const res = await fetch(
    `${config.OPENWEATHER_WEATHER_ADDR}?lat=${state.coords.latitude}&lon=${state.coords.longitude}&units=${state.tempUnit}&appid=${config.OPENWEATHER_API_KEY}`
  );
  if (!res.ok) throw new Error(errorMessage);
  const data = await res.json();
  const offset = data.timezone_offset;

  // Get current weather data
  state.weather.current.day =
    config.DATE[getDateWithOffset(data.current.dt, offset).getDay() % 7];
  state.weather.current.description = data.current.weather[0].description;
  state.weather.current.icon = data.current.weather[0].icon;
  state.weather.current.temp = Math.round(data.current.temp);

  // Get weekly weather data
  const weeklyWeatherData = data.daily.slice(0, 5);
  state.weather.weekly = [];
  weeklyWeatherData.forEach((dayData, i) => {
    const dayWeatherData = {};

    dayWeatherData.day =
      config.DATE[getDateWithOffset(dayData.dt, offset).getDay() % 7];
    dayWeatherData.maxTemp = Math.round(dayData.temp.max);
    dayWeatherData.minTemp = Math.round(dayData.temp.min);
    dayWeatherData.icon = dayData.weather[0].icon;
    dayWeatherData.description = dayData.weather[0].main;

    state.weather.weekly.push(dayWeatherData);
  });

  // Record the current time
  // Store the currLocation weather to localStorage for optimization.
  if (!latitude && !longitude && !location) {
    state.time = data.current.dt * 1000;
    localStorage.setItem("weather", JSON.stringify(state));
  }
};

const convertCelToFar = function (temp) {
  return Math.round(temp * (9 / 5) + 32);
};

const convertFarToCel = function (temp) {
  return Math.round((temp - 32) * (5 / 9));
};

export const toggleTempUnit = function () {
  if (state.tempUnit === "metric") {
    state.tempUnit = "imperial";
    state.weather.current.temp = convertCelToFar(state.weather.current.temp);
    state.weather.weekly.forEach((dayWeatherData) => {
      dayWeatherData.maxTemp = convertCelToFar(dayWeatherData.maxTemp);
      dayWeatherData.minTemp = convertCelToFar(dayWeatherData.minTemp);
    });
  } else {
    state.tempUnit = "metric";
    state.weather.current.temp = convertFarToCel(state.weather.current.temp);
    state.weather.weekly.forEach((dayWeatherData) => {
      dayWeatherData.maxTemp = convertFarToCel(dayWeatherData.maxTemp);
      dayWeatherData.minTemp = convertFarToCel(dayWeatherData.minTemp);
    });
  }
};

export const getSearchResult = async function (keyword) {
  state.locationSearchResult = [];
  const response = await fetch(
    `${config.MAPBOX_ADDR}/${keyword}.json?access_token=${config.MAPBOX_API_KEY}&limit=${config.MAX_SEARCH_RESULT}&language=en`
  );
  const data = await response.json();

  data.features.forEach((record) => {
    const searchResultobj = {
      location: record.place_name,
      coords: {
        latitude: record.center[1],
        longitude: record.center[0],
      },
    };

    state.locationSearchResult.push(searchResultobj);
  });
};

export const currWeatherCache = function (
  interval = config.WEATHER_CACHE_INTERVAL
) {
  const weatherState = JSON.parse(localStorage.getItem("weather"));
  if (!weatherState) return false;

  const currTime = new Date().getTime();
  if ((currTime - weatherState.time) / (60 * 1000) < interval) {
    state = weatherState;
    return true;
  }
  return false;
};
