const labels = {
  de: {
    internal: "Interner KI-Test",
    public: "KI-Profilassistent",
    start: "KI-Chat starten",
    publicIntro: "Frag den KI-Assistenten nach Moritz’ Erfahrung, Arbeitsweise und Projekten.",
    publicDisclosure:
      "Deine Frage, bis zu vier vorherige Nachrichten und freigegebene Profilinfos werden an OpenAI übermittelt. KI-Antworten können Fehler enthalten. Bitte keine vertraulichen Angaben.",
    loading: "Antwort wird vorbereitet …",
    failed: "Der Chat ist gerade nicht erreichbar. Schreib Moritz gerne eine E-Mail.",
    empty: "Bitte gib eine Frage ein.",
    disclosure:
      "Interner Test: Deine Frage, der kurze Verlauf und freigegebene Profilinfos werden an OpenAI übermittelt.",
    email: "Moritz eine E-Mail schreiben",
    source: "Mehr dazu: ",
    reset: "Unterhaltung geleert.",
  },
  en: {
    internal: "Internal AI test",
    public: "AI profile assistant",
    start: "Start AI chat",
    publicIntro: "Ask the AI assistant about Moritz’s experience, approach and projects.",
    publicDisclosure:
      "Your question, up to four previous messages and approved profile information are sent to OpenAI. AI answers may contain errors. Please do not share confidential information.",
    loading: "Preparing an answer…",
    failed: "The chat is currently unavailable. Please contact Moritz by email.",
    empty: "Please enter a question.",
    disclosure:
      "Internal test: your question, short history and approved profile information are sent to OpenAI.",
    email: "Email Moritz",
    source: "Read more: ",
    reset: "Conversation cleared.",
  },
};
const sources = {
  positionierung: ["Profil", "/ueber-mich/"],
  design: ["Design", "/kompetenzen/"],
  technik: ["Technik", "/kompetenzen/"],
  sichtbarkeit: ["Sichtbarkeit", "/seo-geo/"],
  skills: ["Kenntnisse", "/kompetenzen/"],
  lebenslauf: ["Lebenslauf", "/ueber-mich/#stationen"],
  projekte: ["Projekte", "/projekte/"],
  "projekt-lekkerland": ["Lekkerland Karriere", "/projekte/lekkerland-karriere/"],
  "projekt-eisberg": ["Eisberg", "/projekte/eisberg/"],
  "projekt-starke-periode": ["Starke Periode", "/projekte/starke-periode/"],
};
for (const chat of document.querySelectorAll("[data-profile-chat]")) {
  const language = chat.dataset.chatLanguage === "en" ? "en" : "de",
    t = labels[language];
  const q = (s) => chat.querySelector(s),
    form = q("[data-chat-form]"),
    input = q("[data-chat-question]"),
    send = q("[data-chat-send]"),
    thread = q("[data-chat-thread]"),
    status = q("[data-chat-status]"),
    error = q("[data-chat-error]"),
    disclosure = q("[data-chat-disclosure]"),
    reset = q("[data-chat-reset]");
  const initial = {
    status: status.textContent,
    disclosure: disclosure.cloneNode(true),
    welcome: q("[data-chat-welcome]").cloneNode(true),
  };
  let internal = true,
    publicAvailable = false;
  let ready = false,
    busy = false,
    csrf = null,
    history = [],
    pending = null;
  function controls() {
    input.disabled = !ready || busy;
    send.disabled = !ready || busy;
    reset.disabled = !ready || busy;
    chat.querySelectorAll("[data-chat-prompt]").forEach((b) => (b.disabled = !ready || busy));
    form.setAttribute("aria-busy", String(busy));
  }
  function preview() {
    ready = false;
    csrf = null;
    status.textContent = initial.status;
    disclosure.replaceChildren(...[...initial.disclosure.childNodes].map((n) => n.cloneNode(true)));
    controls();
  }
  function welcomeText() {
    const intro = q("[data-chat-welcome] p:not(.fm-intro)");
    if (intro && (ready || publicAvailable)) intro.textContent = t.publicIntro;
  }
  function showError(text) {
    error.replaceChildren(document.createTextNode(text + " "));
    const link = document.createElement("a");
    link.href = "mailto:hello@moritzvollmer.de";
    link.textContent = t.email;
    error.append(link);
  }
  function showDisclosure() {
    disclosure.replaceChildren(
      document.createTextNode((internal ? t.disclosure : t.publicDisclosure) + " "),
    );
    const link = document.createElement("a");
    link.href = "/datenschutz/#profilchat";
    link.textContent = language === "en" ? "Privacy" : "Datenschutz";
    disclosure.append(link);
  }
  function applyState(state) {
    internal = state.internal === true;
    publicAvailable = state.publicAvailable === true;
    if (state.ready === true && (internal || state.publicEnabled === true)) {
      ready = true;
      welcomeText();
      csrf = state.csrf;
      input.placeholder = language === "en" ? "Your question…" : "Deine Frage …";
      status.textContent = internal ? t.internal : t.public;
      q("[data-public-start]")?.remove();
      showDisclosure();
      controls();
      return;
    }
    preview();
    if (publicAvailable) {
      internal = false;
      status.textContent = t.public;
      showDisclosure();
      const welcome = q("[data-chat-welcome]");
      if (welcome) {
        const intro = welcome.querySelector("p:not(.fm-intro)");
        if (intro) intro.textContent = t.publicIntro;
        if (!q("[data-public-start]")) {
          const start = document.createElement("button");
          start.type = "button";
          start.className = "fm-start";
          start.dataset.publicStart = "";
          start.textContent = t.start;
          welcome.append(start);
        }
      }
    }
  }
  async function initialize() {
    if (busy) return;
    try {
      const r = await fetch("/api/vollmair.php?action=status", {
        credentials: "same-origin",
        cache: "no-store",
        signal: AbortSignal.timeout(7000),
      });
      if (!r.ok) throw Error();
      applyState(await r.json());
    } catch {
      preview();
    }
  }
  async function begin() {
    if (busy || !publicAvailable) return;
    busy = true;
    controls();
    const button = q("[data-public-start]");
    if (button) button.disabled = true;
    try {
      const r = await fetch("/api/vollmair.php?action=begin", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: "{}",
        signal: AbortSignal.timeout(7000),
      });
      const data = await r.json();
      if (!r.ok) throw Error(data.error || t.failed);
      applyState(data);
      input.focus({ preventScroll: true });
    } catch (e) {
      showError(e.message || t.failed);
      if (button) button.disabled = false;
    } finally {
      busy = false;
      controls();
      if (ready) input.focus({ preventScroll: true });
    }
  }
  function message(role, text, data = {}) {
    q("[data-chat-welcome]")?.remove();
    const article = document.createElement("article");
    article.className = "fm-message fm-message-" + role;
    const label = document.createElement("span");
    label.className = "visuallyHidden";
    label.textContent =
      (role === "user" ? (language === "en" ? "You" : "Du") : "Moritz Vollmair") + ": ";
    const p = document.createElement("p");
    p.textContent = text;
    article.append(label, p);
    if (role === "assistant") {
      const meta = document.createElement("p");
      meta.className = "fm-message-meta";
      if (data.known) {
        meta.append(document.createTextNode(t.source));
        const seen = new Set();
        for (const id of data.fact_ids) {
          const source = sources[id];
          if (!source || seen.has(source[1])) continue;
          if (seen.size) meta.append(document.createTextNode(" · "));
          seen.add(source[1]);
          const link = document.createElement("a");
          link.href = source[1];
          link.textContent = source[0];
          meta.append(link);
        }
      } else {
        meta.textContent = language === "en" ? "Ask Moritz directly" : "Frag Moritz direkt";
      }
      article.append(meta);
      if (!data.known) {
        const link = document.createElement("a");
        link.href = "mailto:hello@moritzvollmer.de";
        link.textContent = t.email;
        link.className = "fm-contact-fallback";
        article.append(link);
      }
    }
    thread.append(article);
    thread.scrollTop = thread.scrollHeight;
  }
  async function ask(value) {
    if (busy || !ready) return;
    const question = value.trim();
    if (!question) {
      error.textContent = t.empty;
      return;
    }
    if (question.length > 800) {
      error.textContent = t.empty;
      return;
    }
    error.textContent = "";
    message("user", question);
    input.value = "";
    input.style.height = "44px";
    busy = true;
    controls();
    status.textContent = t.loading;
    pending = new AbortController();
    const timeout = setTimeout(() => pending?.abort(), 45000);
    try {
      const r = await fetch("/api/vollmair.php?action=ask", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": csrf },
        body: JSON.stringify({ question, language, history: history.slice(-4) }),
        signal: pending.signal,
      });
      const data = await r.json();
      if (!r.ok) {
        if (r.status === 401 || r.status === 403) preview();
        throw Error(typeof data.error === "string" ? data.error : t.failed);
      }
      if (
        typeof data.answer !== "string" ||
        typeof data.known !== "boolean" ||
        !Array.isArray(data.fact_ids) ||
        data.fact_ids.some((id) => !Object.hasOwn(sources, id))
      )
        throw Error(t.failed);
      message("assistant", data.answer, data);
      history.push(
        { role: "user", content: question },
        { role: "assistant", content: data.answer.slice(0, 1000) },
      );
      history = history.slice(-4);
    } catch (e) {
      showError(e.name === "AbortError" ? t.failed : e.message || t.failed);
    } finally {
      clearTimeout(timeout);
      pending = null;
      busy = false;
      controls();
      if (ready) {
        status.textContent = internal ? t.internal : t.public;
        input.focus({ preventScroll: true });
      }
    }
  }
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    ask(input.value);
  });
  chat.addEventListener("click", (e) => {
    if (e.target.closest("[data-public-start]")) {
      begin();
      return;
    }
    const b = e.target.closest("[data-chat-prompt]");
    if (b) ask(b.textContent);
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      ask(input.value);
    }
  });
  input.addEventListener("input", () => {
    input.style.height = "44px";
    input.style.height = Math.min(input.scrollHeight, 100) + "px";
  });
  reset.addEventListener("click", () => {
    if (busy) return;
    thread.replaceChildren(initial.welcome.cloneNode(true));
    welcomeText();
    history = [];
    input.value = "";
    input.style.height = "44px";
    error.textContent = "";
    status.textContent = t.reset;
    controls();
    input.focus({ preventScroll: true });
  });
  controls();
  if (!chat.closest("[data-nav-panel]") || location.hash === "#chat") initialize();
  document.addEventListener("site-panel-change", (e) => {
    if (e.detail.id === "chat") initialize();
  });
  window.addEventListener("pageshow", () => {
    if (!chat.closest("[data-nav-panel]") || location.hash === "#chat") initialize();
  });
}
