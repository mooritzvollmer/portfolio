const ids = ["start", "about", "work", "chat", "contact"];
const panels = ids.map((id) => document.querySelector(`[data-nav-panel="${id}"]`));
const tabs = [...document.querySelectorAll("[data-window-tab]")];
const previews = [...document.querySelectorAll("[data-window-preview]")];
const stage = document.querySelector(".window-stage");
const narrow = matchMedia("(max-width: 1199px)");
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const english = document.documentElement.lang.startsWith("en");
const names = english
  ? ["Start", "Profile", "Work", "Chat", "Contact"]
  : ["Start", "Profil", "Work", "Chat", "Kontakt"];
let current = ids.includes(location.hash.slice(1)) ? location.hash.slice(1) : "start";
let initialized = false;
let layoutFrame;
let wheelTotal = 0;
let wheelTime = 0;
let lastWheelSwitch = -Infinity;

function fitMobile() {
  cancelAnimationFrame(layoutFrame);
  layoutFrame = requestAnimationFrame(() => {
    if (!narrow.matches) {
      stage.style.removeProperty("height");
      return;
    }
    const panel = panels[ids.indexOf(current)];
    stage.style.height = `${Math.ceil(Math.max(panel.scrollHeight, panel.getBoundingClientRect().height))}px`;
  });
}

function sync(id) {
  if (!ids.includes(id)) return;
  const old = current;
  const desktopMotion = !narrow.matches && initialized && old !== id && !reduced.matches;
  const previousTransforms = desktopMotion
    ? panels.map((panel) => getComputedStyle(panel).transform)
    : null;
  if (desktopMotion)
    panels.forEach((panel) => panel.getAnimations().forEach((animation) => animation.cancel()));
  const focusWasInPrevious =
    old !== id && panels[ids.indexOf(old)].contains(document.activeElement);
  current = id;
  const index = ids.indexOf(id);
  panels.forEach((panel, panelIndex) => {
    const active = panelIndex === index;
    panel.dataset.windowDepth = String((panelIndex - index + ids.length) % ids.length);
    panel.setAttribute("aria-hidden", String(!active));
    panel.inert = false;
    panel.querySelector(".window-content").inert = !active;
  });
  tabs.forEach((tab) => {
    const active = tab.dataset.windowTab === id;
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  previews.forEach((button) => {
    const target = (index + Number(button.dataset.windowPreview)) % ids.length;
    button.dataset.target = ids[target];
    button.textContent = names[target];
    button.setAttribute("aria-controls", `window-${ids[target]}`);
    button.setAttribute(
      "aria-label",
      english
        ? `Bring ${names[target]} window forward`
        : `Fenster ${names[target]} in den Vordergrund holen`,
    );
  });
  if (desktopMotion) {
    panels.forEach((panel, panelIndex) => {
      const target = getComputedStyle(panel).transform;
      const front = panelIndex === index;
      const lift = new DOMMatrix(target).translate(0, -7).scale(1.015).toString();
      panel.animate(
        front
          ? [
              {
                transform: previousTransforms[panelIndex],
                offset: 0,
                easing: "cubic-bezier(.16,.75,.25,1)",
              },
              { transform: lift, offset: 0.72, easing: "cubic-bezier(.3,0,.2,1)" },
              { transform: target, offset: 1 },
            ]
          : [{ transform: previousTransforms[panelIndex] }, { transform: target }],
        { duration: front ? 680 : 560, easing: front ? "linear" : "cubic-bezier(.2,.8,.2,1)" },
      );
    });
  }
  if (narrow.matches && initialized && old !== id && !reduced.matches) {
    const direction = index > ids.indexOf(old) ? 1 : -1;
    panels.forEach((panel) => panel.getAnimations().forEach((animation) => animation.cancel()));
    panels[ids.indexOf(old)].animate(
      [
        { opacity: 1, transform: "translateX(0)" },
        { opacity: 0, transform: `translateX(${-direction * 24}px)` },
      ],
      { duration: 180, easing: "ease-out" },
    );
    panels[index].animate(
      [
        { opacity: 0, transform: `translateX(${direction * 24}px)` },
        { opacity: 1, transform: "translateX(0)" },
      ],
      { duration: 300, easing: "cubic-bezier(.2,.7,.2,1)" },
    );
  }
  initialized = true;
  if (focusWasInPrevious) panels[index].focus({ preventScroll: true });
  fitMobile();
}

function choose(id, focusTab = false) {
  if (!ids.includes(id)) return;
  // Keep the existing navigation responsible for hashes, counters, menu and swipe state.
  document.querySelector(`.site-nav [data-nav-link="${id}"]`).click();
  if (focusTab) document.querySelector(`[data-window-tab="${id}"]`).focus({ preventScroll: true });
}

// The legacy navigation emits this before updating mobile aria/inert state.
document.addEventListener("site-panel-change", (event) =>
  queueMicrotask(() => sync(event.detail.id)),
);
tabs.forEach((tab) => {
  tab.addEventListener("click", () => choose(tab.dataset.windowTab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const index = ids.indexOf(tab.dataset.windowTab);
    const target =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? ids.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + ids.length) % ids.length;
    choose(ids[target], true);
  });
});
previews.forEach((button) => button.addEventListener("click", () => choose(button.dataset.target)));
panels.forEach((panel) =>
  panel.querySelector(".window-chrome").addEventListener("click", () => {
    if (panel.dataset.windowDepth !== "0") choose(panel.dataset.navPanel);
  }),
);

// Horizontal trackpad gestures switch windows; vertical scrolling stays available for content.
stage.addEventListener(
  "wheel",
  (event) => {
    if (narrow.matches || event.ctrlKey || Math.abs(event.deltaX) <= Math.abs(event.deltaY) * 1.4)
      return;
    event.preventDefault();
    const now = performance.now();
    if (now - lastWheelSwitch < 750) return;
    if (now - wheelTime > 180) wheelTotal = 0;
    wheelTime = now;
    wheelTotal += event.deltaX;
    if (Math.abs(wheelTotal) < 65) return;
    const target = ids.indexOf(current) + (wheelTotal > 0 ? 1 : -1);
    wheelTotal = 0;
    if (ids[target]) {
      lastWheelSwitch = now;
      choose(ids[target]);
    }
  },
  { passive: false },
);

new ResizeObserver(fitMobile).observe(stage);
panels.forEach((panel) =>
  new ResizeObserver(fitMobile).observe(panel.querySelector(".window-content")),
);
addEventListener("resize", fitMobile);
narrow.addEventListener("change", () => sync(current));
reduced.addEventListener("change", () => {
  if (reduced.matches)
    panels.forEach((panel) => panel.getAnimations().forEach((animation) => animation.cancel()));
});
document.fonts?.ready.then(fitMobile);
if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", () => sync(current), { once: true });
else sync(current);
