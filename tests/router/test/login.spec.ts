import { expect, test } from '../../support/wallet';
import { expectWalletAvailable, openApp } from '../../support/app';

test('router test login', async ({ page }) => {
  await openApp(page, 'router', 'test');

  await expect(page).toHaveTitle(/Router/i);
  await expectWalletAvailable(page);
});
