import React, { useEffect, useState } from 'react';

export default function Forecast({ city }) {
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

  useEffect(() => {
    if (!city || !apiKey) return;

    setLoading(true);
    setError(null);

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`)
      .then((res) => {
        if (!res.ok) throw new Error("Forecast data not found");
        return res.json();
      })
      .then((data) => {
        // Get one forecast per day
        const dailyForecasts = [];
        const usedDates = new Set();

        for (let item of data.list) {
          const date = item.dt_txt.split(' ')[0]; // 'YYYY-MM-DD'
          if (!usedDates.has(date)) {
            dailyForecasts.push(item);
            usedDates.add(date);
          }
        }

        setForecastData(dailyForecasts);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [city, apiKey]);

  return (
    <div>
      <h3>5-Day Forecast</h3>
      {loading && <p>Loading forecast...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {forecastData.map((item) => (
          <div key={item.dt} style={{
            border: '1px solid #ccc',
            padding: '1rem',
            borderRadius: '8px',
            minWidth: '150px',
            backgroundColor: '#f5f5f5',
          }}>
            <p><strong>{new Date(item.dt_txt).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}</strong></p>
            <p>Temp: {item.main.temp} °F</p>
            <p>{item.weather[0].description}</p>
            <img
              src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
              alt="icon"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
