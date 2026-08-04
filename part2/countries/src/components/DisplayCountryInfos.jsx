import { useState, useEffect } from 'react';
import countriesService from '../services/countries';

const DisplayCountryInfos = ({ country }) => {
  const [infos, setInfos] = useState(null);

  useEffect(() => {
    countriesService.getCountry(country).then((country) => {
      setInfos(country);
    });
  }, [country]);

  if (!infos) return;

  const {
    capital,
    area,
    languages,
    flags: { png: flagUrl, alt },
  } = infos;

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

      <img className='flag' src={flagUrl} alt={alt} />
    </div>
  );
};

export default DisplayCountryInfos;
