import { expect, test } from '../../support/wallet';
import { expectWalletAvailable, openApp } from '../../support/app';

test('node test login', async ({ page }) => {
  await openApp(page, 'node', 'test');

  await expect(page).toHaveTitle(/Node/i);
  await expectWalletAvailable(page);
});
