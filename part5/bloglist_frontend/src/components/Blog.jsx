import { useState } from 'react';
import blogService from '../services/blogs';

const Blog = ({ blog }) => {
  const [displayDetails, setDisplayDetails] = useState(false);
  const [likes, setLikes] = useState(blog.likes);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleLike = async () => {
    const returnedBlog = await blogService.update(blog.id, {
      likes: likes + 1,
    });
    setLikes(returnedBlog.likes);
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
            {likes}
            <button onClick={handleLike}>like</button>
          </div>
          <div>{blog.user.username}</div>
        </>
      )}
    </div>
  );
};

export default Blog;
