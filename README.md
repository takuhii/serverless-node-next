# serverless-node-next

**A community-maintained fork of the Serverless Framework v3, extended with support for newer AWS Lambda Node.js runtimes.**

This project keeps the Serverless Framework on its **v3** line while adding the AWS Lambda Node.js runtimes that were introduced after v3 stopped being actively developed. It exists for teams who want to keep deploying to current Node.js runtimes without migrating to Serverless Framework v4.

It tracks upstream `serverless@3.40.0` as its baseline and changes as little as possible on top of it.

- **Baseline:** Serverless Framework v3.40.0
- **License:** MIT (see [Credits](#credits))
- **Not affiliated with or endorsed by Serverless, Inc.**

## Contents

- [What this fork changes](#what-this-fork-changes)
- [Node.js runtime support](#nodejs-runtime-support)
- [Installation](#installation)
- [Usage](#usage)
- [Documentation](#documentation)
- [Versioning](#versioning)
- [Contributing](#contributing)
- [Credits](#credits)
- [License](#license)

## What this fork changes

Compared to the pristine v3.40.0 baseline, this fork:

- **Adds newer AWS Lambda Node.js runtimes** to the configuration schema (see below).
- **Rebrands** the package to `serverless-node-next` with its own repository and maintainer.
- **Removes upstream-only governance and release tooling** (Serverless Inc. contributor process, commit linting, release pipelines) that is not relevant to an independent fork.

Everything else — the CLI commands (`serverless` / `sls`), the `serverless.yml` schema, plugins, and provider behavior — is unchanged from v3. If you know Serverless Framework v3, you already know how to use this.

## Node.js runtime support

This fork adds the following AWS Lambda runtimes to the v3 configuration schema:

- `nodejs22.x`
- `nodejs24.x`

These are in addition to the runtimes upstream v3 already supported (up to `nodejs20.x`). You select them the usual way in `serverless.yml`:

```yaml
provider:
  name: aws
  runtime: nodejs22.x
```

or per function:

```yaml
functions:
  hello:
    handler: handler.hello
    runtime: nodejs24.x
```

The **default runtime is unchanged** (`nodejs16.x`), so existing services behave exactly as they did on v3 unless you opt in to a newer runtime. `serverless invoke local` already works with these runtimes, since it detects any `nodejs*` runtime generically.

## Installation

This fork is not published to npm under the `serverless` name. Install it directly from this repository.

Global install from GitHub:

```bash
npm install -g takuhii/serverless-node-next
```

Or clone and link for local development:

```bash
git clone https://github.com/takuhii/serverless-node-next.git
cd serverless-node-next
npm install
npm link   # exposes the `serverless` and `sls` commands globally
```

Requires Node.js `>=12` (matching the v3 baseline). Both the `serverless` and `sls` commands are available.

## Usage

Usage is identical to Serverless Framework v3.

Create a new service:

```bash
serverless
```

Deploy the whole service:

```bash
sls deploy
```

Deploy a single function quickly (skips a full CloudFormation update):

```bash
sls deploy function -f my-api
```

Invoke a deployed function, or run one locally:

```bash
sls invoke -f hello --log
sls invoke local -f hello --data '{"a":"bar"}'
```

Stream logs, or remove the service and all its AWS resources:

```bash
sls logs -f hello -t
sls remove
```

## Documentation

Because this fork tracks v3 closely, the upstream **Serverless Framework v3 documentation** applies to nearly everything here:

- Core concepts: https://www.serverless.com/framework/docs/providers/aws/guide/intro
- `serverless.yml` reference: https://www.serverless.com/framework/docs/providers/aws/guide/serverless.yml
- Events that trigger Lambda: https://www.serverless.com/framework/docs/providers/aws/guide/events

The only intentional behavioral difference from upstream v3 is the added Node.js runtimes described above.

## Versioning

The version tracks the upstream v3 baseline it derives from (currently `3.40.0`). Fork-specific changes are recorded in the git history and `CHANGELOG.md`.

## Contributing

Contributions are welcome via issues and pull requests on this repository:

- Issues: https://github.com/takuhii/serverless-node-next/issues
- Pull requests: https://github.com/takuhii/serverless-node-next/pulls

Please keep changes aligned with the goal of the project: stay close to Serverless Framework v3 and focus on keeping it working with current runtimes and dependencies rather than adding large new features.

## Credits

This project is a derivative of the [Serverless Framework](https://github.com/serverless/serverless) by Serverless, Inc., used under the MIT License. It is an independent community fork and is **not affiliated with, sponsored by, or endorsed by Serverless, Inc.** All trademarks are the property of their respective owners.

## License

Licensed under the [MIT License](./LICENSE.txt).

Files in `node_modules` and other external directories are maintained by their respective authors and carry their own licenses, which may differ from this project's.
