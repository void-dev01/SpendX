import { test, expect } from '@playwright/test';

test.describe('SpendX E2E Core Flows', () => {
  test('redirects unauthenticated visitors to login screen', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/.*\/auth\/login/);
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
  });

  test('successfully logs in with demo account and renders dashboard', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByPlaceholder(/email/i).fill('shubham@spendx.app');
    await page.getByPlaceholder(/password/i).fill('Password123!');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('navigates to ledger and displays transactions header', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByPlaceholder(/email/i).fill('shubham@spendx.app');
    await page.getByPlaceholder(/password/i).fill('Password123!');
    await page.getByRole('button', { name: /sign in/i }).click();

    await page.goto('/transactions');
    await expect(page.getByRole('heading', { name: 'Transactions', level: 1 })).toBeVisible();
  });
});
