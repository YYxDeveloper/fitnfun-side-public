import { test, expect } from '@playwright/test';

test.describe('Issue #19 - ChipSelector', () => {
  test('renders preset chips for course categories', async ({ page }) => {
    await page.goto('/#/instructors/new');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('button', { name: '籃球', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: '瑜珈', exact: true })).toBeVisible();
  });

  test('clicking preset chip toggles selection (aria-pressed)', async ({ page }) => {
    await page.goto('/#/instructors/new');
    await page.waitForLoadState('networkidle');

    const basketball = page.getByRole('button', { name: '籃球', exact: true });
    await expect(basketball).toHaveAttribute('aria-pressed', 'false');

    await basketball.click();
    await expect(basketball).toHaveAttribute('aria-pressed', 'true');

    await basketball.click();
    await expect(basketball).toHaveAttribute('aria-pressed', 'false');
  });

  test('can select multiple chips simultaneously', async ({ page }) => {
    await page.goto('/#/instructors/new');
    await page.waitForLoadState('networkidle');

    const basketball = page.getByRole('button', { name: '籃球', exact: true });
    const yoga = page.getByRole('button', { name: '瑜珈', exact: true });
    const fitness = page.getByRole('button', { name: '健身', exact: true });

    await basketball.click();
    await yoga.click();
    await fitness.click();

    await expect(basketball).toHaveAttribute('aria-pressed', 'true');
    await expect(yoga).toHaveAttribute('aria-pressed', 'true');
    await expect(fitness).toHaveAttribute('aria-pressed', 'true');
  });

  test('＋ 自訂 button expands input to add custom value', async ({ page }) => {
    await page.goto('/#/instructors/new');
    await page.waitForLoadState('networkidle');

    const customBtns = page.getByRole('button', { name: '＋ 自訂' });
    await customBtns.first().click();

    const input = page.getByPlaceholder('輸入後按 Enter').first();
    await expect(input).toBeVisible();

    await input.fill('客製化分類');
    await input.press('Enter');

    await expect(page.getByRole('button', { name: '移除 客製化分類' })).toBeVisible();
  });

  test('custom value can be individually removed', async ({ page }) => {
    await page.goto('/#/instructors/new');
    await page.waitForLoadState('networkidle');

    const customBtns = page.getByRole('button', { name: '＋ 自訂' });
    await customBtns.first().click();

    const input = page.getByPlaceholder('輸入後按 Enter').first();
    await expect(input).toBeVisible();

    await input.fill('臨時分類');
    await input.press('Enter');

    const removeBtn = page.getByRole('button', { name: '移除 臨時分類' });
    await expect(removeBtn).toBeVisible();

    await removeBtn.click();
    await expect(removeBtn).not.toBeVisible();
  });

  test('renders preset chips for instructor sources', async ({ page }) => {
    await page.goto('/#/instructors/new');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('button', { name: '社區', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: '工作室', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: '線上', exact: true })).toBeVisible();
  });
});
