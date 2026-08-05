import { useState, useEffect } from 'react';
import countriesService from '../services/countries';

const DisplayCountryInfos = ({ country }) => {
  const [infos, setInfos] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    countriesService.getCountry(country).then((country) => {
      setInfos(country);
    });
  }, [country]);

  useEffect(() => {
    if (infos) {
      countriesService
        .getWeather(infos.capitalInfo.latlng)
        .then((weather) => setWeather(weather));
    }
  }, [infos]);

  if (!infos || !weather) return;

  const {
    capital,
    area,
    languages,
    flags: { png: flagUrl, alt },
  } = infos;

  const {
    weather: [{ icon }],
    main: { temp },
    wind: { speed: wind },
  } = weather;

  return (
    <div>
      <h1>{country}</h1>

      <div>Capital {capital}</div>
      <div>Area {area}</div>

      <h2>Languages</h2>
      <ul>
        {Object.values(languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>

      <img src={flagUrl} alt={alt} />

      <h2>Weather in {capital}</h2>
      <div>{`Temperature ${(temp - 273.15).toFixed(2)} Celcius`}</div>
      <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} />
      <div>{`Wind ${wind} m/s`}</div>
    </div>
  );
};

export default DisplayCountryInfos;
