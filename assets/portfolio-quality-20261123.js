// Make the skip link enter the active window rather than an inert panel.
const skip = document.querySelector(".portfolio-skip");
skip?.addEventListener("click", (event) => {
  const panel = document.querySelector('.site-panel[data-window-depth="0"]');
  if (!panel) return;
  event.preventDefault();
  panel.focus();
  panel.scrollIntoView({ block: "nearest", behavior: "instant" });
});
// Let the native focus scroll and the disclosure height settle before checking the dock.
let focusTimer;
document.addEventListener("focusin", (event) => {
  clearTimeout(focusTimer);
  const target = event.target;
  if (!matchMedia("(max-width:1199px)").matches || !target.closest(".site-panel")) return;
  focusTimer = setTimeout(() => {
    if (target !== document.activeElement) return;
    const box = target.getBoundingClientRect(),
      dock = document.querySelector(".window-tabs")?.getBoundingClientRect();
    if (box.top < 75 || (dock && box.bottom > dock.top - 12))
      target.scrollIntoView({ block: "center", behavior: "instant" });
  }, 60);
});
