/*
 * Copyright (c) 2022.
 */

import axios from "axios";
import config from "../config.js";

export const weatherService = {
  getWeather: async function (lat, lng) {
    if (!lat || !lng) {
      return null;
    }

    const url = `https://api.openweathermap.org/data/${config.openWeatherMap.version}/weather?lat=${lat}&lon=${lng}&exclude=hourly,daily&units=metric&appid=${config.openWeatherMap.apiKey}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (e) {
      console.log(e);
      return undefined;
    }
  },

  getWeatherForPois: async function (pois) {
    const weather$ = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < pois.length; i++) {
      weather$[i] = this.getWeather(pois[i].lat, pois[i].lng);
    }
    const weather = await Promise.all(weather$);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < pois.length; i++) {
      pois[i].weather = weather[i];
    }
  },
};
