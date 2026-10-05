import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';

const BlogForm = ({ addBlog }) => {
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

  return (
    <>
      <h2>create new</h2>

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
