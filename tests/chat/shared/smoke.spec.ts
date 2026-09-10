import { expect, test } from '../../support/wallet';
import { expectWalletAvailable, openCurrentApp } from '../../support/app';

test('chat shared smoke', async ({ page }, testInfo) => {
  const { app, env } = await openCurrentApp(page, testInfo);

  await expect(page).toHaveTitle(/Chat/);
  await expectWalletAvailable(page);
  await expect(app).toBe('chat');
  await expect(['prod', 'test']).toContain(env);
});
