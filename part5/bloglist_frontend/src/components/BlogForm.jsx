import { useState } from 'react';
import blogService from '../services/blogs';

const BlogForm = ({ addBlog, displayNotification }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newBlog = {
      title,
      author,
      url,
    };

    try {
      const returnedBlog = await blogService.create(newBlog);
      addBlog(returnedBlog);
      displayNotification(
        'success',
        `a new blog "${title}" by ${author} added`,
        3000,
      );

      setTitle('');
      setAuthor('');
      setUrl('');
    } catch {
      displayNotification(
        'error',
        'title or url are missing, or your session expired',
        5000,
      );
    }
  };

  return (
    <>
      <h2>create new</h2>
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
