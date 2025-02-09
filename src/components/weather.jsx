"use client";
import { useState, useEffect } from "react";

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
            if (!response.ok) {
              throw new Error(`API error: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            setWeather(data);
          } catch (err) {
            console.error("Fetch error:", err); // Logs error to console
            setError(`Error fetching weather: ${err.message}`);
          }
        },
        (geoError) => {
          console.error("Geolocation error:", geoError); // Logs geolocation error
          setError(`Geolocation error: ${geoError.message}`);
        }
      );
    } else {
      setError("Geolocation not supported by your browser.");
    }
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!weather) return <p>Loading weather...</p>;

  return (
    <div>
      <h1>Weather in {weather.name}</h1>
      <p>{weather.weather[0].description}</p>
      <p>Temperature: {weather.main.temp}°C</p>
    </div>
  );
}
