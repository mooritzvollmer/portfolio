// Contextual windows. The three primary site areas remain independent.
const en = document.documentElement.lang.startsWith("en");
const text = (de, english) => (en ? english : de);
const dialogs = [...document.querySelectorAll(".mac-app")];
const openers = new WeakMap();
document.querySelectorAll("[data-open-app]").forEach((button) => {
  button.addEventListener("click", () => {
    const dialog = document.getElementById(button.dataset.openApp);
    openers.set(dialog, button);
    dialog.showModal();
    dialog.querySelector(".app-chrome h2").focus({ preventScroll: true });
  });
});
dialogs.forEach((dialog) => {
  dialog
    .querySelectorAll("[data-app-close]")
    .forEach((button) =>
      button.addEventListener("click", () => dialog.close()),
    );
  dialog
    .querySelector("[data-app-maximize]")
    .addEventListener("click", (event) => {
      const expanded = dialog.classList.toggle("is-maximized");
      event.currentTarget.setAttribute("aria-pressed", String(expanded));
      event.currentTarget.setAttribute(
        "aria-label",
        expanded
          ? text("Fenster verkleinern", "Restore window")
          : text("Fenster vergrößern", "Expand window"),
      );
    });
  // Keep the main site's arrow/swipe navigation behind this modal unchanged.
  ["keydown", "touchstart", "touchmove", "touchend", "wheel"].forEach((type) =>
    dialog.addEventListener(type, (event) => event.stopPropagation()),
  );
  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const controls = [
      ...dialog.querySelectorAll(
        'button, a[href], input, select, [tabindex="0"]',
      ),
    ].filter(
      (el) => !el.disabled && el.tabIndex >= 0 && el.getClientRects().length,
    );
    const first = controls[0],
      last = controls.at(-1);
    if (
      event.shiftKey &&
      (document.activeElement === first ||
        document.activeElement === dialog.querySelector("h2"))
    ) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  dialog.addEventListener("close", () =>
    openers.get(dialog)?.focus({ preventScroll: true }),
  );
});

function keyboardTabs(buttons, activate, orientation = "horizontal") {
  buttons.forEach((button, index) => {
    button.addEventListener("click", () => activate(index));
    button.addEventListener("keydown", (event) => {
      const previous = orientation === "vertical" ? "ArrowUp" : "ArrowLeft";
      const next = orientation === "vertical" ? "ArrowDown" : "ArrowRight";
      let target;
      if (event.key === previous)
        target = (index - 1 + buttons.length) % buttons.length;
      if (event.key === next) target = (index + 1) % buttons.length;
      if (event.key === "Home") target = 0;
      if (event.key === "End") target = buttons.length - 1;
      if (target === undefined) return;
      event.preventDefault();
      event.stopPropagation();
      activate(target);
      buttons[target].focus({ preventScroll: true });
    });
  });
}
const noteTabs = [...document.querySelectorAll("[data-note-tab]")];
noteTabs[0].parentElement.setAttribute("aria-orientation", "vertical");
function selectNote(index) {
  noteTabs.forEach((button, i) => {
    button.setAttribute("aria-selected", String(i === index));
    button.tabIndex = i === index ? 0 : -1;
    document.getElementById(button.getAttribute("aria-controls")).hidden =
      i !== index;
  });
}
keyboardTabs(noteTabs, selectNote, "vertical");
// On narrow layouts the Notes list becomes a horizontal segmented selector.
noteTabs.forEach((button, index) =>
  button.addEventListener("keydown", (event) => {
    if (innerWidth > 480 || !["ArrowLeft", "ArrowRight"].includes(event.key))
      return;
    event.preventDefault();
    event.stopPropagation();
    const next =
      (index + (event.key === "ArrowRight" ? 1 : -1) + noteTabs.length) %
      noteTabs.length;
    selectNote(next);
    noteTabs[next].focus();
  }),
);
function updateNotesOrientation() {
  noteTabs[0].parentElement.setAttribute(
    "aria-orientation",
    innerWidth <= 480 ? "horizontal" : "vertical",
  );
}
updateNotesOrientation();
addEventListener("resize", updateNotesOrientation);

