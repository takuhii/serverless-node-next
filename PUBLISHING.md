# Publishing `serverless-node-next` to npm

This package is published to npm as **`serverless-node-next`** — a single-package
fork of the Serverless Framework v3. Users install it with:

```bash
npm install -g serverless-node-next
# provides the `serverless` and `sls` commands
serverless --version
```

## What gets published

- The package uses a `.npmignore` denylist. The published tarball contains
  `bin/`, `lib/`, `commands/`, `docs/`, `README.md`, `LICENSE.txt`, `CHANGELOG.md`,
  and `package.json`.
- Excluded: `test/`, `.github/`, `scripts/pkg`, `scripts/test`, `docker-compose.yml`,
  `Dockerfile`, and dev config.
- `publishConfig.access` is `public`, so it publishes as a public package.

Inspect exactly what will ship without publishing:

```bash
npm pack --dry-run
```

(Currently ~0.7 MB packed, ~3.2 MB unpacked, ~790 files.)

## Versioning

The version tracks the upstream v3 baseline it derives from, with the patch/minor
bumped for fork changes. The current version is `3.41.0` (baseline `3.40.0` plus
the added Node.js runtimes). Bump `version` in `package.json` before each release
and record changes in `CHANGELOG.md`.

## Publishing manually (local)

1. Authenticate to npm (one time per machine). You need publish rights to the
   `serverless-node-next` package:

   ```bash
   npm login
   npm whoami   # confirm you are authenticated
   ```

2. Verify the build and contents:

   ```bash
   npm pack --dry-run
   ```

3. Publish:

   ```bash
   npm publish --access public
   ```

   `publishConfig.access: public` is already set, so `--access public` is belt-and-braces.

## Publishing via GitHub Actions (recommended)

The workflow `.github/workflows/publish-npm.yml` publishes automatically when a
GitHub Release is published, or on manual dispatch (with a `dry_run` option).

### Required secret: `NPM_TOKEN`

1. Create an npm **Automation** token (or a Granular Access token with publish
   permission for `serverless-node-next`) at <https://www.npmjs.com/settings/~/tokens>.
2. In GitHub: **Settings > Secrets and variables > Actions > New repository secret**.
   - Name: `NPM_TOKEN`
   - Value: the token from step 1.

To cut a release: bump `version` in `package.json`, commit, tag/publish a GitHub
Release, and the workflow publishes to npm.

## Notes

- The `postinstall` script only prints a friendly message and respects `CI`,
  `SILENT`, and `ADBLOCK` environment variables. It does not perform network calls.
- `serverless create` fetches templates remotely (v3 behavior), so no templates
  are bundled in the package — this is expected.
