import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useMatch } from 'react-router-dom';
import { Container } from '@mui/material';

import loginService from './services/login';
import blogService from './services/blogs';
import LoginForm from './components/LoginForm';
import BloglistView from './components/BloglistView';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Menu from './components/Menu';
import Notification from './components/Notification';

const descendingBlogsSort = (blog1, blog2) => blog2.likes - blog1.likes;

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchallBlogsAndSort = async () => {
      const fetcheblogs = await blogService.getAll();
      setBlogs(fetcheblogs.toSorted(descendingBlogsSort));
      return;
    };
    fetchallBlogsAndSort();
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
    setNotification({
      type: type,
      text: message,
    });
    setTimeout(() => {
      setNotification(null);
    }, duration);
  };

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem(
        'loggedBloglistAppUser',
        JSON.stringify(user),
      );
      blogService.setToken(user.token);
      setUser(user);
      navigate('/');
    } catch {
      displayNotification('error', 'wrong username or password', 3000);
    }
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
      navigate('/');
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

    setBlogs((blogs) =>
      blogs
        .map((b) => (b.id !== blog.id ? b : { ...blog, likes: blog.likes + 1 }))
        .toSorted(descendingBlogsSort),
    );
  };

  const removeBlog = async (blog) => {
    if (window.confirm(`Remove ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id);
        setBlogs(blogs.filter((b) => b.id !== blog.id));
        displayNotification('success', 'blog successfully remove', 3000);
        navigate('/');
      } catch (error) {
        displayNotification('error', error.response.data.error, 3000);
      }
    }
  };

  const match = useMatch('/blogs/:id');
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null;

  return (
    <Container>
      <Menu user={user} handleLogout={handleLogout} />

      <Notification notification={notification} />

      <Routes>
        <Route path='/' element={<BloglistView blogs={blogs} />} />
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
          element={user && <BlogForm addBlog={addBlog} />}
        />
        <Route
          path='/login'
          element={<LoginForm handleLogin={handleLogin} />}
        />
      </Routes>
    </Container>
  );
};

export default App;
