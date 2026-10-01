const { test, describe, expect, beforeEach } = require('@playwright/test');
const {
  severalBlogs,
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

  describe('Login', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click();
    });

    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'chewara', 'salainen');
      await expect(page).toHaveURL('/');
      await expect(page.getByRole('link', { name: 'new blog' })).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'chewara', 'wrong');
      await expect(page).toHaveURL('/login');
      await expect(
        page.getByRole('link', { name: 'new blog' }),
      ).not.toBeVisible();
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
      await page.getByRole('link', { name: 'login' }).click();
      await loginWith(page, 'chewara', 'salainen');
    });

    test('a new blog can be created', async ({ page }) => {
      await createBlog(
        page,
        'a blog created using playwright',
        'playwright',
        'http://example.com/blogage',
      );
      await expect(page).toHaveURL('/');
      await expect(
        page.getByText('a blog created using playwright').last(),
      ).toBeVisible();
    });

    test('one can like a blog', async ({ page }) => {
      await page.getByRole('link', { name: 'second blog' }).click();
      await expect(page).toHaveURL(/\/blogs\/[a-zA-Z0-9]+/);

      const likeButton = page.getByRole('button', { name: 'like' });
      await likeButton.click();
      await expect(likeButton.locator('..')).toContainText('3');
    });

    test('one can delete own blog', async ({ page }) => {
      await page.getByRole('link', { name: 'first blog' }).click();

      const removeButton = page.getByRole('button', { name: 'remove' });
      page.on('dialog', (dialog) => dialog.accept());
      await removeButton.click();

      await expect(page).toHaveURL('/');
      await expect(page.getByText('first blog')).not.toBeVisible();
    });

    test("one can't see the remove button on someone else's blog", async ({
      page,
    }) => {
      await page.getByRole('link', { name: 'second blog' }).click();

      await expect(
        page.getByRole('button', { name: 'remove' }),
      ).not.toBeVisible();
    });

    // test('blogs are arranged in descending order according to their likes even with several additional blogs', async ({
    //   page,
    //   request,
    // }) => {
    //   await Promise.all(
    //     severalBlogs.map((blog) =>
    //       APILogWithUserAndCreateBlog(request, 'chewara', 'salainen', {
    //         title: blog.title,
    //         author: blog.author,
    //         url: blog.url,
    //         likes: blog.likes,
    //       }),
    //     ),
    //   );

    //   await page.reload();

    //   await page.getByRole('button', { name: 'view' }).last().waitFor();
    //   const currentViewButton = page
    //     .getByRole('button', { name: 'view' })
    //     .first();

    //   await currentViewButton.click();
    //   await currentViewButton.click();
    //   await currentViewButton.click();
    //   await currentViewButton.click();
    //   await currentViewButton.click();
    //   await currentViewButton.click();
    //   await currentViewButton.click();
    //   await currentViewButton.click();

    //   await expect(page.getByRole('button', { name: 'hide' })).toHaveCount(8);

    //   const likeDivs = await page
    //     .getByRole('button', { name: 'like' })
    //     .locator('..')
    //     .all();

    //   const likeTexts = await Promise.all(
    //     likeDivs.map((likeDiv) => likeDiv.textContent()),
    //   );

    //   const allLikes = likeTexts.map((text) => parseInt(text));
    //   expect(allLikes).toEqual(allLikes.toSorted((a, b) => b - a));
    // });
  });
});
