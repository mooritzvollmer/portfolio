import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const { files } = JSON.parse(fs.readFileSync(path.join(root, 'site-files.json'), 'utf8'))
const allowed = new Set(files)
let errors = 0
let references = 0
const fail = (message) => { console.error(message); errors++ }
for (const name of files) {
  const file = path.resolve(root, name)
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) { fail(`Missing or invalid file: ${name}`); continue }
  if (/\.html$/.test(name)) {
    const html = fs.readFileSync(file, 'utf8')
    if (!/<title>[^<]+<\/title>/i.test(html)) fail(`Missing title: ${name}`)
    for (const match of html.matchAll(/<(?:script|link|img|source)\b[^>]*?\b(?:src|href)="([^"]+)"/g)) {
      const url = match[1]
      if (/^(?:https?:|data:|mailto:|#|\/\/)/.test(url)) continue
      references++
      const resource = path.posix.normalize(url.startsWith('/') ? url.slice(1) : path.posix.join(path.posix.dirname(name), url)).split(/[?#]/)[0]
      if (!allowed.has(resource)) fail(`Missing resource in ${name}: ${url}`)
    }
  }
  if (/\.css$/.test(name)) {
    const css = fs.readFileSync(file, 'utf8')
    for (const match of css.matchAll(/url\(\s*['"]?([^\s'"\)]+)['"]?\s*\)/g)) {
      const url = match[1]
      if (/^(?:https?:|data:|#|\/\/)/.test(url)) continue
      references++
      const resource = path.posix.normalize(url.startsWith('/') ? url.slice(1) : path.posix.join(path.posix.dirname(name), url)).split(/[?#]/)[0]
      if (!allowed.has(resource)) fail(`Missing CSS resource in ${name}: ${url}`)
    }
  }
  const built = path.join(root, 'dist', name)
  if (fs.existsSync(path.join(root, 'dist'))) {
    if (!fs.existsSync(built)) { fail(`Missing build file: ${name}`); continue }
    const hash = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
    if (hash(file) !== hash(built)) fail(`Build differs from editable file: ${name}`)
  }
}
if (errors) process.exitCode = 1
else console.log(`OK: ${files.length} files, ${references} resource references; build matches source files.`)
