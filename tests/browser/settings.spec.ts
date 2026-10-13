import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('settings persist and downloaded backup restores settings and study data', async ({ page }) => {
  await page.setViewportSize({ width: 412, height: 915 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '오늘도, 한 걸음 더.' })).toBeVisible();
  await page.request.patch('/api/settings', { data: { theme: 'light', dailyGoal: 3, generalMode: false } });
  await page.goto('/#/settings');
  await page.reload();
  const theme = page.locator('.setting-row').filter({ hasText: '다크 모드' }).getByRole('button');
  const general = page.locator('.setting-row').filter({ hasText: '일반 학습 모드' }).getByRole('button');
  await theme.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByLabel('하루 학습 목표').selectOption('7');
  await expect.poll(async () => (await (await page.request.get('/api/state')).json()).settings.dailyGoal).toBe(7);
  await general.click();
  await expect(general).toHaveText('켜짐');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByLabel('하루 학습 목표')).toHaveValue('7');

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: '백업 다운로드' }).click();
  const download = await downloadPromise;
  const backupBytes = await readFile((await download.path())!);
  const backup = JSON.parse(backupBytes.toString());
  expect(backup.settings).toEqual({ theme: 'dark', dailyGoal: 7, generalMode: true });
  await theme.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByLabel('하루 학습 목표').selectOption('2');
  await expect.poll(async () => (await (await page.request.get('/api/state')).json()).settings.dailyGoal).toBe(2);

  const input = page.locator('input[type="file"]');
  await input.setInputFiles({ name: 'invalid.json', mimeType: 'application/json', buffer: Buffer.from('not json') });
  await expect(page.getByRole('status')).toContainText('유효한 JSON');
  await input.setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: backupBytes });
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: '데이터 교체 확인 · 복원' }).click();
  await expect(page.getByRole('status')).toHaveText('학습 데이터를 복원했습니다.');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByLabel('하루 학습 목표')).toHaveValue('7');
  const restored = await (await page.request.get('/api/backup')).json();
  for (const key of ['settings', 'progress', 'attempts', 'bookmarks', 'exams']) {
    expect(restored[key]).toEqual(backup[key]);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
