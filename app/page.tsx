"use client";

import { useEffect, useState } from "react";

type City = {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
};

type WeatherResponse = {
  main: {
    temp: number;
  };
};

const API_KEY = "909d4a93f2f013687905d7c9add1261b";

export default function Page() {
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) {
      setCities([]);
      return;
    }

    const timeout = setTimeout(() => {
      fetchCities(query);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const fetchCities = async (search: string) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=${API_KEY}`
      );

      if (!res.ok) throw new Error("City API error");

      const data = await res.json();
      setCities(data);
      setError("");
    } catch (err) {
      setError("Unable to load city suggestions");
    }
  };

  const fetchWeather = async (city: City) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${API_KEY}`
      );

      if (!res.ok) throw new Error("Weather API error");

      const data: WeatherResponse = await res.json();

      setTemperature(data.main.temp);
      setSelectedCity(city);
      setCities([]);
      setQuery(city.name);
      setError("");
    } catch (err) {
      setError("Unable to load weather");
    }
  };

  return (
    <main
      style={{
        maxWidth: 800,
        margin: "40px auto",
        padding: 20,
        fontFamily: "Arial"
      }}
    >
      <h1 style={{ fontSize: 48 }}>Weather App</h1>

      <input
        placeholder="Search city..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          padding: 16,
          fontSize: 20,
          borderRadius: 12,
          border: "2px solid #2b6cb0"
        }}
      />

      {cities.length > 0 && (
        <ul style={{ marginTop: 10, listStyle: "none", padding: 0 }}>
          {cities.map((city, i) => (
            <li key={i}>
              <button
                onClick={() => fetchWeather(city)}
                style={{
                  width: "100%",
                  padding: 12,
                  textAlign: "left",
                  marginTop: 6,
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  cursor: "pointer"
                }}
              >
                {city.name}, {city.country}
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedCity && temperature !== null && (
        <div style={{ marginTop: 20 }}>
          <h2>
            {selectedCity.name}, {selectedCity.country}
          </h2>
          <p style={{ fontSize: 28 }}>{temperature} °C</p>
        </div>
      )}

      {error && (
        <p style={{ color: "red", marginTop: 10 }}>
          {error}
        </p>
      )}
    </main>
  );
}