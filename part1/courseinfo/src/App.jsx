const Header = (props) => {
  return <h1>{props.course}</h1>;
};

const Content = (props) => {
  return (
    <>
      <p>
        {props.parts.part1.name} {props.parts.part1.exercises}
      </p>
      <p>
        {props.parts.part2.name} {props.parts.part2.exercises}
      </p>
      <p>
        {props.parts.part3.name} {props.parts.part3.exercises}
      </p>
    </>
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
