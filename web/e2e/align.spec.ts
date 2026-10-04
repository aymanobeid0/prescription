import { test, expect } from '@playwright/test';

test('Text alignment applies correctly', async ({ page }) => {
  await page.goto('/designer');

  const textDraggable = page.locator('text=نص حر').first();
  const paper = page.locator('.bg-white.shadow-xl').first();

  await textDraggable.dragTo(paper, { targetPosition: { x: 100, y: 100 } });
  
  const canvasElementWrapper = paper.locator('.absolute.overflow-visible').last();
  await canvasElementWrapper.click();

  // Find the text inner div
  const innerDiv = canvasElementWrapper.locator('[contenteditable]');

  // Click left align button
  const leftAlignBtn = page.locator('button:has-text("يسار")');
  await leftAlignBtn.click();
  await page.waitForTimeout(100);

  // Check if text align is applied
  const textAlign = await canvasElementWrapper.evaluate(el => {
    // Look at the wrapper style which has textAlign applied
    return (el.firstChild as HTMLElement).style.textAlign;
  });
  
  console.log("Text align is:", textAlign);
  expect(textAlign).toBe('left');
});
