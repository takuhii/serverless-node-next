# serverless-node-next — TODO

Outstanding work for the fork. Completed items are kept briefly for context.

## Done

- [x] Baseline from upstream Serverless Framework v3.40.0.
- [x] Add AWS Lambda runtimes `nodejs22.x` and `nodejs24.x` (default runtime unchanged, `nodejs16.x`).
- [x] Rebrand to `serverless-node-next`; accurate README; MIT + upstream credit.
- [x] Remove upstream governance/tooling cruft; commit `package-lock.json`.
- [x] Publish prep: `publishConfig`, version `3.41.0`, `PUBLISHING.md`, `.github/workflows/publish-npm.yml`; verified via `npm pack` + install smoke test.
- [x] PR1 — telemetry disabled by default; runtime auto-update disabled.
- [x] Tier 3 (PR #7) — full decoupling from Serverless Inc. hosted services: no-op dashboard stub, `org`/`app` added to base schema, dashboard/platform imports removed from CLI rendering and interactive setup, login/logout/dashboard/output/param commands removed, `@serverless/dashboard-plugin` + `@serverless/platform-client` dropped (kept `@serverless/utils`). 127 unit tests pass.

## Published to npm

- [x] First release published: `serverless-node-next@3.41.0` is live on npm (`latest`), verified via a clean `npm install -g serverless-node-next` from the public registry (`serverless --version` → `Framework Core: 3.41.0`).
- [ ] (Optional, for automated future releases) Create an npm **Automation** token and add it as the GitHub repo secret `NPM_TOKEN`, so `.github/workflows/publish-npm.yml` can publish on GitHub Release / manual dispatch.
- [ ] For each future release: bump `version` in `package.json`, update `CHANGELOG.md`, then `npm publish --access public` (or publish a GitHub Release once `NPM_TOKEN` is set).

## Tier 2 — Cosmetic serverless.com string cleanup (optional, low priority)

Remaining display strings/links that still mention serverless.com. Purely cosmetic — no functional coupling. (`render-help/general.js` and `handle-error.js` were already cleaned up during Tier 3.)

- [ ] `lib/classes/cli.js` banner (`serverless.com, v<version>`).
- [ ] `lib/utils/log-deprecation.js` deprecation doc URLs (`https://www.serverless.com/framework/docs/deprecations/...`).
- [ ] `lib/classes/config-schema-handler/index.js` link to serverless.com plugins docs.
- [ ] Note: `scripts/pkg/config.js` still references `@serverless/dashboard-plugin` paths, but that's the standalone-binary packaging tooling (not shipped to npm, not on the runtime path). Only relevant if standalone-binary builds are ever revived.

## Housekeeping (optional)

- [ ] Review remaining `ci-*` workflows if/when CI is wired up for the fork.
- The GitHub fork relationship has been detached (repo is standalone). No action needed.
