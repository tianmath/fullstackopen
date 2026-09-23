import { useState } from 'react';

const Blog = ({ blog, user, onLike, onRemove }) => {
  const [displayDetails, setDisplayDetails] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} -- {blog.author}{' '}
        <button onClick={() => setDisplayDetails(!displayDetails)}>
          {displayDetails ? 'hide' : 'view'}
        </button>
      </div>
      {displayDetails && (
        <>
          <div>{blog.url}</div>
          <div>
            {blog.likes}
            <button onClick={async () => await onLike(blog)}>like</button>
          </div>
          <div>{blog.user.username}</div>
          {blog.user.username === user.username && (
            <button onClick={async () => await onRemove(blog)}>remove</button>
          )}
        </>
      )}
    </div>
  );
};

export default Blog;
