# Publishing `serverless-node-next` to npm

This repo publishes a single, self-contained CLI package to npm:
**`serverless-node-next`**. It is the bundled output of the framework
(with Node.js 20.x/22.x/24.x runtime support and `nodejs22.x` as the default
Lambda runtime), assembled in `packages/framework-dist`.

Users install it with:

```bash
npm install -g serverless-node-next
# provides the `serverless` and `sls` commands
serverless --version
```

## What actually gets published

- Only `packages/framework-dist` is publishable (`name: serverless-node-next`).
- Every other workspace (`@serverless/framework`, `@serverlessinc/sf-core`,
  `@serverless/engine`, `@serverless/util`, `@serverless/mcp`,
  `@serverlessinc/sf-core-installer`, `@serverlessinc/standards`, and the repo
  root) is marked `"private": true` and will never be published.
- The published tarball contains the esbuild bundle (`dist/sf-core.js`), its
  native addons (`*.node`), runtime assets under `lib/`, the `docs/` used by the
  MCP docs tool, plus `README.md` and `LICENSE`. The sourcemap is intentionally
  excluded to keep the package small (~5 MB packed).

## Building the publishable bundle

The bundle is produced by a single root script:

```bash
npm install          # reconcile the workspace (npm ci may fail if the lockfile drifts)
npm run build:dist   # scripts/build-dist.mjs
```

`build:dist` runs, in order:

1. Minify the dev-mode shim (`packages/serverless/lib/plugins/aws/dev`).
2. Bundle `sf-core` with esbuild → `packages/framework-dist/dist/sf-core.js`.
3. Copy runtime assets via `packages/sf-core/scripts/prepareDistributionTarballs.js`
   (this also stamps `framework-dist`'s version from `sf-core`'s version).
4. Copy `README.md` and `LICENSE` into `packages/framework-dist`.

Verify the result:

```bash
node packages/framework-dist/dist/sf-core.js --version
# -> Serverless ϟ Framework <version>
```

## Versioning

The published version is taken from `packages/sf-core/package.json` (step 3
above overwrites `framework-dist`'s `version` to match). To cut a new release,
bump the version in `packages/sf-core/package.json` (and keep
`packages/sf-core-installer/package.json` in sync if you use it), then rebuild.

## Publishing manually (local)

1. Log in to npm once on your machine (you need publish rights to the
   `serverless-node-next` package):

   ```bash
   npm login
   npm whoami   # confirm you are authenticated
   ```

2. Build and inspect the tarball before publishing:

   ```bash
   npm run build:dist
   cd packages/framework-dist
   npm pack --dry-run    # review the file list and size
   ```

3. Publish:

   ```bash
   # still in packages/framework-dist
   npm publish --access public
   ```

   The package's `prepack` script copies `README.md`/`LICENSE` in automatically,
   so publish from `packages/framework-dist` after running `build:dist`.

## Publishing via GitHub Actions (recommended)

The workflow `.github/workflows/publish-npm.yml` builds and publishes
automatically.

Triggers:

- **On GitHub Release** — publishing a Release runs the workflow and publishes
  to npm.
- **Manual** — run the "Publish: serverless-node-next to npm" workflow via
  *Actions > Run workflow*. It has a `dry_run` checkbox to validate without
  publishing.

The workflow builds with `npm run build:dist`, verifies `--version`, then runs
`npm publish --provenance --access public` from `packages/framework-dist`.

### Required secret: `NPM_TOKEN`

The workflow authenticates with an npm token stored as a repository secret.

1. Create an npm **Automation** token (or a Granular Access token with
   publish permission for `serverless-node-next`) at
   <https://www.npmjs.com/settings/~/tokens>.
2. In GitHub: **Settings > Secrets and variables > Actions > New repository
   secret**.
   - Name: `NPM_TOKEN`
   - Value: the token from step 1.

`provenance` is enabled (the workflow grants `id-token: write`), which requires
the package `repository.url` to match this GitHub repo — it does
(`takuhii/serverless-node-next`).

## Notes / gotchas

- `npm ci` can fail if the lockfile drifts after a rename or version bump; run
  `npm install` to reconcile, then commit the updated `package-lock.json`.
- `engine-strict` may be set in your local `~/.npmrc`; the package declares
  `engines.node >= 18`, so installs on older Node will be rejected.
- The bundle is platform-agnostic JS plus prebuilt native `.node` addons that
  esbuild pulled in; publishing from CI (Linux) is fine because those addons
  are loaded at runtime by the user's Node, not compiled per-platform here.
