import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import Notification from './Notification';

const BlogForm = ({ user, addBlog, message }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newBlog = {
      title,
      author,
      url,
    };

    await addBlog(newBlog);

    navigate('/');
  };

  if (!user) return <Navigate to='/login' replace />;

  return (
    <>
      <h2>create new</h2>

      <Notification message={message} />

      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label='title'
            margin='dense'
            sx={{ width: '50%' }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <TextField
            label='author'
            margin='dense'
            sx={{ width: '50%' }}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>

        <div>
          <TextField
            label='url'
            margin='dense'
            sx={{ width: '50%' }}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <Button variant='contained' sx={{ marginTop: 1 }} type='submit'>
          create
        </Button>
      </form>
    </>
  );
};

export default BlogForm;
