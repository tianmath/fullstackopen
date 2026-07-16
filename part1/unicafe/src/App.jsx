import { useState } from 'react';

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad;
  if (total === 0)
    return (
      <div>
        <h1>statistics</h1>
        No feedback given
      </div>
    );

  const average = (good - bad) / total;
  const positivePercent = (good * 100) / total;

  return (
    <div>
      <h1>statistics</h1>

      <div>
        good {good}
        <br />
        neutral {neutral}
        <br />
        bad {bad}
        <br />
        all {total}
        <br />
        average {average}
        <br />
        positive {positivePercent} %
      </div>
    </div>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h1>give feedback</h1>

      <div>
        <Button onClick={() => setGood(good + 1)} text='good' />
        <Button onClick={() => setNeutral(neutral + 1)} text='neutral' />
        <Button onClick={() => setBad(bad + 1)} text='bad' />
      </div>

      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
