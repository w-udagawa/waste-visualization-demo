import { test, expect } from '@playwright/test';

test('debug dashboard', async ({ page }) => {
  // コンソールエラーをキャッチ
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.error('Browser console error:', msg.text());
    }
  });

  // ページエラーをキャッチ
  page.on('pageerror', (error) => {
    console.error('Page error:', error.message);
  });

  // ダッシュボードページにアクセス
  await page.goto('http://localhost:3000');

  // ページタイトルを確認
  await page.waitForTimeout(5000);

  // スクリーンショットを撮る
  await page.screenshot({ path: 'tests/debug-screenshot.png', fullPage: true });

  // ページのHTMLを確認
  const html = await page.content();
  console.log('Page loaded, HTML length:', html.length);

  // エラーメッセージがあるか確認
  const errorElement = await page.locator('text=/エラー|Error/i').first();
  const errorVisible = await errorElement.isVisible().catch(() => false);

  if (errorVisible) {
    const errorText = await errorElement.textContent();
    console.log('Error found on page:', errorText);
  }

  // ダッシュボードの主要要素を確認
  const header = await page.locator('h1').first();
  const headerVisible = await header.isVisible().catch(() => false);

  if (headerVisible) {
    const headerText = await header.textContent();
    console.log('Header text:', headerText);
  }
});
