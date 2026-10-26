import fs from 'node:fs'
import path from 'node:path'
import http from 'node:http'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const directory = process.argv.includes('--dist') ? path.join(root, 'dist') : root
const { files } = JSON.parse(fs.readFileSync(path.join(root, 'site-files.json'), 'utf8'))
const allowed = new Set(files.filter((name) => !name.startsWith('.')))
const portArgument = process.argv.indexOf('--port')
const port = portArgument >= 0 ? Number(process.argv[portArgument + 1]) : 5173
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid port')
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json', '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.vcf': 'text/vcard; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
}
const server = http.createServer((request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405, { Allow: 'GET, HEAD' }); response.end(); return }
  let pathname
  try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname) }
  catch { response.writeHead(400); response.end(); return }
  if (/^\/(?:lebenslauf|kundenstimmen)\/?$/.test(pathname)) {
    response.writeHead(302, { Location: '/' }); response.end(); return
  }
  const name = pathname.slice(1) + (pathname.endsWith('/') ? 'index.html' : '')
  if (!allowed.has(name)) {
    if (allowed.has(name + '/index.html')) {
      response.writeHead(302, { Location: pathname + '/' }); response.end(); return
    }
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
    response.end(request.method === 'HEAD' ? undefined : fs.readFileSync(path.join(directory, '404.html')))
    return
  }
  const file = path.join(directory, name)
  if (!fs.existsSync(file)) { response.writeHead(404); response.end(); return }
  response.writeHead(200, { 'Content-Type': types[path.extname(name)] || 'application/octet-stream', 'Cache-Control': 'no-store' })
  if (request.method === 'HEAD') response.end()
  else fs.createReadStream(file).pipe(response)
})
server.listen(port, '127.0.0.1', () => console.log(`Portfolio: http://127.0.0.1:${port}/ (${directory})`))
