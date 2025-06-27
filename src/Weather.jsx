import React, { useEffect, useState } from 'react';
import Forecast from './Forecast';

export default function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('New York');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`)
      .then(res => {
        if (!res.ok) throw new Error('City not found');
        return res.json();
      })
      .then(data => {
        setWeatherData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [city]);

  return (
    <div>
      <h2>Weather for {city}</h2>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city"
      />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {weatherData && (
        <div>
          <p>Temperature: {weatherData.main.temp} °F</p>
          <p>Description: {weatherData.weather[0].description}</p>
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt="weather icon"
          />
        </div>
      )}

      {/* Show 5-day forecast */}
      {weatherData && <Forecast city={city} />}
    </div>
  );
}
