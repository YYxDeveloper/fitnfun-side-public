import { test, expect } from '@playwright/test';

const SIMPLIFIED_CHARS = ['资', '联', '师', '为', '会', '过', '说', '机', '长', '车'];

test.describe('Issue #20 - Form UX Polish', () => {
  test('user navigates from home to instructor form and sees Traditional Chinese UI', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.getByRole('link', { name: /師資|instructor/i }).first().click();
    await page.waitForURL(/instructors$/);
    await page.waitForLoadState('networkidle');

    await page.getByRole('link', { name: /新增|new/i }).first().click();
    await page.waitForURL(/instructors\/new/);
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: '新增社區師資' })).toBeVisible();
    await expect(page.getByText('填寫基本資料，送出後進入草稿審核流程')).toBeVisible();
  });

  test('page contains no forbidden Simplified Chinese characters', async ({ page }) => {
    await page.goto('/#/instructors/new');
    await page.waitForLoadState('networkidle');

    const bodyText = await page.locator('body').innerText();
    for (const ch of SIMPLIFIED_CHARS) {
      if (bodyText.includes(ch)) {
        const context = bodyText.indexOf(ch);
        const snippet = bodyText.substring(Math.max(0, context - 8), context + 8);
        throw new Error(`Found Simplified char "${ch}" in: ...${snippet}...`);
      }
    }
  });

  test('character counter updates as user types in name field', async ({ page }) => {
    await page.goto('/#/instructors/new');
    await page.waitForLoadState('networkidle');

    const nameInput = page.getByPlaceholder('請填寫姓名');
    await nameInput.fill('王小明');

    const counter = page.getByTestId('name-counter');
    await expect(counter).toHaveText('3 / 255');
  });

  test('character counter switches to warning color above 90% (228 chars)', async ({ page }) => {
    await page.goto('/#/instructors/new');
    await page.waitForLoadState('networkidle');

    const nameInput = page.getByPlaceholder('請填寫姓名');
    const counter = page.getByTestId('name-counter');

    const longText = '中'.repeat(228);
    await nameInput.fill(longText);
    await expect(counter).toHaveText('228 / 255');
    await expect(counter).toHaveClass(/text-gray-400/);

    await nameInput.fill('中'.repeat(229));
    await expect(counter).toHaveText('229 / 255');
    await expect(counter).toHaveClass(/text-orange-500/);
  });

  test('offline save shows 查看暫存資料 button when savedLocally is true', async ({ page, context }) => {
    await context.addInitScript(() => {
      const original = window.fetch.bind(window);
      window.fetch = ((...args: Parameters<typeof fetch>) => {
        const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request).url;
        if (url.includes('/api/instructors') || url.includes('/api/upload')) {
          return Promise.reject(new TypeError('NetworkError'));
        }
        return original(...args);
      }) as typeof fetch;
    });

    await page.goto('/#/instructors/new');
    await page.waitForLoadState('networkidle');

    await page.getByPlaceholder('請填寫姓名').fill('測試人員');
    await page.getByPlaceholder('例如：籃球體能教練').fill('教練');
    await page.getByPlaceholder('09xx-xxx-xxx').fill('0912345678');

    await page.getByRole('button', { name: /送出/ }).click();

    await expect(page.getByRole('button', { name: /查看暫存資料/ })).toBeVisible({
      timeout: 10_000,
    });
  });

  test('查看暫存資料 button expands to show localStorage JSON and clears', async ({
    page,
    context,
  }) => {
    await context.addInitScript(() => {
      const original = window.fetch.bind(window);
      window.fetch = ((...args: Parameters<typeof fetch>) => {
        const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request).url;
        if (url.includes('/api/instructors')) {
          return Promise.reject(new TypeError('NetworkError'));
        }
        return original(...args);
      }) as typeof fetch;
    });

    await page.goto('/#/instructors/new');
    await page.waitForLoadState('networkidle');

    await page.getByPlaceholder('請填寫姓名').fill('王小明');
    await page.getByPlaceholder('09xx-xxx-xxx').fill('0912345678');

    await page.getByRole('button', { name: /送出/ }).click();

    const viewBtn = page.getByRole('button', { name: /查看暫存資料/ });
    await viewBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await viewBtn.click();

    await expect(page.getByTestId('pending-data-content')).toBeVisible();
    await expect(page.getByRole('button', { name: /清除暫存/ })).toBeVisible();

    await page.getByRole('button', { name: /清除暫存/ }).click();
    await expect(page.getByTestId('pending-data-content')).not.toBeVisible();
  });

  test('successful submit shows 返回師資列表 button and does NOT auto-navigate', async ({
    page,
    context,
  }) => {
    await context.addInitScript(() => {
      const original = window.fetch.bind(window);
      window.fetch = ((...args: Parameters<typeof fetch>) => {
        const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request).url;
        if (url.includes('/api/instructors')) {
          return Promise.resolve(
            new Response(
              JSON.stringify({
                data: {
                  id: 999,
                  documentId: 'test-doc',
                  name: '王小明',
                  review_status: 'draft',
                },
              }),
              { status: 201, headers: { 'Content-Type': 'application/json' } }
            )
          );
        }
        return original(...args);
      }) as typeof fetch;
    });

    await page.goto('/#/instructors/new');
    await page.waitForLoadState('networkidle');

    await page.getByPlaceholder('請填寫姓名').fill('王小明');
    await page.getByPlaceholder('09xx-xxx-xxx').fill('0912345678');

    await page.getByRole('button', { name: /送出/ }).click();

    const backBtn = page.getByRole('button', { name: /返回師資列表/ });
    await backBtn.waitFor({ state: 'visible', timeout: 10_000 });

    await page.waitForTimeout(1500);
    expect(page.url()).toContain('/instructors/new');

    await backBtn.click();
    await page.waitForURL(/instructors$/, { timeout: 5_000 });
  });
});
