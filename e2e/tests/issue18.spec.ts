import { test, expect } from '@playwright/test';
import path from 'path';

const FIXTURE_DIR = path.join(__dirname, 'fixtures');

test.describe('Issue #18 - AvatarUpload', () => {
  test('renders avatar upload area with placeholder text', async ({ page }) => {
    await page.goto('/#/instructors/new');
    await page.waitForLoadState('networkidle');

    await expect(page.getByLabel('上傳大頭照')).toBeVisible();
    await expect(page.getByText(/支援 JPG \/ PNG \/ WebP/)).toBeVisible();
  });

  test('selecting valid image shows preview and 重新上傳 button', async ({ page }) => {
    await page.goto('/#/instructors/new');
    await page.waitForLoadState('networkidle');

    const filePath = path.join(FIXTURE_DIR, 'avatar.png');
    const fileInput = page.locator('input[type="file"][aria-label="選擇大頭照檔案"]');
    await fileInput.setInputFiles(filePath);

    await expect(page.getByRole('img', { name: '大頭照預覽' })).toBeVisible();
    await expect(page.getByRole('button', { name: '重新上傳' })).toBeVisible();
  });

  test('rejects file exceeding 5MB with inline error', async ({ page }) => {
    await page.goto('/#/instructors/new');
    await page.waitForLoadState('networkidle');

    const filePath = path.join(FIXTURE_DIR, 'large.png');
    const fileInput = page.locator('input[type="file"][aria-label="選擇大頭照檔案"]');
    await fileInput.setInputFiles(filePath);

    await expect(page.getByText(/檔案大小不能超過/)).toBeVisible();
  });

  test('rejects file with invalid format with inline error', async ({ page }) => {
    await page.goto('/#/instructors/new');
    await page.waitForLoadState('networkidle');

    const filePath = path.join(FIXTURE_DIR, 'avatar.gif');
    const fileInput = page.locator('input[type="file"][aria-label="選擇大頭照檔案"]');
    await fileInput.setInputFiles(filePath);

    await expect(page.getByText(/僅支援 JPG \/ PNG \/ WebP/)).toBeVisible();
  });

  test('clear button removes preview', async ({ page }) => {
    await page.goto('/#/instructors/new');
    await page.waitForLoadState('networkidle');

    const filePath = path.join(FIXTURE_DIR, 'avatar.png');
    const fileInput = page.locator('input[type="file"][aria-label="選擇大頭照檔案"]');
    await fileInput.setInputFiles(filePath);

    await expect(page.getByRole('img', { name: '大頭照預覽' })).toBeVisible();

    await page.getByRole('button', { name: '重新上傳' }).click();
    await expect(page.getByRole('img', { name: '大頭照預覽' })).not.toBeVisible();
  });
});
