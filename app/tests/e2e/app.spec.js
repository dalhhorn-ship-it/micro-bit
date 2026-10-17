import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Demo/ }).click();
  await expect(page.locator('#status')).toHaveText('Demo micro:bit');
});

test('a slider moves a servo', async ({ page }) => {
  await page.getByLabel('Servo 2').fill('120');
  await expect(page.locator('[data-servo="2"]')).toHaveText('120°');
});

test('an icon shows on the LEDs', async ({ page }) => {
  await page.getByRole('button', { name: 'heart' }).click();
  await expect(page.locator('#sim-leds .led.on')).toHaveCount(16);
});

test('drawing and showing a picture', async ({ page }) => {
  await page.getByRole('button', { name: 'LED 1, 1' }).click();
  await page.getByRole('button', { name: 'LED 5, 5' }).click();
  await page.getByRole('button', { name: /Show it/ }).click();
  await expect(page.locator('#sim-leds .led.on')).toHaveCount(2);
});

test('words scroll on the micro:bit', async ({ page }) => {
  await page.getByPlaceholder('Type a word').fill('Hop hop');
  await page.getByRole('button', { name: /Send/ }).click();
  await expect(page.locator('#sim-text')).toHaveText('Hop hop');
});

test('the starter program runs', async ({ page }) => {
  await page.getByRole('tab', { name: /Program/ }).click();
  await expect(page.locator('.blocklyMainBackground')).toBeVisible();
  // The text only shows while it scrolls, so record everything it shows.
  await page.evaluate(() => {
    window.shown = [];
    const el = document.querySelector('#sim-text');
    new MutationObserver(() => window.shown.push(el.textContent)).observe(el, { childList: true, characterData: true, subtree: true });
  });
  await page.getByRole('button', { name: /Run/ }).click();
  await expect(page.getByRole('button', { name: /Stop/ })).toBeEnabled();
  await expect(page.getByRole('button', { name: /Run/ })).toBeEnabled({ timeout: 10000 });
  expect(await page.evaluate(() => window.shown)).toContain('Hi!');
  await expect(page.locator('[data-servo="1"]')).toHaveText('150°');
});

test('a program waits for button A', async ({ page }) => {
  // Build the program through the saved JSON, then reload it.
  await page.evaluate(() => localStorage.setItem('space-bunnies-program', JSON.stringify({
    blocks: { languageVersion: 0, blocks: [{ type: 'sb_on_start', x: 20, y: 20, inputs: { DO: { block: {
      type: 'sb_wait_button', fields: { BUTTON: 'A' },
      next: { block: { type: 'sb_show_icon', fields: { ICON: 'happy' } } },
    } } } }] },
  })));
  await page.reload();
  await page.getByRole('button', { name: /Demo/ }).click();
  await page.getByRole('tab', { name: /Program/ }).click();
  await page.getByRole('button', { name: /Run/ }).click();
  await expect(page.locator('#sim-leds .led.on')).toHaveCount(0);
  await page.locator('[data-press="A"]').click();
  await expect(page.locator('#sim-leds .led.on')).toHaveCount(7);
  await expect(page.getByRole('button', { name: /Run/ })).toBeEnabled();
});

test('Connect explains when the browser has no Bluetooth', async ({ page }) => {
  await page.getByRole('button', { name: 'Disconnect' }).click();
  await page.evaluate(() => { delete Navigator.prototype.bluetooth; });
  await page.getByRole('button', { name: /Connect micro:bit/ }).click();
  await expect(page.locator('#toast')).toContainText('Bluefy');
});
