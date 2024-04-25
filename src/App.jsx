import { useState } from "react"

export const App = () => {

  const difKelvin = 273.15;

  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleReset = (e) => {
    setCity('');
    setWeatherData(null);
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.length > 0) fetchClima();
  };

  const fetchClima = async () => {
    try {
      const urlBase = import.meta.env.VITE_WEATHER_API_URL;
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      const response = await fetch(`${urlBase}?q=${city}&appid=${apiKey}`);
      const data = await response.json();

      if (response.ok) {
        setWeatherData(data);
        setError(null);
      } else {
        setError(`No results could be found for "${city}". Check your spelling and make sure you have written it correctly.`);
        setWeatherData(null)
      }
    } catch (error) {
      setError('There was an error obtaining the weather data.')
      setWeatherData(null)
      console.log(error)
    }
  }

  return (
    <>
      <div className="container">

        <h1>Weather App</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter a city"
            name="City"
            value={city}
            onChange={handleCityChange}
          />

          <button type="submit">Search</button>
          <button onClick={handleReset} type="reset">x</button>
        </form>

        {
          weatherData && (
            <div>
              <h2>{weatherData.name}</h2>
              <p>Temperature: {parseInt(weatherData?.main?.temp - difKelvin)}°C</p>
              <p>RealFeel: {parseInt(weatherData.main.feels_like - difKelvin)}°C</p>
              <p>Humidity: {parseInt(weatherData.main.humidity)}%</p>
              <p>Description: "{weatherData.weather[0].description.charAt(0).toUpperCase() + weatherData.weather[0].description.slice(1)}"</p>
              <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt="An icon representative of weather conditions." />
            </div>
          )
        }

        {
          error &&
          <p className="error-message">{error}</p>
        }

      </div>
    </>
  );
};