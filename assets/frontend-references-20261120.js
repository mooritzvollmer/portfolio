const projects = [
  {
    "id": "convista",
    "name": "Convista",
    "url": "https://www.convista.com",
    "category": "web",
    "kind": "Website",
    "description": "www.convista.com",
    "descriptionEn": "www.convista.com"
  },
  {
    "id": "ticketio",
    "name": "ticket.io",
    "url": "https://ticket.io",
    "category": "web",
    "kind": "Website",
    "description": "ticket.io",
    "descriptionEn": "ticket.io"
  },
  {
    "id": "starkeperiode",
    "name": "Starke Periode",
    "url": "https://starke-periode.de",
    "category": "web",
    "kind": "Website",
    "description": "starke-periode.de",
    "descriptionEn": "starke-periode.de"
  },
  {
    "id": "buddystar",
    "name": "Buddystar",
    "url": "https://buddystar.de",
    "category": "web",
    "kind": "Website",
    "description": "buddystar.de",
    "descriptionEn": "buddystar.de"
  },
  {
    "id": "lekkerland",
    "name": "Lekkerland Karriere",
    "url": "https://karriere.lekkerland.de",
    "category": "web",
    "kind": "Website",
    "description": "karriere.lekkerland.de",
    "descriptionEn": "karriere.lekkerland.de"
  },
  {
    "id": "faktorzehn",
    "name": "FaktorZehn",
    "url": "https://www.faktorzehn.com/de",
    "category": "web",
    "kind": "Website",
    "description": "www.faktorzehn.com",
    "descriptionEn": "www.faktorzehn.com"
  },
  {
    "id": "munaplus",
    "name": "MUNA+",
    "url": "https://www.munaplus.org",
    "category": "web",
    "kind": "Website",
    "description": "www.munaplus.org",
    "descriptionEn": "www.munaplus.org"
  },
  {
    "id": "pflegeplanet",
    "name": "Pflegeplanet",
    "url": "https://www.pflege-planet.de",
    "category": "web",
    "kind": "Website",
    "description": "www.pflege-planet.de",
    "descriptionEn": "www.pflege-planet.de"
  },
  {
    "id": "onoffice",
    "name": "OnOffice",
    "url": "https://www.onoffice.com",
    "category": "web",
    "kind": "Website",
    "description": "www.onoffice.com",
    "descriptionEn": "www.onoffice.com"
  },
  {
    "id": "eisberg",
    "name": "Eisberg",
    "url": "https://eisberg.com",
    "category": "web",
    "kind": "Website",
    "description": "eisberg.com",
    "descriptionEn": "eisberg.com"
  },
  {
    "id": "konradgraser",
    "name": "Konrad Graser",
    "url": "https://www.konrad-graser.de",
    "category": "web",
    "kind": "Website",
    "description": "www.konrad-graser.de",
    "descriptionEn": "www.konrad-graser.de"
  },
  {
    "id": "smartaware",
    "name": "smartAware",
    "url": "https://www.smart-aware.de/",
    "category": "web",
    "kind": "Website",
    "description": "www.smart-aware.de",
    "descriptionEn": "www.smart-aware.de"
  }
];
const english = document.documentElement.lang.startsWith('en');
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
  finder.querySelector('[data-project-description]').textContent = english ? project.descriptionEn : project.description;
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
