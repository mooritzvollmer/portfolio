const toggle = document.querySelector('[data-pill-nav-toggle]');
const drawer = document.querySelector('.site-nav');
const header = document.querySelector('[data-pill-nav]');
const main = document.querySelector('main');
const dock = document.querySelector('.profile-bottom-tools');
const mobile = matchMedia('(max-width: 1023px)');
const isModalOpen = () => mobile.matches && document.body.classList.contains('is-nav-open');

function syncMenu() {
  const blocked = isModalOpen();
  main.inert = blocked;
  dock.inert = blocked;
}
new MutationObserver(syncMenu).observe(document.body, { attributes: true, attributeFilter: ['class'] });
mobile.addEventListener('change', syncMenu);
syncMenu();

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    queueMicrotask(() => toggle.focus({ preventScroll: true }));
  }
  if (event.key !== 'Tab' || !isModalOpen()) return;
  const focusable = [...header.querySelectorAll('a,button'), ...drawer.querySelectorAll('a,button')].filter(el => {
    const style = getComputedStyle(el);
    return !el.disabled && !el.closest('[inert]') && el.getClientRects().length && style.visibility !== 'hidden' && style.display !== 'none';
  });
  if (!focusable.length) return;
  const index = focusable.indexOf(document.activeElement);
  if (index < 0 || (!event.shiftKey && index === focusable.length - 1) || (event.shiftKey && index === 0)) {
    event.preventDefault();
    focusable[event.shiftKey ? focusable.length - 1 : 0].focus();
  }
}, true);
