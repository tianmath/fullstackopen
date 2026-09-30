import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
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
          <label>
            title:
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
        </div>

        <div>
          <label>
            author:
            <input value={author} onChange={(e) => setAuthor(e.target.value)} />
          </label>
        </div>

        <div>
          <label>
            url:
            <input value={url} onChange={(e) => setUrl(e.target.value)} />
          </label>
        </div>
        <button type='submit'>create</button>
      </form>
    </>
  );
};

export default BlogForm;
