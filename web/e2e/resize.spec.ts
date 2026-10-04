import { test, expect } from '@playwright/test';

test('Element resizing works', async ({ page }) => {
  await page.goto('/designer');

  const textDraggable = page.locator('text=نص حر').first();
  const paper = page.locator('.bg-white.shadow-xl').first();

  await textDraggable.dragTo(paper, { targetPosition: { x: 100, y: 100 } });
  
  const canvasElementWrapper = paper.locator('.absolute.overflow-visible').last();
  await canvasElementWrapper.click();

  // Wait for selection
  const handleEast = page.locator('div[style*="e-resize"]').first();
  await expect(handleEast).toBeVisible();

  // Resize
  const initialWidth = await canvasElementWrapper.evaluate(el => el.style.width);
  
  await handleEast.dragTo(paper, { targetPosition: { x: 300, y: 100 } });

  await page.waitForTimeout(100); // give store a moment to update

  const newWidth = await canvasElementWrapper.evaluate(el => el.style.width);
  console.log("Initial Width:", initialWidth, "New Width:", newWidth);
  expect(initialWidth).not.toBe(newWidth);
});
