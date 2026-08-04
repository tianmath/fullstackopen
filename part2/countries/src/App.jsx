import { useEffect, useState } from 'react';
import countriesService from './services/countries';
import DisplayCountryInfos from './components/DisplayCountryInfos';

const MAX_NUM_COUNTRIES = 10;

const App = () => {
  const [search, setSearch] = useState('');
  const [everyCountryName, setEveryCountryName] = useState(null);

  useEffect(() => {
    countriesService.getAllCountry().then((allCountries) => {
      setEveryCountryName(allCountries.map((country) => country.name.common));
    });
  }, []);

  if (everyCountryName === null) return <div>...loading (please wait)</div>;

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const matchingCountries = search
    ? everyCountryName.filter((country) =>
        country.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
      )
    : [];

  return (
    <form onSubmit={handleSubmit}>
      <div>
        find countries: <input value={search} onChange={handleSearchChange} />
      </div>

      {matchingCountries.length > MAX_NUM_COUNTRIES ? (
        <div>Too many matches, specify another filter</div>
      ) : matchingCountries.length === 1 ? (
        <DisplayCountryInfos country={matchingCountries[0]} />
      ) : (
        matchingCountries.map((country) => <div key={country}>{country}</div>)
      )}
    </form>
  );
};

export default App;
