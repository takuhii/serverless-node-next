# serverless-node-next — TODO

Outstanding work for the fork. Completed items are kept briefly for context.

## Done

- [x] Baseline from upstream Serverless Framework v3.40.0.
- [x] Add AWS Lambda runtimes `nodejs22.x` and `nodejs24.x` (default runtime unchanged, `nodejs16.x`).
- [x] Rebrand to `serverless-node-next`; accurate README; MIT + upstream credit.
- [x] Remove upstream governance/tooling cruft; commit `package-lock.json`.
- [x] Publish prep: `publishConfig`, version `3.41.0`, `PUBLISHING.md`, `.github/workflows/publish-npm.yml`; verified via `npm pack` + install smoke test.
- [x] PR1 — telemetry disabled by default; runtime auto-update disabled.

## To publish to npm (blocked on account access — user action)

- [ ] `npm login` locally (needed for a manual `npm publish`).
- [ ] Create an npm **Automation** token and add it as the GitHub repo secret `NPM_TOKEN` (for the publish workflow).
- [ ] Cut the first release: confirm `version`, then either `npm publish --access public` or publish a GitHub Release to trigger the workflow.

## Tier 3 — Full decoupling from Serverless Inc. hosted services

Larger, entangled change; should be its own PR. Must be done as one coordinated set of edits.

> Caveat: this permanently removes the `login`, `logout`, `dashboard`, `output`, and `param` commands and the `${param:...}` / `${output:...}` variable sources. Confirm these aren't relied upon before starting.

- [ ] Stub `resolveEnterprisePlugin()` in `lib/classes/plugin-manager.js` to return a no-op plugin instead of `require('@serverless/dashboard-plugin')`, so `loadAllPlugins()` doesn't throw.
- [ ] Add `org` and `app` (optional strings) to the base schema in `lib/config-schema.js` — the schema is closed (`additionalProperties: false`), so existing `serverless.yml` files using `org`/`app` will fail validation otherwise. **Critical gotcha.**
- [ ] Remove the `dashboardLogin` / `dashboardSetOrg` steps from `lib/cli/interactive-setup/index.js`, and strip `@serverless/dashboard-plugin` imports from the shared interactive-setup files (`utils.js`, `aws-credentials.js`, `deploy.js`), removing the org/app-gated branches.
- [ ] Remove dashboard-plugin imports from `lib/cli/render-version.js` and `lib/cli/handle-error.js`.
- [ ] Remove login/logout/console + dashboard/output/param commands: `commands/login.js`, `commands/logout.js`, `lib/commands/login/`, and their declarations in `lib/cli/commands-schema/no-service.js`.
- [ ] Drop `@serverless/dashboard-plugin`, `@serverless/platform-client`, and (if fully unused) `@serverless/utils` from `package.json`; regenerate the lockfile.
- [ ] Verify: `npm test`; smoke-test `--help`, `--version`, `serverless package` on a minimal AWS service, and a `serverless.yml` containing `org`/`app` (must still validate). Re-run `npm pack --dry-run` + install test.

## Tier 2 — Cosmetic serverless.com string cleanup (optional, low priority)

- [ ] Replace serverless.com display strings/links: `lib/classes/cli.js` banner, `lib/cli/render-help/general.js`, `lib/utils/log-deprecation.js` deprecation URLs, `lib/cli/handle-error.js` docs/forum links. (Two of these also import the dashboard plugin — coordinate with Tier 3.)

## Housekeeping (optional)

- [ ] Review remaining `ci-*` workflows if/when CI is wired up for the fork.
- [ ] The closed PR refs (#1–#6) on GitHub are historical and cannot be removed manually — no action needed.
