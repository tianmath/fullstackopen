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
  });
});
