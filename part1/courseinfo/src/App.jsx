const Header = (props) => {
  return <h1>{props.course}</h1>;
};

const Part = (props) => {
  return (
    <p>
      {props.part.name} {props.part.exercises}
    </p>
  );
};

const Content = (props) => {
  return (
    <div>
      <Part part={props.parts.part1} />
      <Part part={props.parts.part2} />
      <Part part={props.parts.part3} />
    </div>
  );
};

const Total = (props) => {
  return (
    <p>
      {`Number of exercises ${props.exercises.reduce(
        (acc, currentExercise) => acc + currentExercise,
        0,
      )}`}
    </p>
  );
};

const App = () => {
  const course = 'Half Stack application development';

  const parts = {
    part1: {
      name: 'Fundamentals of React',
      exercises: 10,
    },
    part2: {
      name: 'Using props to pass data',
      exercises: 7,
    },
    part3: {
      name: 'State of a component',
      exercises: 14,
    },
  };

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total exercises={Object.values(parts).map((part) => part.exercises)} />
    </div>
  );
};

export default App;
