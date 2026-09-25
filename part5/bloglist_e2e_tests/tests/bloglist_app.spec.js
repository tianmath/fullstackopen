const { test, describe, expect, beforeEach } = require('@playwright/test');

describe('Note app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible();
  });
});
