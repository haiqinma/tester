import { chromium, expect, test as base, type BrowserContext, type Page } from '@playwright/test';
import { cp, rm, writeFile } from 'fs/promises';
import os from 'os';
import path from 'path';
import { pathToFileURL } from 'url';
import { requireEnv } from './env';

const repoRoot = path.resolve(__dirname, '../..');

export const walletSeedDir = path.join(repoRoot, 'pw-user-data');
export const walletPreparedDir = path.join(os.tmpdir(), 'tester-wallet-prepared');
export const walletPreparedName = requireEnv('WALLET_TEST_NAME');
export const walletPreparedAddress = requireEnv('WALLET_TEST_ADDRESS');
export const walletPreparedPrivateKey = requireEnv('WALLET_TEST_PRIVATE_KEY');
export const walletPreparedPassword = 'E2E-password-2026';

async function copyProfile(sourceDir: string, targetDir: string) {
  await rm(targetDir, { recursive: true, force: true });
  await cp(sourceDir, targetDir, { recursive: true });
}

async function launchWalletContext(profileDir: string) {
  const extensionDir = path.join(profileDir, 'wallet');

  return chromium.launchPersistentContext(profileDir, {
    headless: false,
    args: [
      `--disable-extensions-except=${extensionDir}`,
      `--load-extension=${extensionDir}`,
    ],
  });
}

export async function getExtensionId(context: BrowserContext) {
  const existingWorker = context.serviceWorkers()[0];
  const worker = existingWorker || await context.waitForEvent('serviceworker');
  const extensionId = new URL(worker.url()).host;
  if (!/^[a-z]{32}$/.test(extensionId)) {
    throw new Error('Extension service worker should expose a valid id.');
  }

  return extensionId;
}

export async function openWalletPopup(context: BrowserContext) {
  const extensionId = await getExtensionId(context);
  const popupUrl = `chrome-extension://${extensionId}/html/popup.html`;
  const page = await context.newPage();
  await page.setViewportSize({ width: 380, height: 600 });
  await page.goto(popupUrl);
  return { extensionId, page, popupUrl };
}

export async function openWalletProbePage(context: BrowserContext) {
  const probePath = path.join(os.tmpdir(), 'tester-wallet-probe.html');
  await writeFile(probePath, '<!doctype html><html><head><title>Wallet Probe</title></head><body>probe</body></html>');
  const page = await context.newPage();
  await page.goto(pathToFileURL(probePath).href);
  return page;
}

export async function importPreparedPrivateKeyWallet(page: Page) {
  await page.locator('#welcomePage').waitFor({ state: 'visible' });
  await page.locator('#welcomeImportWalletBtn').click();
  await page.locator('#importPage').waitFor({ state: 'visible' });
  await page.locator('.import-tab[data-type="privateKey"]').click();
  await page.locator('#importAccountName').fill(walletPreparedName);
  await page.locator('#importPrivateKey').fill(walletPreparedPrivateKey);
  await page.locator('#importWalletPassword').fill(walletPreparedPassword);
  await page.locator('#importBtn').click();
  await page.locator('#walletPage').waitFor({ state: 'visible', timeout: 30_000 });
}

type WalletFixtures = {
  profileDir: string;
  context: BrowserContext;
  page: Page;
};

export const test = base.extend<WalletFixtures>({
  profileDir: [
    async ({}, use, workerInfo) => {
      const targetDir = path.join(
        os.tmpdir(),
        `tester-wallet-${workerInfo.project.name}-${workerInfo.workerIndex}`,
      );

      await copyProfile(walletPreparedDir, targetDir);
      try {
        await use(targetDir);
      } finally {
        await rm(targetDir, { recursive: true, force: true });
      }
    },
    { scope: 'worker' },
  ],
  context: async ({ profileDir }, use) => {
    const context = await launchWalletContext(profileDir);
    await use(context);
    await context.close();
  },
  page: async ({ context }, use) => {
    const page = context.pages()[0] ?? (await context.newPage());
    await use(page);
  },
});

export const prepareTest = base.extend<WalletFixtures>({
  profileDir: async ({}, use) => {
    await copyProfile(walletSeedDir, walletPreparedDir);
    await use(walletPreparedDir);
  },
  context: async ({ profileDir }, use) => {
    const context = await launchWalletContext(profileDir);
    await use(context);
    await context.close();
  },
  page: async ({ context }, use) => {
    const page = context.pages()[0] ?? (await context.newPage());
    await use(page);
  },
});

export { expect };
