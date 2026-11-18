const menus = [...document.querySelectorAll('.mobile-menu')];
function closeMenus(restoreFocus = false) {
  for (const menu of menus) {
    if (!menu.open) continue;
    menu.open = false;
    if (restoreFocus) menu.querySelector('summary').focus();
  }
}
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenus(true);
});
document.addEventListener('click', event => {
  if (!event.target.closest('.mobile-menu')) closeMenus();
  else if (event.target.closest('a')) closeMenus();
});
document.addEventListener('focusin', event => {
  if (!event.target.closest('.mobile-menu')) closeMenus();
});
const progress = document.querySelector('.reading-progress span');
if (progress) {
  let queued = false;
  const update = () => {
    const distance = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0})`;
    queued = false;
  };
  const queue = () => {
    if (!queued) requestAnimationFrame(update);
    queued = true;
  };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  new ResizeObserver(queue).observe(document.body);
  update();
}
