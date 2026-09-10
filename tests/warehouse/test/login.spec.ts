import { expect, test } from '../../support/wallet';
import { expectWalletAvailable, openApp } from '../../support/app';

test('warehouse test login', async ({ page }) => {
  await openApp(page, 'warehouse', 'test');

  await expect(page).toHaveTitle(/Warehouse/i);
  await expectWalletAvailable(page);
});
