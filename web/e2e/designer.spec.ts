import { test, expect } from '@playwright/test';

test('Designer docType switcher works', async ({ page }) => {
  // Go to designer page
  await page.goto('/designer');

  // Check if "وصفة طبية" and "فاتورة" buttons exist
  const rxButton = page.locator('button', { hasText: 'وصفة طبية' });
  const invoiceButton = page.locator('button', { hasText: 'فاتورة' });

  await expect(rxButton).toBeVisible();
  await expect(invoiceButton).toBeVisible();

  // Click invoice button
  await invoiceButton.click();

  // The button should now have the active classes
  await expect(invoiceButton).toHaveClass(/bg-white/);
});

test('Properties panel shows empty state initially', async ({ page }) => {
  await page.goto('/designer');
  
  // Should show "حدد عنصراً من الورقة لتعديل خصائصه"
  await expect(page.locator('text=حدد عنصراً من الورقة لتعديل خصائصه')).toBeVisible();
});
