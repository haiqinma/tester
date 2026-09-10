import { expect, test } from '../../support/wallet';
import { expectWalletAvailable, openApp } from '../../support/app';

test('chat test login', async ({ page }) => {
  await openApp(page, 'chat', 'test');

  await expect(page).toHaveTitle(/Chat/);
  await expectWalletAvailable(page);
});
