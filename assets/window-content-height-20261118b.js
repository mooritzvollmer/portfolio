const main = document.querySelector('.site-panels');
const panels = [...main.querySelectorAll('.site-panel')];
const narrow = matchMedia('(max-width:1023px)');
let frame;
function fitStack() {
 cancelAnimationFrame(frame);
 frame = requestAnimationFrame(() => {
  const active = panels.find(panel => panel.dataset.windowDepth === '0');
  if (!active) return;
  const offset = Math.max(0,parseFloat(getComputedStyle(active).getPropertyValue('--window-y')) || 0);
  if (!narrow.matches) {
   const navHeight = main.querySelector('.window-tabs').offsetHeight;
   const available = Math.max(120,Math.floor(innerHeight - 70 - main.getBoundingClientRect().top - offset - 24 - navHeight));
   main.style.setProperty('--window-available-height', available + 'px');
  } else main.style.removeProperty('--window-available-height');
  main.style.setProperty('--active-window-height', active.offsetHeight + 'px');
  main.style.setProperty('--active-window-offset', offset + 'px');
 });
}
const observer = new ResizeObserver(fitStack);
panels.forEach(panel => observer.observe(panel));
observer.observe(main.querySelector('.window-tabs'));
new MutationObserver(fitStack).observe(main,{subtree:true,attributes:true,attributeFilter:['data-window-depth']});
addEventListener('resize',fitStack);
document.fonts?.ready.then(fitStack);
fitStack();
