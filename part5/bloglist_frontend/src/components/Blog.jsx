import { useState } from 'react';
import blogService from '../services/blogs';

const Blog = ({ blog, user, fetchallBlogsAndSort, displayNotification }) => {
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
    await fetchallBlogsAndSort();
  };

  const handleRemove = async () => {
    if (window.confirm(`Remove ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id);
        await fetchallBlogsAndSort();
        displayNotification('success', `blog successfully remove`, 3000);
      } catch (error) {
        displayNotification('error', error.response.data.error, 3000);
      }
    }
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
          {blog.user.username === user.username && (
            <button onClick={handleRemove}>remove</button>
          )}
        </>
      )}
    </div>
  );
};

export default Blog;
