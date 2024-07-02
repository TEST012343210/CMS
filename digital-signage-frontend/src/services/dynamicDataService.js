// src/services/dynamicDataService.js

import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

export const fetchWeatherData = async (location) => {
  try {
    const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};
