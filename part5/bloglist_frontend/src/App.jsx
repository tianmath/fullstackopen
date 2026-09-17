import { useState, useEffect, useRef } from 'react';
import Notification from './components/Notification';
import Blog from './components/Blog';
import blogService from './services/blogs';
import Togglable from './components/Togglable';
import BlogForm from './components/BlogForm';
import LoginForm from './components/LoginForm';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState(null);
  const blogFormRef = useRef();

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

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser');
    setUser(null);
  };

  const addBlog = (blog) => {
    setBlogs(blogs.concat(blog));
    blogFormRef.current.toggleVisibility();
  };

  const loginForm = () => (
    <LoginForm setUser={setUser} displayNotification={displayNotification} />
  );

  const createBlogForm = () => (
    <Togglable buttonLabel='create new blog' ref={blogFormRef}>
      <BlogForm addBlog={addBlog} displayNotification={displayNotification} />
    </Togglable>
  );

  return (
    <div>
      {!user && (
        <>
          <h2>log in to application</h2>
          <Notification message={message} />
          {loginForm()}
        </>
      )}

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
