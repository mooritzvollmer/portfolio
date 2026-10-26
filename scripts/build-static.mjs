import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const output = path.join(root, 'dist')
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'site-files.json'), 'utf8'))
const files = manifest.files.map((name) => {
  const source = path.resolve(root, name)
  if (!source.startsWith(root + path.sep) || name.includes('..') || path.isAbsolute(name)) {
    throw new Error(`Invalid site path: ${name}`)
  }
  if (!fs.statSync(source).isFile()) throw new Error(`Missing site file: ${name}`)
  return { name, source }
})
if (path.dirname(output) !== root || path.basename(output) !== 'dist') throw new Error('Unsafe build destination')
fs.rmSync(output, { recursive: true, force: true })
for (const { name, source } of files) {
  const destination = path.join(output, name)
  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.copyFileSync(source, destination)
}
console.log(`Built ${files.length} files from the recovered live version into dist/.`)
