import { expect, test } from '../../support/wallet';
import { expectWalletAvailable, openApp } from '../../support/app';

test('chat prod login', async ({ page }) => {
  await openApp(page, 'chat', 'prod');

  await expect(page).toHaveTitle(/Chat/);
  await expectWalletAvailable(page);
});
