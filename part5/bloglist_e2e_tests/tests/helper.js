const loginWith = async (page, username, password) => {
  await page.getByLabel('username').fill(username);
  await page.getByLabel('password').fill(password);
  await page.getByRole('button', { name: 'login' }).click();
};

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'create new blog' }).click();

  await page.getByLabel('title:').fill(title);
  await page.getByLabel('author:').fill(author);
  await page.getByLabel('url:').fill(url);

  await page.getByRole('button', { name: 'create' }).click();
};

const APILogWithUserAndCreateBlog = async (
  request,
  username,
  password,
  blog,
) => {
  const loginResponse = await request.post('/api/login', {
    data: {
      username: username,
      password: password,
    },
  });

  const { token } = await loginResponse.json();

  await request.post('/api/blogs', {
    data: blog,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export { loginWith, createBlog, APILogWithUserAndCreateBlog };
