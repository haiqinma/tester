import { defineConfig, devices } from '@playwright/test';
import { loadLocalEnv } from './tests/support/env';
import type { AppEnv, AppName } from './tests/support/app';

loadLocalEnv();

const apps: AppName[] = ['chat', 'router', 'warehouse', 'node'];
const envs: AppEnv[] = ['prod', 'test'];

function suitePatterns(app: AppName, env: AppEnv) {
  return [
    `**/${app}/shared/**/*.spec.ts`,
    `**/${app}/${env}/**/*.spec.ts`,
  ];
}

function createProject(app: AppName, env: AppEnv) {
  return {
    name: `${app}-${env}`,
    metadata: { app, env },
    dependencies: ['prepare'],
    testMatch: suitePatterns(app, env),
    use: { ...devices['Desktop Chrome'] },
  };
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'prepare',
      testMatch: '**/prepare/**/*.spec.ts',
      workers: 1,
      metadata: { app: 'chat', env: 'prod' },
      use: { ...devices['Desktop Chrome'] },
    },
    ...apps.flatMap((app) => envs.map((env) => createProject(app, env))),
  ],
});
