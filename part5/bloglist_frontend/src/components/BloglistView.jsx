import Notification from './Notification';
import Blog from './Blog';

const BloglistPage = ({ blogs, user, message, likeBlog, removeBlog }) => {
  return (
    <div>
      <h2>blogs</h2>

      <Notification message={message} />

      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          onLike={likeBlog}
          onRemove={removeBlog}
        />
      ))}
    </div>
  );
};

export default BloglistPage;
