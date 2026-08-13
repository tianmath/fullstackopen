const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

morgan.token('data', (request) => {
  return JSON.stringify(request.body);
});

app.use(cors());
app.use(express.json());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data'),
);

let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) response.json(person);
  else response.status(404).end();
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  persons = persons.filter((note) => note.id !== id);

  response.status(204).end();
});

const MAX_ID = 100000;

const generateId = () => {
  return String(Math.floor(Math.random() * MAX_ID) + 1);
};

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing',
    });
  }

  const dupeName = persons.find((person) => person.name === body.name);
  if (dupeName) {
    return response.status(409).json({
      error: 'name must be unique',
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

app.get('/info', (request, response) => {
  const numPersons = persons.length;
  const now = new Date().toString();

  response.send(
    `<div>Phonebook has info for ${numPersons} people</div><br/><div>${now}</div>`,
  );
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