const image = document.querySelector("#design-app");
const frame = image.querySelector("[data-image-frame]");
const zoom = image.querySelector("[data-image-zoom]");
const ratio = image.querySelector("[data-image-ratio]");
const canvas = image.querySelector("[data-image-canvas]");
const selectTool = image.querySelector('[data-image-tool="select"]');
function fitImage() {
  if (!image.open || !canvas.clientHeight) return;
  const style = getComputedStyle(canvas);
  const availableWidth =
    canvas.clientWidth -
    parseFloat(style.paddingLeft) -
    parseFloat(style.paddingRight);
  const availableHeight =
    canvas.clientHeight -
    parseFloat(style.paddingTop) -
    parseFloat(style.paddingBottom);
  const [w, h] = (ratio.value === "original" ? "960/1431" : ratio.value)
    .split("/")
    .map(Number);
  const width = Math.min(availableWidth, (availableHeight * w) / h);
  frame.style.width = `${width}px`;
  frame.style.height = `${(width * h) / w}px`;
}
new ResizeObserver(fitImage).observe(canvas);
function setZoom(value) {
  zoom.value = value;
  frame.style.setProperty("--image-zoom", Number(zoom.value) / 100);
  image.querySelector("[data-zoom-output]").value = `${zoom.value} %`;
}
zoom.addEventListener("input", () => setZoom(zoom.value));
ratio.addEventListener("change", fitImage);
image.querySelectorAll("[data-image-layer]").forEach((input) =>
  input.addEventListener("change", () => {
    image.querySelector(`[data-image-${input.dataset.imageLayer}]`).hidden =
      !input.checked;
  }),
);
const swatches = [...image.querySelectorAll("[data-canvas-color]")];
function setCanvas(button) {
  canvas.style.setProperty("--canvas-color", button.dataset.canvasColor);
  swatches.forEach((swatch) =>
    swatch.setAttribute("aria-pressed", String(swatch === button)),
  );
}
swatches.forEach((button) =>
  button.addEventListener("click", () => setCanvas(button)),
);
selectTool.addEventListener("click", () =>
  selectTool.setAttribute(
    "aria-pressed",
    String(frame.classList.toggle("has-selection")),
  ),
);
image
  .querySelector('[data-image-tool="crop"]')
  .addEventListener("click", () => ratio.focus());
image
  .querySelector('[data-image-tool="zoom"]')
  .addEventListener("click", () =>
    setZoom(
      Number(zoom.value) >= 180 ? 100 : Math.min(180, Number(zoom.value) + 25),
    ),
  );
image.querySelector("[data-image-reset]").addEventListener("click", () => {
  setZoom(100);
  ratio.value = "original";
  fitImage();
  frame.classList.remove("has-selection");
  selectTool.setAttribute("aria-pressed", "false");
  setCanvas(swatches[0]);
  image.querySelectorAll("[data-image-layer]").forEach((input) => {
    input.checked = input.dataset.imageLayer !== "grid";
    image.querySelector(`[data-image-${input.dataset.imageLayer}]`).hidden =
      !input.checked;
  });
});

