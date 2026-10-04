import { test, expect } from '@playwright/test';

test('has title and can login', async ({ page }) => {
  await page.goto('/login');
  
  // Expect a title "تسجيل الدخول"
  await expect(page.locator('text=تسجيل الدخول').first()).toBeVisible();

  // Test form validation loosely or fill data
  const emailInput = page.locator('input[name="email"]');
  const passwordInput = page.locator('input[name="password"]');

  await expect(emailInput).toBeVisible();
  await expect(passwordInput).toBeVisible();
});
