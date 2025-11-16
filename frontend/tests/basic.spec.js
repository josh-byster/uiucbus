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

    // Press down arrow
    await input.press('ArrowDown');
    await expect(input).toHaveValue('First and Lake Park North');
  });

  test('cycling through results should work', async ({ page }) => {
    const input = page.getByTestId('stop-search-input');
    await input.fill('PAR');
    await expect(input).toHaveValue('PAR');

    // Press down arrow 5 times
    for (let i = 0; i < 5; i++) {
      await input.press('ArrowDown');
    }
    await expect(input).toHaveValue('PAR');
  });

  test('should autofill based on selection', async ({ page }) => {
    const input = page.getByTestId('stop-search-input');
    await input.fill('PAR');
    await input.press('ArrowDown');
    await input.press('ArrowUp');
    await expect(input).toHaveValue('PAR (Pennsylvania Ave. Residence Hall)');

    // Press down arrow 5 times
    for (let i = 0; i < 5; i++) {
      await input.press('ArrowDown');
    }
    await expect(input).toHaveValue('PAR');
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
