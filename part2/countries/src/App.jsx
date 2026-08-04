import { useEffect, useState } from 'react';
import axios from 'axios';

const MAX_NUM_COUNTRIES = 10;

function App() {
  const [search, setSearch] = useState('');
  const [allCountries, setAllCountries] = useState(null);

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((response) => {
        setAllCountries(response.data.map((country) => country.name.common));
      });
  }, []);

  if (allCountries === null) return;

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const matchingCountries = search
    ? allCountries.filter((country) =>
        country.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
      )
    : [];

  return (
    <form onSubmit={handleSubmit}>
      <div>
        find countries: <input value={search} onChange={handleSearchChange} />
      </div>

      {matchingCountries.length > MAX_NUM_COUNTRIES ? (
        <div>To many matches, specify another filter</div>
      ) : (
        matchingCountries.map((country) => <div key={country}>{country}</div>)
      )}
    </form>
  );
}

export default App;
