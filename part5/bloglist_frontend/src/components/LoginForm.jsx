import { useState } from 'react';
import loginService from '../services/login';
import { Button, TextField } from '@mui/material';

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
          <TextField
            label='username'
            type='text'
            variant='standard'
            margin='dense'
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <TextField
            label='password'
            type='password'
            variant='standard'
            margin='dense'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <Button variant='contained' sx={{ marginTop: 1 }} type='submit'>
          login
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
