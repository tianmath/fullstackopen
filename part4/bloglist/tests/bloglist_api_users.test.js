const assert = require('node:assert');
const bcrypt = require('bcrypt');
const { test, after, beforeEach, describe } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../app');
const helper = require('./test_helper');
const User = require('../models/user');

const api = supertest(app);

describe('When there is initially one user in the db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  describe('user creation', () => {
    test('succeeds with valid username and password', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: 'chewara',
        password: 'salainen',
      };

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

      const usernames = usersAtEnd.map((u) => u.username);
      assert(usernames.includes(newUser.username));
    });

    test('fails if username is missing', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        name: 'Na',
        password: 'salainen',
      };

      const response = await api.post('/api/users').send(newUser).expect(400);

      assert(response.body.error.includes('required'));

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test('fails if username is dupe', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: 'root',
        password: 'salainen',
      };

      const response = await api.post('/api/users').send(newUser).expect(400);

      assert(response.body.error.includes('unique'));

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test('fails if username too short', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: 'lo',
        password: 'salainen',
      };

      const response = await api.post('/api/users').send(newUser).expect(400);

      assert(
        response.body.error.includes(
          'is shorter than the minimum allowed length',
        ),
      );

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test('fails if password is missing', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: 'chewara',
      };

      const response = await api.post('/api/users').send(newUser).expect(400);

      assert(response.body.error.includes('required'));

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test('fails if password is too short', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: 'chewara',
        password: 'lo',
      };

      const response = await api.post('/api/users').send(newUser).expect(400);

      assert(response.body.error.includes('length must be at least'));

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
