import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom';

import blogService from './services/blogs';
import LoginView from './components/LoginView';
import BloglistView from './components/BloglistView';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
    navigate('/');
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistAppUser');
    blogService.setToken(null);
    setUser(null);
    navigate('/');
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

  const padding = {
    padding: 5,
  };

  const match = useMatch('/blogs/:id');
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null;

  return (
    <div>
      <div>
        <Link style={padding} to='/'>
          blogs
        </Link>

        {!user ? (
          <Link style={padding} to='/login'>
            login
          </Link>
        ) : (
          <>
            <Link style={padding} to={'/create'}>
              new blog
            </Link>
            <button onClick={handleLogout}>logout</button>
          </>
        )}
      </div>

      <Routes>
        <Route
          path='/'
          element={
            <BloglistView
              blogs={blogs}
              user={user}
              message={message}
              likeBlog={likeBlog}
              removeBlog={removeBlog}
            />
          }
        />
        <Route
          path='/blogs/:id'
          element={
            <Blog
              blog={blog}
              user={user}
              onLike={likeBlog}
              onRemove={removeBlog}
            />
          }
        />
        <Route
          path='/create'
          element={<BlogForm user={user} addBlog={addBlog} message={message} />}
        />
        <Route
          path='/login'
          element={
            <LoginView
              message={message}
              handleLogin={handleLogin}
              displayNotification={displayNotification}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