const demoTabs = [...document.querySelectorAll("[data-demo-tab]")];
const demoPanels = [...document.querySelectorAll(".demo-panel")];
// This is the same function shown in the code window and used by the preview.
function selectPreviewTab(index) {
  demoTabs.forEach((tab, i) => {
    const selected = i === index;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    demoPanels[i].hidden = !selected;
  });
}
keyboardTabs(demoTabs, selectPreviewTab);
const fileTabs = [...document.querySelectorAll("[data-code-file]")];
const codeOutput = document.querySelector("[data-source-code]");
const sourcePane = document.querySelector("#source-pane");
const files = {
  js: {
    name: "navigation.js",
    language: "JavaScript",
    code: `const demoTabs = [...document.querySelectorAll('[data-demo-tab]')];\nconst demoPanels = [...document.querySelectorAll('.demo-panel')];\n\n${selectPreviewTab.toString()}\n\ndemoTabs.forEach((tab, index) => {\n  tab.addEventListener('click', () => selectPreviewTab(index));\n  tab.addEventListener('keydown', event => {\n    let next;\n    if (event.key === 'ArrowRight') next = (index + 1) % demoTabs.length;\n    if (event.key === 'ArrowLeft') next = (index - 1 + demoTabs.length) % demoTabs.length;\n    if (event.key === 'Home') next = 0;\n    if (event.key === 'End') next = demoTabs.length - 1;\n    if (next === undefined) return;\n    event.preventDefault();\n    selectPreviewTab(next);\n    demoTabs[next].focus();\n  });\n});`,
  },
  html: {
    name: "markup.html",
    language: "HTML",
    code: document.querySelector(".demo-app").outerHTML.replace(/></g, ">\n<"),
  },
  css: {
    name: "motion.css",
    language: "CSS",
    code: document.querySelector("[data-demo-css]").textContent.trim(),
  },
};
let currentFile = files.js;
// Token text is always inserted as textContent: pasted markup never executes.
function renderSource(source) {
  codeOutput.replaceChildren();
  const tokenPattern =
    /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`[^`]*`|\/\/.*$|\b(?:const|let|function|return|if|undefined|true|false)\b|\b\d+\b|<\/?[\w-]+)/gm;
  source.split("\n").forEach((line, index) => {
    const row = document.createElement("span");
    row.className = "code-line";
    row.dataset.line = index + 1;
    let position = 0;
    for (const match of line.matchAll(tokenPattern)) {
      row.append(document.createTextNode(line.slice(position, match.index)));
      const token = document.createElement("span");
      const value = match[0];
      token.className = `token-${value.startsWith("//") ? "comment" : /^["'`]/.test(value) ? "string" : /^\d/.test(value) ? "number" : value.startsWith("<") ? "tag" : "keyword"}`;
      token.textContent = value;
      row.append(token);
      position = match.index + value.length;
    }
    row.append(
      document.createTextNode(line.slice(position) || (line ? "" : "\u200b")),
    );
    codeOutput.append(row);
  });
}
function selectFile(index) {
  fileTabs.forEach((tab, i) => {
    tab.setAttribute("aria-selected", String(i === index));
    tab.tabIndex = i === index ? 0 : -1;
  });
  const tab = fileTabs[index];
  currentFile = files[tab.dataset.codeFile];
  renderSource(currentFile.code);
  document.querySelector("[data-source-name]").textContent =
    `frontend / ${currentFile.name}`;
  document.querySelector("#code-title").textContent = currentFile.name;
  document.querySelector("[data-code-language]").textContent =
    currentFile.language;
  sourcePane.setAttribute("aria-labelledby", tab.id);
  sourcePane.scrollTop = 0;
  sourcePane.scrollLeft = 0;
  document.querySelector("[data-copy-status]").textContent = "";
}
keyboardTabs(fileTabs, selectFile);
selectFile(0);
async function copy(value, status) {
  try {
    await navigator.clipboard.writeText(value);
    status.textContent = text("Kopiert.", "Copied.");
  } catch {
    status.textContent = text(
      "Kopieren nicht möglich. Bitte den Text markieren und kopieren.",
      "Copy unavailable. Please select and copy the text.",
    );
  }
}
document
  .querySelector("[data-code-copy]")
  .addEventListener("click", () =>
    copy(currentFile.code, document.querySelector("[data-copy-status]")),
  );
document
  .querySelector("[data-copy-email]")
  .addEventListener("click", () =>
    copy(
      "hello@moritzvollmer.de",
      document.querySelector("[data-mail-copy-status]"),
    ),
  );
