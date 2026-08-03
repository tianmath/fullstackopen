import { useState, useEffect } from 'react';
import phonebookService from './services/phonebook';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    phonebookService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const personWithSameName = persons.find(
      (person) => person.name === newName,
    );
    if (personWithSameName) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`,
        )
      ) {
        phonebookService
          .update(personWithSameName.id, {
            ...personWithSameName,
            number: newNumber,
          })
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id === returnedPerson.id ? returnedPerson : person,
              ),
            );
            setSuccessMessage(`Number for ${personWithSameName.name} changed`);
            setTimeout(() => {
              setSuccessMessage(null);
            }, 5000);
          });
      }

      setNewName('');
      setNewNumber('');
      return;
    }

    const person = {
      name: newName,
      number: newNumber,
    };

    phonebookService.create(person).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson));
      setNewName('');
      setNewNumber('');
      setSuccessMessage(`Added ${newName}`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    });
  };

  const handleRemovePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      phonebookService.remove(person.id);
      setPersons(persons.filter((p) => p.id !== person.id));
    }
  };

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={successMessage} />

      <Filter filter={filter} onFilterChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm
        onSubmit={handleSubmit}
        newName={newName}
        onNameChange={handleNameChange}
        newNumber={newNumber}
        onNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons
        persons={persons}
        filter={filter}
        onRemovePerson={handleRemovePerson}
      />
    </div>
  );
};

export default App;
