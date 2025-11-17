import { test, expect } from '@playwright/test';

test.describe('Tracking With Stops Available', () => {
  test.beforeEach(async ({ page }) => {
    // Set up API mocking
    await page.route('**/getdeparturesbystop?stop_id=*', async (route) => {
      const json = await import('./fixtures/many_stops.json', { with: { type: 'json' } });
      await route.fulfill({ json: json.default });
    });

    await page.route('**/getstop?stop_id=IU', async (route) => {
      const json = await import('./fixtures/getstop_iu.json', { with: { type: 'json' } });
      await route.fulfill({ json: json.default });
    });

    await page.route('**/getvehicle?vehicle_id=*', async (route) => {
      const json = await import('./fixtures/getvehicle.json', { with: { type: 'json' } });
      await route.fulfill({ json: json.default });
    });

    await page.goto('/#/track/IU');
  });

  test('should have proper title', async ({ page }) => {
    await expect(page.getByTestId('stop-name')).toHaveText('Illini Union');
  });

  test('can navigate to another tracking page', async ({ page }) => {
    await page.getByTestId('stop-search-input').fill('First');
    await page.getByTestId('stop-search-input').press('Enter');

    await expect(page.getByTestId('stop-name')).toContainText('First');
    await expect(page.getByTestId('stop-name')).toBeVisible();
  });

  test("doesn't display the no results message", async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(1000);
    await expect(page.locator('text=No buses')).not.toBeVisible();
  });

  test('first row is correct headsign', async ({ page }) => {
    const firstRow = page.getByTestId('bus-result-row').first();
    const headsign = firstRow.getByTestId('bus-headsign');

    await expect(headsign).toContainText('100S');
    await expect(headsign).toContainText('E14');
  });

  test('first row has correct ETA', async ({ page }) => {
    const firstRow = page.getByTestId('bus-result-row').first();
    const eta = firstRow.getByTestId('bus-eta');

    await expect(eta).toContainText('1m');
  });

  test('should have the correct number of rows', async ({ page }) => {
    await expect(page.getByTestId('bus-result-row')).toHaveCount(27);
  });

  test("should have a modal title that's correct", async ({ page }) => {
    await page.getByTestId('bus-result-row').first().click();

    const modalTitle = page.getByTestId('bus-modal-title');
    await expect(modalTitle).toBeVisible();
    await expect(modalTitle).toContainText('100S');
    await expect(modalTitle).toContainText('E14');
  });

  test('should have a modal image', async ({ page }) => {
    await page.getByTestId('bus-result-row').first().click();

    const modalImage = page.getByTestId('bus-modal-image');
    await expect(modalImage).toBeVisible();
  });

  test('should have space for next stop and previous stop', async ({ page }) => {
    await page.getByTestId('bus-result-row').first().click();

    await expect(page.locator('text=Next Stop')).toBeVisible();
    await expect(page.locator('text=Previous Stop')).toBeVisible();
  });

  test('should be able to click on multiple locations', async ({ page }) => {
    // Click second bus
    await page.getByTestId('bus-result-row').nth(1).click();

    let modalTitle = page.getByTestId('bus-modal-title');
    await expect(modalTitle).toBeVisible();
    await expect(modalTitle).toContainText('120W');
    await expect(modalTitle).toContainText('Teal');

    // Close modal with ESC
    await page.keyboard.press('Escape');

    // Click third bus
    await page.getByTestId('bus-result-row').nth(2).click();

    modalTitle = page.getByTestId('bus-modal-title');
    await expect(modalTitle).toBeVisible();
    await expect(modalTitle).toContainText('220S');
    await expect(modalTitle).toContainText('Illini');
  });
});
