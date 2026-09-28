const { test, describe, expect, beforeEach } = require('@playwright/test');
const { loginWith, createBlog } = require('./helper');

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

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
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

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(
          page,
          'a blog created using playwright',
          'playwright',
          'http://example.com/blogage',
        );
      });

      test('the blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click();
        expect(page.getByRole('button', { name: 'like' })).toBeVisible();

        const likeButton = page.getByRole('button', { name: 'like' });
        await likeButton.click();
        await expect(likeButton.locator('..')).toContainText('1');
      });

      test('the blog can be deleted by the logged in user if he created it', async ({
        page,
      }) => {
        await page.getByRole('button', { name: 'view' }).click();
        await expect(
          page.getByRole('button', { name: 'remove' }),
        ).toBeVisible();

        page.on('dialog', (dialog) => dialog.accept());
        await page.getByRole('button', { name: 'remove' }).click();

        await expect(
          page.getByText('a blog created using playwright').last(),
        ).not.toBeVisible();
      });

      test("the blog's remove button can't be seen by the logged in user if he did not create the blog", async ({
        page,
        request,
      }) => {
        await request.post('/api/users', {
          data: {
            name: 'some temp user',
            username: 'tempuser',
            password: 'salainen',
          },
        });

        const loginResponse = await request.post('/api/login', {
          data: {
            username: 'tempuser',
            password: 'salainen',
          },
        });

        const { token } = await loginResponse.json();

        await request.post('/api/blogs', {
          data: {
            title: 'A test to delete',
            url: 'deleteURL',
            likes: 15,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        await page.reload();

        await expect(page.getByText('A test to delete')).toBeVisible();
        const elt = page.getByText('A test to delete');
        await elt.getByRole('button', { name: 'view' }).click();
        await expect(
          elt.getByText('button', { name: 'remove' }),
        ).not.toBeVisible();
      });
    });
  });
});
