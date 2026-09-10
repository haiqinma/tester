import { expect, test } from '../../support/wallet';
import { expectWalletAvailable, openApp } from '../../support/app';

test('warehouse prod login', async ({ page }) => {
  await openApp(page, 'warehouse', 'prod');

  await expect(page).toHaveTitle(/Warehouse/i);
  await expectWalletAvailable(page);
});
