const Persons = ({ persons, filter, onRemovePerson }) => {
  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div>
      {personsToShow.map((person) => (
        <div key={person.name}>
          {`${person.name} ${person.number} `}
          <button onClick={() => onRemovePerson(person)}>delete</button>
        </div>
      ))}
    </div>
  );
};

export default Persons;
