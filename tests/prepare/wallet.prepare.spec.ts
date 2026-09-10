import {
  expect,
  importPreparedPrivateKeyWallet,
  walletPreparedAddress,
  walletPreparedName,
  openWalletProbePage,
  openWalletPopup,
  prepareTest,
} from '../support/wallet';
import { expectWalletAvailable } from '../support/app';

prepareTest('wallet environment is ready', async ({ context }) => {
  const probePage = await openWalletProbePage(context);
  await expectWalletAvailable(probePage);

  const { page: popupPage } = await openWalletPopup(context);
  await importPreparedPrivateKeyWallet(popupPage);
  await expect(popupPage).toHaveTitle(/夜莺钱包/);
  await expect(popupPage.locator('#accountName')).toHaveText(walletPreparedName);
  await expect
    .poll(async () => popupPage.locator('#accountAddress').evaluate((el) => el.dataset.address || ''))
    .toBe(walletPreparedAddress);
});
