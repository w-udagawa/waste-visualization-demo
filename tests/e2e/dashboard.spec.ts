import { test, expect } from '@playwright/test';

/**
 * Dashboard E2E Tests
 * playwright-mcpを使用したAIアシストテスト
 */

test.describe('Dashboard Page', () => {
  test('should load and display the main dashboard', async ({ page }) => {
    // トップページにアクセス
    await page.goto('/');

    // タイトルが表示されることを確認
    await expect(page).toHaveTitle(/廃棄物見える化システム/);

    // ヘッダーが表示されることを確認
    const header = page.locator('header');
    await expect(header).toBeVisible();
    await expect(header).toContainText('廃棄物見える化システム');
  });

  test('should navigate to branches page', async ({ page }) => {
    await page.goto('/');

    // 支店一覧リンクをクリック
    await page.click('text=支店一覧');

    // URLが変更されることを確認
    await expect(page).toHaveURL(/\/branches/);
  });

  test('should navigate to sites page', async ({ page }) => {
    await page.goto('/');

    // 現場一覧リンクをクリック
    await page.click('text=現場一覧');

    // URLが変更されることを確認
    await expect(page).toHaveURL(/\/sites/);
  });

  test('should navigate to data registration page', async ({ page }) => {
    await page.goto('/');

    // データ登録リンクをクリック
    await page.click('text=データ登録');

    // URLが変更されることを確認
    await expect(page).toHaveURL(/\/data/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    // モバイルビューポートを設定
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // ヘッダーが表示されることを確認
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // モバイルナビゲーションが表示されることを確認
    const mobileNav = page.locator('nav').nth(1);
    await expect(mobileNav).toBeVisible();
  });
});