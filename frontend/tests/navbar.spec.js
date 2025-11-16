import { test, expect } from '@playwright/test';

test.describe('Navbar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should be able to click on links', async ({ page }) => {
    // Click first nav link (Transit Plaza)
    await page.getByTestId('nav-stop-link').nth(0).click();
    await expect(page.getByTestId('stop-name')).toHaveText('Transit Plaza');
    await expect(page.getByTestId('stop-name')).toBeVisible();

    // Click second nav link (Illini Union)
    await page.getByTestId('nav-stop-link').nth(1).click();
    await expect(page.getByTestId('stop-name')).toHaveText('Illini Union');
    await expect(page.getByTestId('stop-name')).toBeVisible();
  });

  test('should be able to get and clear recents', async ({ page }) => {
    // Click Transit Plaza
    await page.getByTestId('nav-stop-link').nth(0).click();
    // Click Illini Union
    await page.getByTestId('nav-stop-link').nth(1).click();

    // Open recents dropdown
    await page.getByTestId('recents-dropdown-toggle').click();

    // Check recents order
    await expect(page.getByTestId('recents-dropdown-item').nth(0)).toContainText('Illini Union');
    await expect(page.getByTestId('recents-dropdown-item').nth(1)).toContainText('Transit Plaza');

    // Click Clear All
    await page.getByTestId('recents-clear-all').click();

    // Wait for dropdown to close
    await page.waitForTimeout(300);

    // Reopen dropdown
    await page.getByTestId('recents-dropdown-toggle').click();

    // Check that recents are cleared
    await expect(page.getByTestId('recents-dropdown-menu')).toContainText('No recent stops');
  });

  test('pushes recents without duplicates (different order)', async ({ page }) => {
    // Click stops in order: Transit, Union, PAR, Union
    await page.getByTestId('nav-stop-link').nth(0).click(); // Transit
    await page.getByTestId('nav-stop-link').nth(1).click(); // Union
    await page.getByTestId('nav-stop-link').nth(2).click(); // PAR
    await page.getByTestId('nav-stop-link').nth(1).click(); // Union again

    // Open recents
    await page.getByTestId('recents-dropdown-toggle').click();

    // Check order: Union, PAR, Transit
    await expect(page.getByTestId('recents-dropdown-item').nth(0)).toContainText('Illini Union');
    await expect(page.getByTestId('recents-dropdown-item').nth(1)).toContainText('PAR');
    await expect(page.getByTestId('recents-dropdown-item').nth(2)).toContainText('Transit Plaza');
  });

  test('pushes recents without duplicates (same element twice)', async ({ page }) => {
    // Click PAR twice
    await page.getByTestId('nav-stop-link').nth(2).click();
    await page.getByTestId('nav-stop-link').nth(2).click();

    // Open recents
    await page.getByTestId('recents-dropdown-toggle').click();

    // Should only have one item
    await expect(page.getByTestId('recents-dropdown-item')).toHaveCount(1);
    await expect(page.getByTestId('recents-dropdown-item')).toContainText('PAR');
  });

  test('has recents links that work', async ({ page }) => {
    // Click Transit and Union
    await page.getByTestId('nav-stop-link').nth(0).click();
    await page.getByTestId('nav-stop-link').nth(1).click();

    // Open recents and click first item
    await page.getByTestId('recents-dropdown-toggle').click();
    await page.getByTestId('recents-dropdown-item').nth(0).click();

    // Should navigate to Illini Union
    await expect(page.getByTestId('stop-name')).toHaveText('Illini Union');
  });

  test("doesn't change order when clicking a recent link", async ({ page }) => {
    // Click Transit and Union
    await page.getByTestId('nav-stop-link').nth(0).click();
    await page.getByTestId('nav-stop-link').nth(1).click();

    // Open recents and click second item (Transit)
    await page.getByTestId('recents-dropdown-toggle').click();
    await page.getByTestId('recents-dropdown-item').nth(1).click();

    // Reopen recents
    await page.getByTestId('recents-dropdown-toggle').click();

    // Check order hasn't changed
    await expect(page.getByTestId('recents-dropdown-item').nth(0)).toContainText('Illini Union');
    await expect(page.getByTestId('recents-dropdown-item').nth(1)).toContainText('Transit Plaza');
  });

  test("clearall doesn't break on empty set", async ({ page }) => {
    // Open recents (empty)
    await page.getByTestId('recents-dropdown-toggle').click();

    // Click Clear All
    await page.getByTestId('recents-clear-all').click();

    // Wait for dropdown to close
    await page.waitForTimeout(300);

    // Reopen recents
    await page.getByTestId('recents-dropdown-toggle').click();

    // Should still show "No recent stops"
    await expect(page.getByTestId('recents-dropdown-menu')).toContainText('No recent stops');
  });

  test('has a home button that works', async ({ page }) => {
    // Click a nav link
    await page.getByTestId('nav-stop-link').nth(0).click();

    // Click home button
    await page.getByTestId('navbar-home-link').click();

    // Should be on home page
    await expect(page.locator('h1')).toHaveText('UIUC Bus Tracker');
  });

  test('can toggle recents', async ({ page }) => {
    // Open recents
    await page.getByTestId('recents-dropdown-toggle').click();
    await expect(page.getByTestId('recents-dropdown-menu')).toBeVisible();

    // Close recents
    await page.getByTestId('recents-dropdown-toggle').click();

    // Should be removed from DOM (Headless UI behavior)
    await expect(page.getByTestId('recents-dropdown-menu')).not.toBeVisible();
  });
});
