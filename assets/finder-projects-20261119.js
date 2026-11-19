const projects = [
  {
    "id": "har-lupe",
    "name": "HAR-Lupe",
    "category": "code",
    "description": "HAR-Aufnahmen als Wasserfall untersuchen, Requests filtern und gemessene Zeiten und Größen vergleichen.",
    "url": "https://har-lupe.moritzvollmer.de/",
    "kind": "Netzwerkanalyse"
  },
  {
    "id": "bildschnitt",
    "name": "Bildschnitt",
    "category": "web",
    "description": "Bilder zuschneiden, den Fokus setzen und passende Formate exportieren.",
    "url": "https://bildschnitt.moritzvollmer.de/",
    "kind": "Bildwerkzeug"
  },
  {
    "id": "meta-diff",
    "name": "Meta-Diff",
    "category": "seo",
    "description": "Zwei HTML-Stände auf Unterschiede in Metadaten, Überschriften und JSON-LD prüfen.",
    "url": "https://meta-diff.moritzvollmer.de/",
    "kind": "HTML-Vergleich"
  },
  {
    "id": "relaunch-lotse",
    "name": "Relaunch-Lotse",
    "category": "seo",
    "description": "URL-Zuordnungen auf fehlende Ziele, Konflikte, Ketten und Schleifen prüfen.",
    "url": "https://relaunch-lotse.moritzvollmer.de/",
    "kind": "URL-Prüfung"
  },
  {
    "id": "schema-werkbank",
    "name": "Schema-Werkbank",
    "category": "seo",
    "description": "JSON-LD für Artikel, Personen und Veranstaltungen erstellen und exportieren.",
    "url": "https://schema-werkbank.moritzvollmer.de/",
    "kind": "Strukturierte Daten"
  },
  {
    "id": "csv-klar",
    "name": "CSV-Klar",
    "category": "seo",
    "description": "Zwei CSV-Dateien über einen Schlüssel vergleichen und Änderungen sichtbar machen.",
    "url": "https://csv-klar.moritzvollmer.de/",
    "kind": "Tabellenvergleich"
  },
  {
    "id": "terminchen",
    "name": "Terminchen",
    "category": "explore",
    "description": "Einen Termin mit Ort, Uhrzeit und Erinnerung als ICS-Datei mitnehmen.",
    "url": "https://terminchen.moritzvollmer.de/",
    "kind": "Kalenderdatei"
  },
  {
    "id": "checkliste",
    "name": "Checkliste",
    "category": "web",
    "description": "Eine Website anhand strukturierter WCAG-2.2-Prüfpunkte durcharbeiten.",
    "url": "https://checkliste.moritzvollmer.de/",
    "kind": "Barrierefreiheit"
  },
  {
    "id": "farbtool",
    "name": "Farbtool",
    "category": "web",
    "description": "Vordergrund und Hintergrund vergleichen und ihr Kontrastverhältnis berechnen.",
    "url": "https://farbtool.moritzvollmer.de/",
    "kind": "Kontrastprüfung"
  },
  {
    "id": "farbseh-simulator",
    "name": "Farbseh-Simulator",
    "category": "web",
    "description": "Eigene Bilder mit verschiedenen simulierten Farbsehschwächen vergleichen.",
    "url": "https://farbfehlsichtigkeit.moritzvollmer.de/",
    "kind": "Farbwahrnehmung"
  },
  {
    "id": "svg",
    "name": "SVG-Werkzeug",
    "category": "web",
    "description": "SVG-Code für die Verwendung als Data-URI und CSS-Hintergrund aufbereiten.",
    "url": "https://svg.moritzvollmer.de/",
    "kind": "Frontend"
  },
  {
    "id": "streamfinder",
    "name": "Streamfinder",
    "category": "explore",
    "description": "Filme und Serien suchen und ihre Streaming-Verfügbarkeit entdecken.",
    "url": "https://streamfinder.moritzvollmer.de/",
    "kind": "Filme & Serien"
  },
  {
    "id": "voyager",
    "name": "Voyager",
    "category": "explore",
    "description": "Berechnete Entfernung, Signallaufzeit und Missionsdauer von Voyager 1 entdecken.",
    "url": "https://voyager.moritzvollmer.de/",
    "kind": "Weltraum"
  },
  {
    "id": "barrierefreiheit",
    "name": "Barrierefreiheit",
    "category": "web",
    "description": "Grundlagen digitaler Barrierefreiheit und praktische Orientierung für Websites.",
    "url": "https://barrierefreiheit.moritzvollmer.de/",
    "kind": "Wissen"
  },
  {
    "id": "bash-scripts",
    "name": "Bash Scripts",
    "category": "code",
    "description": "29 Bash-Dateien durchsuchen, Funktionen nachlesen und Quellcode kopieren oder herunterladen.",
    "url": "https://bash.moritzvollmer.de/",
    "kind": "Terminal-Werkzeuge"
  },
  {
    "id": "app",
    "name": "Projektindex",
    "category": "personal",
    "description": "Diese Übersicht bündelt meine aktiven Projekte mit Vorschauen, Suche und Themenfiltern.",
    "url": "https://app.moritzvollmer.de/",
    "kind": "Projektübersicht"
  }
];
const english = document.documentElement.lang.startsWith('en');
const descriptions = {
  'har-lupe': 'Inspect HAR recordings as a waterfall, filter requests and compare recorded timings and sizes.',
  'bildschnitt': 'Crop images, set the focal point and export the formats you need.',
  'meta-diff': 'Compare two HTML versions for changes in metadata, headings and JSON-LD.',
  'relaunch-lotse': 'Check URL mappings for missing destinations, conflicts, chains and loops.',
  'schema-werkbank': 'Create and export JSON-LD for articles, people and events.',
  'csv-klar': 'Compare two CSV files using a shared key and identify changes.',
  'terminchen': 'Create an ICS calendar file with a time, location and reminder.',
  'checkliste': 'Review a website using structured WCAG 2.2 checkpoints.',
  'farbtool': 'Compare foreground and background colours and calculate their contrast ratio.',
  'farbseh-simulator': 'Compare images with simulations of different colour vision deficiencies.',
  'svg': 'Prepare SVG code for use as a Data URI or a CSS background.',
  'streamfinder': 'Search for films and series and find their streaming availability.',
  'voyager': 'Explore estimated distance, signal travel time and mission duration for Voyager 1.',
  'barrierefreiheit': 'Learn digital accessibility basics and practical guidance for websites.',
  'bash-scripts': 'Browse 29 Bash files, read function descriptions and copy or download source code.',
  'app': 'Browse my active web projects with previews, search and topic filters.'
};
const finder = document.querySelector('[data-nav-panel="work"]');
const search = finder.querySelector('[data-project-search]');
const folders = [...finder.querySelectorAll('[data-project-id]')];
const categories = [...finder.querySelectorAll('[data-project-category]')];
const inspector = finder.querySelector('[data-project-inspector]');
const normalize = value => value.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
let category = 'all';
function selectProject(button) {
  const project = projects.find(project => project.id === button.dataset.projectId);
  folders.forEach(folder => {
    folder.setAttribute('aria-pressed', String(folder === button));
    if (folder === button) folder.setAttribute('aria-describedby', 'project-description');
    else folder.removeAttribute('aria-describedby');
  });
  finder.querySelector('[data-project-name]').textContent = project.name;
  finder.querySelector('[data-project-description]').textContent = english ? descriptions[project.id] : project.description;
  finder.querySelector('[data-project-open]').href = project.url;
  inspector.hidden = false;
}
function filterProjects() {
  const query = normalize(search.value.trim());
  let count = 0;
  folders.forEach(button => {
    const project = projects.find(project => project.id === button.dataset.projectId);
    button.hidden = !(category === 'all' || project.category === category) || !normalize(`${project.name} ${project.kind} ${project.description}`).includes(query);
    if (!button.hidden) count++;
    if (button.hidden && button.getAttribute('aria-pressed') === 'true') {
      button.setAttribute('aria-pressed', 'false'); inspector.hidden = true;
    }
  });
  finder.querySelector('[data-finder-count]').textContent = `${count} ${english ? 'projects' : 'Projekte'}`;
  finder.querySelector('[data-finder-empty]').hidden = count > 0;
}
search.addEventListener('input', filterProjects);
search.addEventListener('keydown', event => event.stopPropagation());
categories.forEach(button => button.addEventListener('click', () => {
  category = button.dataset.projectCategory;
  categories.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  filterProjects();
}));
folders.forEach(button => {
  button.addEventListener('click', () => selectProject(button));
  button.addEventListener('dblclick', () => {
    selectProject(button);
    finder.querySelector('[data-project-open]').click();
  });
});
finder.querySelectorAll('[data-finder-view]').forEach(button => button.addEventListener('click', () => {
  finder.dataset.finderView = button.dataset.finderView;
  finder.querySelectorAll('[data-finder-view]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
}));
// Arrow keys inside the folder view move focus rather than switching site windows.
finder.addEventListener('keydown', event => {
  const button = event.target.closest('[data-project-id]');
  if (!button || !['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key)) return;
  event.preventDefault(); event.stopPropagation();
  const visible = folders.filter(folder => !folder.hidden);
  const index = visible.indexOf(button);
  const grid = finder.querySelector('.finder-grid');
  const columns = finder.dataset.finderView === 'list' ? 1 : getComputedStyle(grid).gridTemplateColumns.split(' ').length;
  let next = index + ({ArrowLeft:-1,ArrowRight:1,ArrowUp:-columns,ArrowDown:columns}[event.key] || 0);
  if (event.key === 'Home') next = 0;
  if (event.key === 'End') next = visible.length - 1;
  visible[Math.max(0, Math.min(visible.length - 1, next))]?.focus();
});
