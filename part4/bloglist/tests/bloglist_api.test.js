const assert = require('node:assert');
const { test, after, beforeEach, describe, before } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../app');
const helper = require('./test_helper');
const Blog = require('../models/blog');
const User = require('../models/user');

const api = supertest(app);

describe('when there is initially some blogs saved', () => {
  let allUsers;

  before(async () => {
    await User.deleteMany({});
    await User.insertMany(helper.initialUsers);

    allUsers = await User.find({});

    let userIndex = 0;
    const initialBlogsWithUserIds = helper.initialBlogs.map((blog, index) => {
      if (index !== 0 && index % 2 === 0) userIndex++;

      return { ...blog, user: allUsers[userIndex]._id.toString() };
    });

    await Blog.deleteMany({});
    await Blog.insertMany(initialBlogsWithUserIds);
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

  describe('addition of a blog', () => {
    test('without a logged user token fails with 401 status code', async () => {
      const newBlog = {
        title: 'failing blog',
        user: allUsers[0]._id.toString(),
        url: 'http://failing.blog.com/',
        likes: 0,
      };

      await api.post('/api/blogs').send(newBlog).expect(401);
    });

    describe('with a logged in user', () => {
      let token;

      before(async () => {
        const res = await api
          .post('/api/login')
          .send({
            username: 'chewara',
            password: 'sekret',
          })
          .expect(200)
          .expect('Content-Type', /application\/json/);

        token = res.body.token;
      });

      test('succeeds with valid data', async () => {
        const newBlog = {
          title: 'TDD harms architecture (instance 2)',
          user: allUsers[2]._id.toString(),
          url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
          likes: 0,
        };

        await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/);

        const blogsAtEnd = await helper.blogsInDb();
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

        const contents = blogsAtEnd.map((n) => n.title);

        assert(contents.includes('TDD harms architecture (instance 2)'));
      });

      test("defaults likes to 0 if likes is missing from POST request's body", async () => {
        const withLikesBlog = {
          title: 'No likes blog',
          author: 'Mr Peabody and Storm',
          url: 'http://example.com/test-withLikes.html',
          likes: 4,
        };

        const withoutLikesBlog = {
          title: 'No likes blog',
          author: 'Mr Peabody and Storm',
          url: 'http://example.com/test-withoutLikes.html',
        };

        const responseWithLikes = await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(withLikesBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/);

        const responseWithoutLikes = await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(withoutLikesBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/);

        assert.strictEqual(responseWithLikes.body.likes, 4);
        assert.strictEqual(responseWithoutLikes.body.likes, 0);
      });

      test('returns status code 400 if title or url is missing', async () => {
        const noTitleBlog = {
          author: 'Mr Peabody and Storm',
          url: 'http://example.com/test-noTitle.html',
          likes: 0,
        };

        await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(noTitleBlog)
          .expect(400);

        const noURLBlog = {
          title: 'No URL blog',
          author: 'Mr Peabody and Storm',
          likes: 0,
        };

        await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(noURLBlog)
          .expect(400);
      });
    });
  });

  describe('updating of a blog post', () => {
    test('succeeds with status code 200 if id is valid', async () => {
      const blogToUpdate = (await helper.blogsInDb())[0];
      assert.strictEqual(blogToUpdate.likes, 7);

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({ likes: 99 })
        .expect(200);

      const updatedBlog = (await helper.blogsInDb())[0];
      assert.strictEqual(updatedBlog.likes, 99);
    });
  });

  describe('deletion of a blog post', () => {
    test('by owner succeeds with status code 204 if id is valid', async () => {
      const res = await api
        .post('/api/login')
        .send({
          username: 'chewara',
          password: 'sekret',
        })
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const token = res.body.token;

      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      const blogsAtEnd = await helper.blogsInDb();

      const ids = blogsAtEnd.map((b) => b.id);
      assert(!ids.includes(blogToDelete.id));

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
