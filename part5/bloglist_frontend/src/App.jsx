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

  const fetchallBlogsAndSort = async () => {
    const blogs = await blogService.getAll();
    setBlogs(blogs.toSorted((blog1, blog2) => blog2.likes - blog1.likes));
  };

  useEffect(() => {
    (async () => await fetchallBlogsAndSort())();
  }, []);

  useEffect(() => {
    (() => {
      const loggedUserJSON = window.localStorage.getItem(
        'loggedBloglistAppUser',
      );
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON);
        setUser(user);
        blogService.setToken(user.token);
      }
    })();
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

  const handleLogin = (user) => {
    window.localStorage.setItem('loggedBloglistAppUser', JSON.stringify(user));
    blogService.setToken(user.token);
    setUser(user);
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistAppUser');
    blogService.setToken(null);
    setUser(null);
  };

  const addBlog = async (blog) => {
    try {
      const returnedBlog = await blogService.create(blog);
      displayNotification(
        'success',
        `a new blog "${returnedBlog.title}" by ${returnedBlog.author} added`,
        3000,
      );
      setBlogs(blogs.concat(returnedBlog));
      blogFormRef.current.toggleVisibility();
    } catch (err) {
      displayNotification(
        'error',
        'title or url are missing, or your session expired',
        5000,
      );
      throw err;
    }
  };

  const likeBlog = async (blog) => {
    await blogService.update(blog.id, {
      likes: blog.likes + 1,
    });
    fetchallBlogsAndSort();
  };

  const removeBlog = async (blog) => {
    if (window.confirm(`Remove ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id);
        await fetchallBlogsAndSort();
        displayNotification('success', 'blog successfully remove', 3000);
      } catch (error) {
        displayNotification('error', error.response.data.error, 3000);
      }
    }
  };

  const loginForm = () => (
    <LoginForm
      handleLogin={handleLogin}
      displayNotification={displayNotification}
    />
  );

  const createBlogForm = () => (
    <Togglable buttonLabel='create new blog' ref={blogFormRef}>
      <BlogForm addBlog={addBlog} />
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
            <Blog
              key={blog.id}
              blog={blog}
              user={user}
              onLike={likeBlog}
              onRemove={removeBlog}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default App;
