import fs from 'node:fs'

const args = new Set(process.argv.slice(2))
const hasExplicitScope = args.has('--seo') || args.has('--a11y') || args.has('--perf')
const runA11y = args.has('--a11y') || !hasExplicitScope
const runSeo = args.has('--seo') || !hasExplicitScope
const runPerf = args.has('--perf') || !hasExplicitScope

const pages = [
  'index.html',
  'en/index.html',
  'en/easy/index.html',
  'leicht/index.html',
  'impressum/index.html',
  'datenschutz/index.html',
  'lebenslauf/index.html',
  'kundenstimmen/index.html',
  'projekte/index.html',
]

let hasError = false

const textContent = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const getAttr = (attrs, name) => {
  const match = attrs.match(new RegExp(`\\b${name}="([^"]*)"`, 'i'))
  return match ? match[1] : ''
}

const report = (file, message) => {
  hasError = true
  console.error(`${file}: ${message}`)
}

const checkA11y = (file, html) => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))]
  if (duplicateIds.length) report(file, `duplicate ids: ${duplicateIds.join(', ')}`)

  const ariaRefs = [...html.matchAll(/\b(?:aria-controls|aria-labelledby|aria-describedby)="([^"]+)"/g)]
    .flatMap((match) => match[1].trim().split(/\s+/))
    .filter(Boolean)
  const missingRefs = [...new Set(ariaRefs.filter((id) => !ids.includes(id)))]
  if (missingRefs.length) report(file, `missing ARIA references: ${missingRefs.join(', ')}`)

  if (!/<html\b[^>]*\blang="[^"]+"/i.test(html)) report(file, 'missing html lang')
  if ((html.match(/<main\b/gi) || []).length !== 1) report(file, 'expected exactly one main element')
  if ((html.match(/<h1\b/gi) || []).length < 1) report(file, 'missing h1')

  for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
    if (!/\balt="[^"]*"/i.test(match[1])) report(file, 'image without alt attribute')
  }

  for (const match of html.matchAll(/<(button|a)\b([^>]*)>([\s\S]*?)<\/\1>/gi)) {
    const [, tag, attrs, body] = match
    const hasName =
      /\baria-label="[^"]+"/i.test(attrs) ||
      /\baria-labelledby="[^"]+"/i.test(attrs) ||
      textContent(body).length > 0
    if (!hasName) report(file, `<${tag}> without accessible name`)
    if (tag.toLowerCase() === 'button' && !/\btype="/i.test(attrs)) report(file, 'button without explicit type')
    if (tag.toLowerCase() === 'a' && /\btarget="_blank"/i.test(attrs) && !/\brel="[^"]*noreferrer[^"]*"/i.test(attrs)) {
      report(file, 'target="_blank" link without rel="noreferrer"')
    }
  }

  for (const match of html.matchAll(/\btabindex="([^"]+)"/gi)) {
    const value = Number.parseInt(match[1], 10)
    if (value > 0) report(file, `positive tabindex found: ${match[1]}`)
  }
}

const checkSeo = (file, html) => {
  if (!/<title>[^<]+<\/title>/i.test(html)) report(file, 'missing title')
  const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)
  const isLegalPage = file === 'impressum/index.html' || file === 'datenschutz/index.html'
  if (!description && !isLegalPage) report(file, 'missing meta description')
  if (!/<link\s+rel="canonical"\s+href="https:\/\/moritzvollmer\.de\//i.test(html)) report(file, 'missing canonical URL')

  const jsonLdBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  if (!jsonLdBlocks.length && !isLegalPage) report(file, 'missing JSON-LD')
  for (const block of jsonLdBlocks) {
    try {
      JSON.parse(block[1])
    } catch (error) {
      report(file, `invalid JSON-LD: ${error.message}`)
    }
  }

  if (!isLegalPage && !/\bproperty="og:title"/i.test(html)) report(file, 'missing og:title')
  if (!isLegalPage && !/\bname="twitter:card"/i.test(html)) report(file, 'missing twitter card')

  for (const match of html.matchAll(/<a\b([^>]*)>/gi)) {
    const href = getAttr(match[1], 'href')
    if (href.includes('website.de')) report(file, `placeholder URL found: ${href}`)
  }
}

const checkPerf = (file, html) => {
  for (const match of html.matchAll(/<link\b([^>]*)>/gi)) {
    const attrs = match[1]
    const href = getAttr(attrs, 'href')
    const rel = getAttr(attrs, 'rel')
    if (rel === 'stylesheet' && /^https?:\/\//i.test(href)) report(file, `external render-blocking stylesheet: ${href}`)
    if (/font-awesome|cdnjs/i.test(href)) report(file, `unused CDN/font dependency found: ${href}`)
  }

  for (const match of html.matchAll(/<script\b([^>]*)>/gi)) {
    const src = getAttr(match[1], 'src')
    if (/^https?:\/\//i.test(src)) report(file, `external script found: ${src}`)
  }
}

const checkProjectPerf = () => {
  const typography = fs.readFileSync('src/scss/typography.scss', 'utf8')
  const localFontFaces = [...typography.matchAll(/@font-face\s*{([\s\S]*?)}/g)].filter((match) => /url\(/.test(match[1]))
  for (const fontFace of localFontFaces) {
    if (!/font-display:\s*swap/i.test(fontFace[1])) report('src/scss/typography.scss', 'local @font-face without font-display: swap')
  }

  const distAssetsPath = 'dist/assets'
  if (!fs.existsSync(distAssetsPath)) return

  const assets = fs.readdirSync(distAssetsPath)
  const jsSize = assets
    .filter((asset) => asset.endsWith('.js'))
    .reduce((size, asset) => size + fs.statSync(`${distAssetsPath}/${asset}`).size, 0)
  const cssSize = assets
    .filter((asset) => asset.endsWith('.css'))
    .reduce((size, asset) => size + fs.statSync(`${distAssetsPath}/${asset}`).size, 0)

  if (jsSize > 32 * 1024) report('dist/assets', `JavaScript budget exceeded: ${Math.round(jsSize / 1024)} KiB`)
  if (cssSize > 72 * 1024) report('dist/assets', `CSS budget exceeded: ${Math.round(cssSize / 1024)} KiB`)
}

for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8')
  if (runA11y) checkA11y(file, html)
  if (runSeo) checkSeo(file, html)
  if (runPerf) checkPerf(file, html)
}

if (runPerf) checkProjectPerf()

if (hasError) {
  process.exit(1)
}

const labels = [
  runA11y ? 'A11y' : '',
  runSeo ? 'SEO' : '',
  runPerf ? 'Performance' : '',
].filter(Boolean)

console.log(`${labels.join(' + ')} checks passed`)
