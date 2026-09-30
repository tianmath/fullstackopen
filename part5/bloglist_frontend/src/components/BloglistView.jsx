import { Link } from 'react-router-dom';
import Notification from './Notification';

const BloglistView = ({ blogs, message }) => {
  return (
    <div>
      <h2>blogs</h2>

      <Notification message={message} />

      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} by {blog.author}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BloglistView;
