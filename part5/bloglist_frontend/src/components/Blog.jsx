import { Link } from 'react-router-dom';

const Blog = ({ blog, user, onLike, onRemove }) => {
  if (!blog) return null;

  return (
    <div>
      <h2>
        {blog.author}: {blog.title}
      </h2>

      <div>
        <Link>{blog.url}</Link>
      </div>
      <div>
        likes {blog.likes}
        {user && <button onClick={() => onLike(blog)}>like</button>}
      </div>
      <div>Added by {blog.user.name}</div>
      {user && blog.user.username === user.username && (
        <button onClick={async () => await onRemove(blog)}>remove</button>
      )}
    </div>
  );
};

export default Blog;
