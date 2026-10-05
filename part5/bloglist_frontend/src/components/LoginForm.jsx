import { useState } from 'react';
import { Button, TextField } from '@mui/material';

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleLogin(username, password);
  };

  return (
    <div>
      <h2>Log in to application</h2>

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
