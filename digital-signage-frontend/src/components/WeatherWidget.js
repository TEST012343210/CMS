// src/components/WeatherWidget.js

import React, { useState, useEffect } from 'react';
import { fetchWeatherData } from '../services/dynamicDataService';

const WeatherWidget = ({ location }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getWeatherData = async () => {
      try {
        const data = await fetchWeatherData(location);
        setWeatherData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getWeatherData();
  }, [location]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h3>Weather in {weatherData.name}</h3>
      <p>Temperature: {weatherData.main.temp}°C</p>
      <p>Weather: {weatherData.weather[0].description}</p>
    </div>
  );
};

export default WeatherWidget;
