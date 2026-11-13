const $ = selector => document.querySelector(selector);
const input = $('#input'), output = $('#output');
const limit = 500 * 1024;
const extensions = { html: 'html', css: 'css', scss: 'scss', babel: 'js', typescript: 'ts', json: 'json', markdown: 'md', yaml: 'yaml' };
let worker, timer, request = 0, busy = false, lastFile = '';

function status(message, error = false) {
  $('#status').textContent = message;
  $('#status').classList.toggle('error', error);
}
function lines(field) {
  const count = field.value.split('\n').length;
  $(`#${field.id}-lines`).textContent = Array.from({ length: Math.min(count, 15000) }, (_, i) => i + 1).join('\n');
  $(`#${field.id}-lines`).scrollTop = field.scrollTop;
}
function finish() {
  clearTimeout(timer);
  busy = false;
  $('#format').disabled = false;
  $('#format').setAttribute('aria-busy', 'false');
}
function resetResult(message = 'Eingabe geändert. Bitte erneut formatieren.') {
  request++;
  if (busy) { worker?.terminate(); worker = null; finish(); }
  output.value = '';
  lines(input); lines(output);
  $('#copy').disabled = $('#download').disabled = true;
  $('#output-info').textContent = 'Zeilennummern werden nicht mitkopiert.';
  status(message);
}
function createWorker() {
  worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
  worker.onmessage = ({ data }) => {
    if (data.id !== request) return;
    finish();
    if (data.error) { status(data.error, true); return; }
    output.value = data.output;
    lines(output);
    $('#copy').disabled = $('#download').disabled = !output.value;
    $('#output-info').textContent = `${data.output.trimEnd().split('\n').length} Zeilen · ${data.output.length.toLocaleString('de-DE')} Zeichen`;
    status('Formatiert. Dein Original bleibt links erhalten.');
  };
  worker.onerror = event => {
    event.preventDefault();
    worker.terminate(); worker = null; finish();
    status('Die Formatierung konnte nicht geladen werden. Bitte prüfe Deine Verbindung und versuche es erneut.', true);
  };
}
function format() {
  if (busy) return;
  resetResult();
  if (!input.value.trim()) { status('Bitte füge zuerst Code ein.'); input.focus(); return; }
  if (new Blob([input.value]).size > limit || input.value.split('\n').length > 15000) {
    status('Bitte verwende höchstens 500 KB und 15.000 Zeilen pro Durchlauf.', true); return;
  }
  try {
    if (!worker) createWorker();
    busy = true; $('#format').disabled = true; $('#format').setAttribute('aria-busy', 'true');
    status('Code wird formatiert …');
    const useTabs = $('#indent').value === 'tab', tabWidth = useTabs ? 2 : Number($('#indent').value);
    [input, output].forEach(field => field.style.tabSize = tabWidth);
    worker.postMessage({ id: request, code: input.value, parser: $('#language').value, tabWidth, useTabs, printWidth: Number($('#width').value) });
    timer = setTimeout(() => {
      worker.terminate(); worker = null; finish();
      status('Der Durchlauf hat zu lange gedauert. Bitte versuche einen kleineren Ausschnitt.', true);
    }, 20000);
  } catch {
    worker?.terminate(); worker = null; finish();
    status('Bitte öffne das Tool über eine Webadresse oder den lokalen Entwicklungsserver.', true);
  }
}
$('#controls').addEventListener('submit', event => { event.preventDefault(); format(); });
input.addEventListener('input', () => resetResult());
for (const field of [input, output]) field.addEventListener('scroll', () => $(`#${field.id}-lines`).scrollTop = field.scrollTop, { passive: true });
for (const select of document.querySelectorAll('select')) select.addEventListener('change', () => resetResult());
document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); format(); }
});
$('#clear').addEventListener('click', () => {
  input.value = ''; lastFile = ''; resetResult('Bereit für Deinen Code.'); input.focus();
});
$('#open-file').addEventListener('click', () => $('#file').click());
$('#file').addEventListener('change', async event => {
  const file = event.target.files[0];
  if (!file) return;
  const version = request;
  try {
    if (file.size > limit) throw new Error('Die Datei ist größer als 500 KB. Bitte wähle eine kleinere Datei.');
    const source = await file.text();
    if (version !== request) return;
    input.value = source; lastFile = file.name;
    const ext = file.name.split('.').pop().toLowerCase();
    const parser = { html:'html',htm:'html',css:'css',scss:'scss',js:'babel',mjs:'babel',cjs:'babel',jsx:'babel',ts:'typescript',tsx:'typescript',json:'json',md:'markdown',markdown:'markdown',yml:'yaml',yaml:'yaml' }[ext];
    if (parser) $('#language').value = parser;
    resetResult(parser ? 'Datei lokal geöffnet. Bereit zum Formatieren.' : 'Datei lokal geöffnet. Bitte wähle die passende Sprache.');
  } catch (error) { status(error.message || 'Die Datei konnte nicht gelesen werden.', true); }
  finally { event.target.value = ''; }
});
$('#copy').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(output.value); status('Formatierter Code kopiert.'); }
  catch { output.focus(); output.select(); status('Bitte kopiere den markierten Code mit Ctrl+C oder Cmd+C.'); }
});
$('#download').addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob([output.value], { type: 'text/plain;charset=utf-8' }));
  const anchor = document.createElement('a'); anchor.href = url;
  const stem = lastFile ? lastFile.replace(/\.[^.]+$/, '').replace(/[^\p{L}\p{N}._-]/gu, '-') : 'code';
  anchor.download = `${stem}-formatiert.${extensions[$('#language').value]}`;
  anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  status('Formatierte Datei zum Speichern bereitgestellt.');
});
input.value = '<section class="beispiel"><h2>Ein klarer Anfang</h2><ul><li>Struktur</li><li>Lesbarkeit</li></ul></section>';
lines(input); lines(output);
status('Ein HTML-Beispiel ist eingefügt. Ersetze es durch Deinen Code oder wähle „Formatieren“.');
