#!/usr/bin/env node
/**
 * Builds the publishable `serverless-node-next` bundle in packages/framework-dist.
 *
 * Pipeline (mirrors the CI release job):
 *   1. Minify the dev-mode shim         (packages/serverless/lib/plugins/aws/dev)
 *   2. Bundle sf-core with esbuild       (packages/sf-core -> framework-dist/dist/sf-core.js)
 *   3. Copy runtime assets               (packages/sf-core/scripts/prepareDistributionTarballs.js)
 *   4. Copy README + LICENSE into        (packages/framework-dist)
 *
 * Run from the repo root:  node scripts/build-dist.mjs
 */
import { execFileSync } from 'node:child_process'
import { cpSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const run = (cmd, args, cwd) => {
  console.log(`\n> ${cmd} ${args.join(' ')}  (cwd: ${path.relative(root, cwd) || '.'})`)
  execFileSync(cmd, args, { cwd, stdio: 'inherit' })
}

const esbuildBin = path.join(root, 'node_modules', '.bin', 'esbuild')
if (!existsSync(esbuildBin)) {
  console.error('esbuild not found in node_modules/.bin. Run `npm install` at the repo root first.')
  process.exit(1)
}

// 1. Minify the dev-mode shim
const devDir = path.join(root, 'packages/serverless/lib/plugins/aws/dev')
run(esbuildBin, ['./shim.js', '--bundle', '--platform=node', '--minify', '--outfile=./shim.min.js'], devDir)

// 2. Bundle sf-core
run('npm', ['run', 'build'], path.join(root, 'packages/sf-core'))

// 3. Copy runtime assets into framework-dist
run('node', ['./prepareDistributionTarballs.js'], path.join(root, 'packages/sf-core/scripts'))

// 4. Copy README + LICENSE into the publishable package
const dist = path.join(root, 'packages/framework-dist')
cpSync(path.join(root, 'README.md'), path.join(dist, 'README.md'))
cpSync(path.join(root, 'LICENSE'), path.join(dist, 'LICENSE'))
console.log('\nCopied README.md and LICENSE into packages/framework-dist')

console.log('\n✓ Build complete. Publishable package is in packages/framework-dist')
