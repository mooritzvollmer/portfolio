const $ = (selector) => document.querySelector(selector);
let csrf = "",
  records = [],
  dirty = false,
  busy = false;
const message = (selector, text, error = false) => {
  const node = $(selector);
  node.textContent = text;
  node.dataset.error = String(error);
};
async function request(action, body) {
  const response = await fetch("/api/frag-moritz.php?action=" + encodeURIComponent(action), {
    method: body === undefined ? "GET" : "POST",
    cache: "no-store",
    credentials: "same-origin",
    headers: body === undefined ? {} : { "Content-Type": "application/json", "X-CSRF-Token": csrf },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(28000),
  });
  const data = await response.json();
  if (!response.ok) throw Error(data.error || "Anfrage fehlgeschlagen.");
  return data;
}
function collect() {
  return [...document.querySelectorAll("[data-record]")].map((node) => {
    const record = {
      id: node.dataset.record,
      enabled: node.querySelector('[data-field="enabled"]').checked,
    };
    for (const field of ["title", "text", "textEn", "keywords", "url"])
      record[field] = node.querySelector(`[data-field="${field}"]`).value.trim();
    return record;
  });
}
function render() {
  const list = $("[data-record-list]");
  list.replaceChildren();
  for (const record of records) {
    const details = document.createElement("details");
    details.className = "fa-record";
    details.dataset.record = record.id;
    const summary = document.createElement("summary");
    summary.textContent = record.title || "Neuer Eintrag";
    details.append(summary);
    const body = document.createElement("div");
    body.className = "fa-record-body";
    const field = (name, label, type = "input") => {
      const wrapper = document.createElement("label");
      wrapper.textContent = label;
      const input = document.createElement(type);
      input.dataset.field = name;
      input.value = record[name] || "";
      input.maxLength = { title: 100, keywords: 700, text: 2200, textEn: 2200, url: 240 }[name];
      if (name === "title" || name === "text" || name === "url") input.required = true;
      input.addEventListener("input", () => {
        dirty = true;
        if (name === "title") summary.textContent = input.value || "Neuer Eintrag";
      });
      wrapper.append(input);
      body.append(wrapper);
    };
    field("title", "Titel");
    field("keywords", "Schlagwörter für die Suche");
    field("text", "Freigegebene Informationen · Deutsch", "textarea");
    field("textEn", "Englisch · optional", "textarea");
    field("url", "Quellenseite im Portfolio, zum Beispiel /ueber-mich/");
    const label = document.createElement("label");
    label.className = "fa-check";
    const enabled = document.createElement("input");
    enabled.type = "checkbox";
    enabled.dataset.field = "enabled";
    enabled.checked = record.enabled !== false;
    enabled.addEventListener("change", () => (dirty = true));
    label.append(enabled, document.createTextNode("Für Antworten freigeben"));
    body.append(label);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "fa-danger";
    remove.textContent = "Eintrag entfernen";
    remove.addEventListener("click", () => {
      const current = collect();
      if (current.length === 1) {
        message("[data-save-message]", "Mindestens ein Eintrag muss erhalten bleiben.", true);
        return;
      }
      records = current.filter((r) => r.id !== record.id);
      dirty = true;
      render();
    });
    body.append(remove);
    details.append(body);
    list.append(details);
  }
  $("[data-record-count]").textContent = records.length + " Wissenseinträge";
}
async function load() {
  try {
    const state = await request("admin-state");
    csrf = state.csrf;
    $("[data-admin-login]").hidden = state.authenticated;
    $("[data-admin-app]").hidden = !state.authenticated;
    $("[data-admin-logout]").hidden = !state.authenticated;
    if (!state.authenticated) {
      $("#admin-password").disabled = false;
      $("[data-admin-login-form] button").disabled = false;
      message("[data-login-message]", "");
      return;
    }
    records = state.records;
    render();
    $("[data-api-status]").textContent = "Ausschließlich Profilwissen. Keine externen KI-Aufrufe und keine API-Kosten.";
    dirty = false;
  } catch (e) {
    message("[data-login-message]", e.message, true);
  }
}
$("[data-admin-login-form]").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (busy) return;
  busy = true;
  const button = event.currentTarget.querySelector("button");
  button.disabled = true;
  try {
    await request("login", { password: $("#admin-password").value });
    $("#admin-password").value = "";
    await load();
  } catch (e) {
    message("[data-login-message]", e.message, true);
  } finally {
    busy = false;
    button.disabled = false;
  }
});
$("[data-admin-logout]").addEventListener("click", async () => {
  try {
    if (dirty && !confirm("Ungespeicherte Änderungen verwerfen und abmelden?")) return;
    await request("logout", {});
    dirty = false;
    location.reload();
  } catch (e) {
    message("[data-save-message]", e.message, true);
  }
});
const tabs = [...document.querySelectorAll("[data-admin-tab]")];
function tab(id) {
  tabs.forEach((b) => {
    const active = b.dataset.adminTab === id;
    b.setAttribute("aria-selected", String(active));
    b.tabIndex = active ? 0 : -1;
  });
  document
    .querySelectorAll("[data-admin-panel]")
    .forEach((p) => (p.hidden = p.dataset.adminPanel !== id));
}
tabs.forEach((button, index) => {
  button.addEventListener("click", () => tab(button.dataset.adminTab));
  button.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? tabs.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    tab(tabs[next].dataset.adminTab);
    tabs[next].focus();
  });
});
$("[data-record-add]").addEventListener("click", () => {
  records = collect();
  if (records.length >= 80) {
    message("[data-save-message]", "Maximal 80 Einträge.", true);
    return;
  }
  const id = "wissen-" + crypto.randomUUID().slice(0, 8);
  records.push({
    id,
    title: "Neuer Eintrag",
    text: "",
    textEn: "",
    keywords: "",
    url: "/ueber-mich/",
    enabled: false,
  });
  dirty = true;
  render();
  const node = document.querySelector(`[data-record="${id}"]`);
  node.open = true;
  node.querySelector("input").focus();
});
$("[data-record-save]").addEventListener("click", async (event) => {
  if (busy) return;
  records = collect();
  if (records.some((r) => !r.title || !r.text || !r.url)) {
    message(
      "[data-save-message]",
      "Bitte Titel, Inhalt und Quellenlink für jeden Eintrag ergänzen.",
      true,
    );
    return;
  }
  busy = true;
  event.currentTarget.disabled = true;
  try {
    const data = await request("save-knowledge", { records });
    dirty = false;
    message("[data-save-message]", data.count + " Einträge gespeichert und veröffentlicht.");
  } catch (e) {
    message("[data-save-message]", e.message, true);
  } finally {
    busy = false;
    $("[data-record-save]").disabled = false;
  }
});
$("[data-record-export]").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify({ version: 1, records: collect() }, null, 2)], {
      type: "application/json",
    }),
    url = URL.createObjectURL(blob),
    link = document.createElement("a");
  link.href = url;
  link.download = "frag-moritz-profilwissen.json";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
