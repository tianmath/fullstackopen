const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;

  return blogs.reduce(
    (withMostLikes, blog) =>
      blog.likes > withMostLikes.likes ? blog : withMostLikes,
    blogs[0],
  );
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  let authsNumBlogs = {};

  blogs.forEach((blog) => {
    if (!Object.keys(authsNumBlogs).includes(blog.author))
      authsNumBlogs[blog.author] = 0;

    authsNumBlogs[blog.author] += 1;
  });

  authsNumBlogs = Object.entries(authsNumBlogs);

  const mostBlogAuth = authsNumBlogs.reduce(
    (mostBlogAuth, auth) => (auth[1] > mostBlogAuth[1] ? auth : mostBlogAuth),
    authsNumBlogs[0],
  );

  return {
    author: mostBlogAuth[0],
    blogs: mostBlogAuth[1],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
