const main = document.querySelector('.site-panels');
const panels = [...main.querySelectorAll('.site-panel')];
let frame;
function fitStack() {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    const active = panels.find(panel => panel.dataset.windowDepth === '0');
    if (!active) return;
    main.style.setProperty('--active-window-height', active.offsetHeight + 'px');
    main.style.setProperty('--active-window-offset', Math.max(0,parseFloat(getComputedStyle(active).getPropertyValue('--window-y')) || 0) + 'px');
  });
}
const observer = new ResizeObserver(fitStack);
panels.forEach(panel => observer.observe(panel));
new MutationObserver(fitStack).observe(main,{subtree:true,attributes:true,attributeFilter:['data-window-depth']});
addEventListener('resize',fitStack);
document.fonts?.ready.then(fitStack);
fitStack();
