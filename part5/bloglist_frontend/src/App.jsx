import { useState, useEffect } from 'react';
import Notification from './components/Notification';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import Togglable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const displayNotification = (type, message, duration) => {
    setMessage({
      type: type,
      text: message,
    });
    setTimeout(() => {
      setMessage(null);
    }, duration);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user));
      setUser(user);
      setUsername('');
      setPassword('');
    } catch {
      displayNotification('error', 'wrong username or password', 3000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser');
    setUser(null);
  };

  const createBlog = async (e) => {
    e.preventDefault();

    const newBlog = {
      title,
      author,
      url,
    };

    try {
      const returnedBlog = await blogService.create(newBlog);

      setBlogs(blogs.concat(returnedBlog));
      displayNotification(
        'success',
        `a new blog "${title}" by ${author} added`,
        3000,
      );
      setTitle('');
      setAuthor('');
      setUrl('');
    } catch (error) {
      displayNotification(
        'error',
        'title or url are missing, or your session expired',
        5000,
      );
      console.log(error);
    }
  };

  const loginForm = () => (
    <>
      <h2>log in to application</h2>

      <Notification message={message} />

      <form onSubmit={handleLogin}>
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
    </>
  );

  const createBlogForm = () => (
    <Togglable buttonLabel='create new blog'>
      <h2>create new</h2>
      <form onSubmit={createBlog}>
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
    </Togglable>
  );

  return (
    <div>
      {!user && loginForm()}

      {user && (
        <>
          <h2>blogs</h2>

          <Notification message={message} />

          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>

          {createBlogForm()}

          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </>
      )}
    </div>
  );
};

export default App;
