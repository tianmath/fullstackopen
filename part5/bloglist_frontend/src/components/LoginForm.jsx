import { useState } from 'react';
import loginService from '../services/login';

const LoginForm = ({ handleLogin, displayNotification }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      handleLogin(user);
      setUsername('');
      setPassword('');
    } catch {
      displayNotification('error', 'wrong username or password', 3000);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            username
            <input
              type='text'
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type='password'
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  );
};

export default LoginForm;
