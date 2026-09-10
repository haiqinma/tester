import { expect } from '@playwright/test';
import type { Page, TestInfo } from '@playwright/test';

export type AppName = 'chat' | 'router' | 'warehouse' | 'node';
export type AppEnv = 'prod' | 'test';

type ProjectMetadata = {
  app: AppName;
  env: AppEnv;
};

const appUrls: Record<AppName, Record<AppEnv, string | undefined>> = {
  chat: {
    prod: 'https://chat.yeying.pub',
    test: 'https://test-chat.yeying.pub',
  },
  router: {
    prod: 'http://router.yeying.pub',
    test: 'http://test-router.yeying.pub',
  },
  warehouse: {
    prod: 'http://warehouse.tidukongjian.com',
    test: 'http://test-webdav.yeying.pub',
  },
  node: {
    prod: 'http://node.yeying.pub',
    test: 'http://test-node.yeying.pub',
  },
};

export function resolveAppUrl(app: AppName, env: AppEnv) {
  const url = appUrls[app][env];
  if (!url) {
    throw new Error(`Missing URL for ${app}-${env}.`);
  }

  return url;
}

export function getProjectMetadata(testInfo: TestInfo): ProjectMetadata {
  const metadata = testInfo.project.metadata as Partial<ProjectMetadata> | undefined;
  if (!metadata?.app || !metadata?.env) {
    throw new Error(`Project metadata must include app and env for ${testInfo.project.name}.`);
  }

  return {
    app: metadata.app,
    env: metadata.env,
  };
}

export async function openApp(page: Page, app: AppName, env: AppEnv) {
  const url = resolveAppUrl(app, env);
  await page.goto(url);
  return url;
}

export async function openCurrentApp(page: Page, testInfo: TestInfo) {
  const { app, env } = getProjectMetadata(testInfo);
  const url = resolveAppUrl(app, env);
  await page.goto(url);
  return { app, env, url };
}

export async function expectWalletAvailable(page: Page) {
  await expect
    .poll(async () =>
      page.evaluate(() => Boolean((window as Window & { ethereum?: unknown }).ethereum)),
    )
    .toBeTruthy();
}
