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

const findMaxEntry = (entries) =>
  entries.reduce(
    (maxEntry, entry) => (entry[1] > maxEntry[1] ? entry : maxEntry),
    entries[0],
  );

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  let authsNumBlogs = {};

  blogs.forEach((blog) => {
    if (!Object.keys(authsNumBlogs).includes(blog.author))
      authsNumBlogs[blog.author] = 0;

    authsNumBlogs[blog.author] += 1;
  });

  const mostBlogAuth = findMaxEntry(Object.entries(authsNumBlogs));

  return {
    author: mostBlogAuth[0],
    blogs: mostBlogAuth[1],
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;

  let authsTotalLikes = Object.fromEntries([
    ...new Set(blogs.map((blog) => [blog.author, 0])),
  ]);

  blogs.forEach((blog) => (authsTotalLikes[blog.author] += blog.likes));

  const authMostLikes = findMaxEntry(Object.entries(authsTotalLikes));

  return {
    author: authMostLikes[0],
    likes: authMostLikes[1],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
