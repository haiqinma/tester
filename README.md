# tester

## Browser Configuration

Playwright 使用 [playwright.config.ts](./playwright.config.ts) 里的 `projects` 来决定要跑哪些浏览器。

当前仓库只保留了 `chromium`，所以默认执行 `npx playwright test` 时只会跑 Chromium。

如果后续要增加或切换浏览器，只需要修改 `projects` 配置即可，例如添加 `firefox` 或 `webkit`。

## Test Layout

测试文件统一放在 [tests/](./tests) 下面，按 `应用名 / 环境 / 用途` 组织。

当前目录规划如下：

```text
tests/
  prepare/
    wallet.prepare.spec.ts
  chat/
    prod/
    test/
    shared/
  router/
    prod/
    test/
    shared/
  warehouse/
    prod/
    test/
    shared/
  node/
    prod/
    test/
    shared/
  support/
    app.ts
    env.ts
    wallet.ts
```

用途说明：

- `tests/prepare/`
  - 放环境准备相关用例。
  - 这里负责启动钱包扩展、检查 `window.ethereum`、导入专用测试钱包。
  - 这条链路是所有业务测试的前置准备。

- `tests/<app>/prod/`
  - 放某个应用在生产环境下才需要跑的用例。
  - 例如 `chat` 生产环境登录验证。

- `tests/<app>/test/`
  - 放某个应用在测试环境下才需要跑的用例。
  - 例如 `chat` 测试环境登录验证。

- `tests/<app>/shared/`
  - 放生产环境和测试环境都要跑的通用用例。
  - 例如登录后的对话、路由、列表、查询等共用功能。

- `tests/support/`
  - 放多个测试目录共享的辅助代码。
  - `app.ts` 负责应用 URL 和环境解析。
  - `env.ts` 负责读取本地环境变量。
  - `wallet.ts` 负责钱包扩展的启动、profile 复制和相关 fixture。

## Common Commands

```bash
npm run test:prepare
npm run test:chat
npm run test:router
npm run test:warehouse
npm run test:node
npx playwright test
```

## Local Environment

仓库使用本地 `.env.local` 读取测试账号信息，不提交到代码仓库。

模板文件是 [`.env.template`](./.env.template)。
