import * as prettier from './vendor/standalone.mjs';

const required = {
  html: ['html', 'postcss', 'babel', 'estree', 'typescript'],
  css: ['postcss'], scss: ['postcss'],
  babel: ['babel', 'estree'], typescript: ['typescript', 'estree'],
  json: ['babel', 'estree'], markdown: ['markdown', 'html', 'postcss', 'babel', 'estree', 'typescript', 'yaml'],
  yaml: ['yaml'],
};
const modules = new Map();
async function plugin(name) {
  if (!modules.has(name)) modules.set(name, import(`./vendor/plugins/${name}.mjs`).then(module => module.default || module));
  return modules.get(name);
}
self.onmessage = async ({ data }) => {
  const { id, code, parser, tabWidth, useTabs, printWidth } = data;
  try {
    if (!required[parser]) throw new Error('Diese Sprache wird nicht unterstützt.');
    const plugins = await Promise.all(required[parser].map(plugin));
    const output = await prettier.format(code, { parser: parser === 'json' ? 'json-stringify' : parser, plugins, tabWidth, useTabs, printWidth, endOfLine: 'lf' });
    self.postMessage({ id, output });
  } catch (error) {
    self.postMessage({ id, error: error.message || 'Der Code konnte nicht formatiert werden.' });
  }
};
