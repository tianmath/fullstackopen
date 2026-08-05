import axios from 'axios';

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries';

const weatherAPIKey = import.meta.env.VITE_WEATHER_KEY;

const getAllCountry = () => {
  return axios.get(`${baseUrl}/api/all`).then((response) => response.data);
};

const getCountry = (country) => {
  return axios
    .get(`${baseUrl}/api/name/${country}`)
    .then((response) => response.data);
};

const getWeather = ([lat, lng]) => {
  return axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${weatherAPIKey}`,
    )
    .then((response) => response.data);
};

export default { getAllCountry, getCountry, getWeather };
