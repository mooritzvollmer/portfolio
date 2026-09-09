import { spawnSync } from 'node:child_process'
import fs from 'node:fs'

const target = process.env.DEPLOY_TARGET
const isDryRun = process.env.DEPLOY_DRY_RUN === '1'
const source = 'dist/'

if (!fs.existsSync('dist/index.html')) {
  console.error('Missing dist/index.html. Run npm run build before deploying.')
  process.exit(1)
}

if (!fs.existsSync('dist/.htaccess')) {
  console.error('Missing dist/.htaccess. The deploy would miss server caching rules.')
  process.exit(1)
}

if (!target) {
  console.error(
    [
      'Missing DEPLOY_TARGET.',
      '',
      'Use:',
      '  DEPLOY_TARGET="user@example.com:/absolute/path/to/webroot/" npm run deploy',
      '',
      'Dry run:',
      '  DEPLOY_TARGET="user@example.com:/absolute/path/to/webroot/" npm run deploy:dry',
    ].join('\n')
  )
  process.exit(1)
}

if (!target.endsWith('/')) {
  console.error('DEPLOY_TARGET must end with "/" so rsync syncs into the target directory.')
  process.exit(1)
}

const args = [
  '-az',
  '--delete',
  '--human-readable',
  '--itemize-changes',
  ...(isDryRun ? ['--dry-run'] : []),
  source,
  target,
]

console.log(`${isDryRun ? 'Dry-running' : 'Deploying'} ${source} to ${target}`)

const result = spawnSync('rsync', args, {
  stdio: 'inherit',
})

if (result.error) {
  console.error(result.error.message)
  process.exit(1)
}

process.exit(result.status ?? 1)