$("[data-record-import]").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    if (file.size > 280000) throw Error("Datei ist zu groß.");
    const data = JSON.parse(await file.text());
    if (
      !Array.isArray(data.records) ||
      data.records.length < 1 ||
      data.records.length > 80 ||
      data.records.some(
        (r) =>
          !r ||
          typeof r.id !== "string" ||
          !/^[a-z0-9-]{1,60}$/.test(r.id) ||
          typeof r.title !== "string" ||
          typeof r.text !== "string",
      )
    )
      throw Error("Keine gültige Wissensdatei.");
    if (dirty && !confirm("Die ungespeicherte Bearbeitung durch den Import ersetzen?")) return;
    records = data.records;
    dirty = true;
    render();
    message("[data-save-message]", "Importiert. Mit „Wissen speichern“ veröffentlichen.");
  } catch (e) {
    message("[data-save-message]", e.message, true);
  } finally {
    event.target.value = "";
  }
});
$("[data-test-form]").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (busy) return;
  busy = true;
  const button = event.currentTarget.querySelector("button");
  button.disabled = true;
  message("[data-test-state]", "Antwort wird vorbereitet …");
  $("[data-test-output]").textContent = "";
  $("[data-test-sources]").textContent = "";
  try {
    const data = await request("test", {
      question: $("#test-question").value,
      language: "de",
      history: [],
    });
    message(
      "[data-test-state]",
      data.reason === "provider-unavailable"
        ? "OpenAI hat keine verwendbare Antwort geliefert. Bitte API-Schlüssel, Guthaben und Modellzugriff prüfen."
        : data.reason === "daily-limit"
          ? "KI-Tageslimit erreicht. Antwort aus dem Profilwissen."
          : data.mode === "ai"
            ? "KI-Antwort über OpenAI"
            : "Antwort direkt aus dem Profilwissen",
    );
    $("[data-test-output]").textContent = data.answer;
    $("[data-test-sources]").textContent =
      "Quellen: " + (data.sources.map((s) => s.title).join(", ") || "Keine passende Information");
  } catch (e) {
    message("[data-test-state]", e.message, true);
  } finally {
    busy = false;
    button.disabled = false;
  }
});
window.addEventListener("beforeunload", (event) => {
  if (dirty) {
    event.preventDefault();
    event.returnValue = "";
  }
});
load();
