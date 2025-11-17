import { test, expect } from '@playwright/test';

test.describe('Basic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have Bus Tracker title', async ({ page }) => {
    await expect(page.getByTestId('page-title')).toHaveText('UIUC Bus Tracker');
  });

  test('typing into the main textbox on page', async ({ page }) => {
    const input = page.getByTestId('stop-search-input');
    await input.fill('PAR');
    await expect(input).toHaveValue('PAR');

    // Verify suggestions appear
    const suggestions = page.getByTestId('stop-search-suggestions');
    await expect(suggestions).toBeVisible();
    await expect(suggestions).toContainText('PAR');
  });

  test('cycling through results should work', async ({ page }) => {
    const input = page.getByTestId('stop-search-input');
    await input.fill('PAR');
    await expect(input).toHaveValue('PAR');

    // Press down arrow 5 times - in Headless UI, this navigates but doesn't change input value
    for (let i = 0; i < 5; i++) {
      await input.press('ArrowDown');
    }

    // Value should still be PAR (Headless UI doesn't change input on arrow navigation)
    await expect(input).toHaveValue('PAR');

    // But suggestions should be visible
    await expect(page.getByTestId('stop-search-suggestions')).toBeVisible();
  });

  test('should navigate and select with keyboard', async ({ page }) => {
    const input = page.getByTestId('stop-search-input');
    await input.fill('PAR');

    // Navigate down and select with Enter
    await input.press('ArrowDown');
    await input.press('Enter');

    // Should navigate to the first suggestion (First and Lake Park North)
    await expect(page.getByTestId('stop-name')).toHaveText('First and Lake Park North');
    await expect(page.getByTestId('stop-name')).toBeVisible();
  });

  test('clicking enter should take to tracking page', async ({ page }) => {
    const input = page.getByTestId('stop-search-input');
    await input.fill('PAR');
    await input.press('Enter');

    await expect(page.getByTestId('stop-name')).toHaveText('Pennsylvania Ave. Residence Hall');
    await expect(page.getByTestId('stop-name')).toBeVisible();
  });

  test('picking another result should take to appropriate tracking page', async ({ page }) => {
    const input = page.getByTestId('stop-search-input');
    await input.fill('PAR');
    await input.press('ArrowDown');
    await input.press('Enter');

    await expect(page.getByTestId('stop-name')).toHaveText('First and Lake Park North');
    await expect(page.getByTestId('stop-name')).toBeVisible();
  });

  test('invalid result takes you nowhere', async ({ page }) => {
    const input = page.getByTestId('stop-search-input');
    await input.fill('ajsldk');
    await input.press('ArrowUp');
    await input.press('ArrowDown');
    await input.press('Enter');
    await expect(input).toHaveValue('ajsldk');

    // Should still be on home page
    await expect(page.getByTestId('page-title')).toHaveText('UIUC Bus Tracker');
  });

  test('empty result takes you nowhere', async ({ page }) => {
    const input = page.getByTestId('stop-search-input');
    await input.press('Enter');
    await expect(input).toHaveValue('');
    await expect(page.getByTestId('page-title')).toHaveText('UIUC Bus Tracker');
  });

  test('backspace to correct search gets results', async ({ page }) => {
    const input = page.getByTestId('stop-search-input');
    await input.fill('PARaaa');
    await input.press('Backspace');
    await input.press('Backspace');
    await input.press('Backspace');
    await expect(input).toHaveValue('PAR');

    // Suggestions should appear
    await expect(page.getByTestId('stop-search-suggestions')).toBeVisible();
  });

  test('fuzzy search works as expected', async ({ page }) => {
    const input = page.getByTestId('stop-search-input');
    await input.fill('greg first');

    const suggestions = page.getByTestId('stop-search-suggestions');
    await expect(suggestions).toContainText('First and Gregory');
  });

  test('fuzzy search advanced', async ({ page }) => {
    const input = page.getByTestId('stop-search-input');
    await input.fill('fo gree an');

    const firstOption = page.getByTestId('stop-search-option').first();
    await expect(firstOption).toContainText('Green and Fourth');
    await firstOption.click();

    await expect(page.getByTestId('stop-name')).toHaveText('Green and Fourth');
    await expect(page.getByTestId('stop-name')).toBeVisible();
  });
});
