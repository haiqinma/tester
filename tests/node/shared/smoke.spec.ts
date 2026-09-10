import { expect, test } from '../../support/wallet';
import { expectWalletAvailable, openCurrentApp } from '../../support/app';

test('node shared smoke', async ({ page }, testInfo) => {
  const { app } = await openCurrentApp(page, testInfo);

  await expect(app).toBe('node');
  await expectWalletAvailable(page);
});
