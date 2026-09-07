const assert = require('node:assert');
const { test, after, beforeEach } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const Blog = require('../models/blog');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  await Blog.insertMany(helper.initialBlogs);
});

test('all blogs are correctly returned in JSON format', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test('the unique identifier property of a blog is named id', async () => {
  const someBlog = (await Blog.find({}))[0];

  assert.strictEqual(someBlog._id.toString(), someBlog.toJSON().id);
});

test('a blog post can be created', async () => {
  const newBlog = {
    title: 'TDD harms architecture (instance 2)',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.BlogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

  const contents = blogsAtEnd.map((n) => n.title);

  assert(contents.includes('TDD harms architecture (instance 2)'));
});

after(async () => {
  await mongoose.connection.close();
});
