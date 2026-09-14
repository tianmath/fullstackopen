const middleware = require('../utils/middleware');
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('author', {
    username: 1,
    name: 1,
  });
  response.json(blogs);
});

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  if (!request.body.title || !request.body.url)
    return response
      .status(400)
      .json({ error: 'both title and url are required' });

  const user = request.user;

  const blog = new Blog({
    ...request.body,
    author: user.id,
    likes: request.body.likes || 0,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const blogToDeleteId = request.params.id;

    const blogToDelete = await Blog.findById(blogToDeleteId);
    if (!blogToDelete)
      return response.status(404).json({ error: `blog doesn't exist` });

    const user = request.user;

    if (user._id.toString() !== blogToDelete.author.toString()) {
      return response
        .status(403)
        .json({ error: `user invalid, can't delete other's blog` });
    }

    await Blog.findByIdAndDelete(blogToDeleteId);
    user.blogs = user.blogs.filter((id) => id.toString() !== blogToDeleteId);
    await user.save();

    response.status(204).end();
  },
);

blogsRouter.put('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(404).end();
  }

  const { title, author, url, likes } = request.body;

  if (title) blog.title = title;
  if (author) blog.author = author;
  if (url) blog.url = url;
  if (likes) blog.likes = likes;

  const updatedBlog = await blog.save();
  response.json(updatedBlog);
});

module.exports = blogsRouter;
