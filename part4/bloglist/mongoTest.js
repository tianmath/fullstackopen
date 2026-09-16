const mongoose = require('mongoose');
const helper = require('./tests/test_helper');
const User = require('./models/user');
const Blog = require('./models/blog');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.se5we2g.mongodb.net/testBloglistApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose
  .connect(url, { family: 4 })
  .then((result) => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

(async () => {
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

  mongoose.connection.close();
})();
