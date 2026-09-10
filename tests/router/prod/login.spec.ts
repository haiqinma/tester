import { expect, test } from '../../support/wallet';
import { expectWalletAvailable, openApp } from '../../support/app';

test('router prod login', async ({ page }) => {
  await openApp(page, 'router', 'prod');

  await expect(page).toHaveTitle(/Router/i);
  await expectWalletAvailable(page);
});
