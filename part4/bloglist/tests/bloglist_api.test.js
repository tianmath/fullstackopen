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

after(async () => {
  await mongoose.connection.close();
});
