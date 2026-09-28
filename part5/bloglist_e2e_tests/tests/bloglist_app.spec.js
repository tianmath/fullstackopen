const { test, describe, expect, beforeEach } = require('@playwright/test');
const {
  loginWith,
  createBlog,
  APILogWithUserAndCreateBlog,
} = require('./helper');

describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset');
    await request.post('/api/users', {
      data: {
        name: 'Na',
        username: 'chewara',
        password: 'salainen',
      },
    });

    await request.post('/api/users', {
      data: {
        name: 'Mr Peabody',
        username: 'botista',
        password: 'salainen',
      },
    });

    await page.goto('/');
  });

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'chewara', 'salainen');
      await expect(page.getByText('Na logged in')).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'chewara', 'wrong');
      await expect(page.getByText('Na logged in')).not.toBeVisible();
    });
  });

  describe('when logged in and some blogs already exist', () => {
    beforeEach(async ({ page, request }) => {
      await APILogWithUserAndCreateBlog(request, 'chewara', 'salainen', {
        title: 'first blog',
        author: 'someone',
        likes: 1,
        url: 'http://example.com/first-blog',
      });

      await APILogWithUserAndCreateBlog(request, 'botista', 'salainen', {
        title: 'second blog',
        author: 'another person',
        likes: 2,
        url: 'http://example.com/second-blog',
      });

      await page.reload();

      await loginWith(page, 'chewara', 'salainen');
    });

    test('a new blog can be created', async ({ page }) => {
      await createBlog(
        page,
        'a blog created using playwright',
        'playwright',
        'http://example.com/blogage',
      );
      await expect(
        page.getByText('a blog created using playwright').last(),
      ).toBeVisible();
    });

    test('one can like a blog', async ({ page }) => {
      const blog = page.getByText('second blog');
      await expect(blog).toBeVisible();

      await blog.getByRole('button', { name: 'view' }).click();

      const likeButton = blog
        .locator('..')
        .getByRole('button', { name: 'like' });

      await expect(likeButton).toBeVisible();
      await likeButton.click();
      await expect(likeButton.locator('..')).toContainText('3');
    });

    test('one can delete own blog', async ({ page }) => {
      const blog = page.getByText('first blog');
      await expect(blog).toBeVisible();

      await blog.getByRole('button', { name: 'view' }).click();

      const removeButton = blog
        .locator('..')
        .getByRole('button', { name: 'remove' });
      await expect(removeButton).toBeVisible();
      page.on('dialog', (dialog) => dialog.accept());
      await removeButton.click();

      await expect(page.getByText('first blog')).not.toBeVisible();
    });

    test("one can't see the remove button on someone else's blog", async ({
      page,
    }) => {
      const blogGroup = page.getByText('second blog').locator('..');
      await expect(blogGroup).toBeVisible();
      await blogGroup.getByRole('button', { name: 'view' }).click();
      await expect(
        blogGroup.getByText('button', { name: 'remove' }),
      ).not.toBeVisible();
    });
  });
});
