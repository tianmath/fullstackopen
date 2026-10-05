import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

const Blog = ({ blog, user, onLike, onRemove }) => {
  if (!blog) return null;

  return (
    <div
      style={{
        marginTop: '20px',
        width: '85%',
        display: 'flex',
        flexDirection: 'column',
        font: 'normal 1rem/2 Arial, sans-serif',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '-1px 1px 5px -2px grey',
      }}
    >
      <h2 style={{ marginBlock: '0' }}>{blog.title}</h2>

      <div style={{ fontSize: '20px', color: 'grey' }}>by {blog.author}</div>

      <div>
        <Link>{blog.url}</Link>
      </div>
      <div style={{ color: 'grey' }}>Added by {blog.user.name}</div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
        }}
      >
        <span>{blog.likes} likes</span>
        {user && (
          <Button variant='outlined' onClick={() => onLike(blog)}>
            like
          </Button>
        )}
        {user && blog.user.username === user.username && (
          <Button
            variant='outlined'
            color='error'
            onClick={async () => await onRemove(blog)}
          >
            remove
          </Button>
        )}
      </div>
    </div>
  );
};

export default Blog;
