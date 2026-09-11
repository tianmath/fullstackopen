const jwt = require('jsonwebtoken');
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const { error } = require('../utils/logger');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('author', {
    username: 1,
    name: 1,
  });
  response.json(blogs);
});

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
};

blogsRouter.post('/', async (request, response) => {
  if (!request.body.title || !request.body.url)
    return response.status(400).end();

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }
  const user = await User.findById(decodedToken.id);

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

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

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
