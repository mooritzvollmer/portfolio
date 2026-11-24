const translations = {
  de: {
    knowledge: "Profilwissen · ohne KI",
    ai: "KI-Assistent · OpenAI",
    loading: "Antwort wird vorbereitet …",
    failed: "Der Chat ist gerade nicht erreichbar. Schreib Moritz gerne eine E-Mail.",
    empty: "Bitte gib eine Frage ein.",
    user: "Du",
    assistant: "Profilassistent",
    source: "Quelle: ",
    fromKnowledge: "Direkt aus dem Profilwissen",
    fromAi: "KI-Antwort · mit Quellen",
    fallback: "Die KI ist gerade nicht verfügbar. Antwort direkt aus dem Profilwissen.",
    limit: "Das KI-Tageslimit ist erreicht. Antwort direkt aus dem Profilwissen.",
    disclosure: "Antworten direkt aus dem Profilwissen. Keine externen KI-Dienste.",
    disclosureAi:
      "Deine Frage, der kurze Chatverlauf und passende Profilinfos werden an OpenAI übermittelt. Bitte keine vertraulichen Angaben.",
    privacy: "Datenschutz",
    cleared: "Unterhaltung geleert.",
  },
  en: {
    knowledge: "Profile knowledge · no AI",
    ai: "AI assistant · OpenAI",
    loading: "Preparing an answer…",
    failed: "The chat is currently unavailable. You can contact Moritz by email.",
    empty: "Please enter a question.",
    user: "You",
    assistant: "Profile assistant",
    source: "Source: ",
    fromKnowledge: "Directly from profile knowledge",
    fromAi: "AI answer · with sources",
    fallback: "AI is temporarily unavailable. Answer directly from profile knowledge.",
    limit: "The daily AI limit has been reached. Answer directly from profile knowledge.",
    disclosure: "Answers directly from profile knowledge. No external AI services.",
    disclosureAi:
      "Your question, short conversation history and relevant profile information are sent to OpenAI. Please do not share confidential information.",
    privacy: "Privacy",
    cleared: "Conversation cleared.",
  },
};
for (const chat of document.querySelectorAll("[data-profile-chat]")) {
  const language = chat.dataset.chatLanguage === "en" ? "en" : "de",
    t = translations[language];
  const form = chat.querySelector("[data-chat-form]"),
    input = chat.querySelector("[data-chat-question]"),
    send = chat.querySelector("[data-chat-send]"),
    thread = chat.querySelector("[data-chat-thread]"),
    status = chat.querySelector("[data-chat-status]"),
    error = chat.querySelector("[data-chat-error]"),
    disclosure = chat.querySelector("[data-chat-disclosure]");
  const welcome = chat.querySelector("[data-chat-welcome]").cloneNode(true);
  let history = [],
    busy = false,
    initialized = false,
    controller = null,
    ready = false;
  const setBusy = (value) => {
    busy = value;
    send.disabled = value || !initialized;
    input.disabled = !initialized;
    form.setAttribute("aria-busy", String(value));
    chat.querySelectorAll("[data-chat-prompt]").forEach((b) => (b.disabled = value));
  };
  function updateDisclosure() {
    disclosure.replaceChildren(
      document.createTextNode((ready ? t.disclosureAi : t.disclosure) + " "),
    );
    const link = document.createElement("a");
    link.href = "/datenschutz/#profilchat";
    link.textContent = t.privacy;
    if (language === "en") link.lang = "de";
    disclosure.append(link);
  }
  function message(role, text, sources = [], mode = "knowledge", reason = "") {
    chat.querySelector("[data-chat-welcome]")?.remove();
    const article = document.createElement("article");
    article.className = "fm-message fm-message-" + role;
    const label = document.createElement("span");
    label.className = "visuallyHidden";
    label.textContent = (role === "user" ? t.user : t.assistant) + ": ";
    article.append(label);
    const p = document.createElement("p");
    p.textContent = text;
    article.append(p);
    if (role !== "user") {
      const meta = document.createElement("p");
      meta.className = "fm-message-meta";
      meta.textContent =
        reason === "provider-unavailable"
          ? t.fallback
          : reason === "daily-limit"
            ? t.limit
            : mode === "ai"
              ? t.fromAi
              : t.fromKnowledge;
      article.append(meta);
      if (sources.length) {
        const links = document.createElement("div");
        links.className = "fm-sources";
        for (const source of sources) {
          if (
            !source ||
            typeof source.url !== "string" ||
            !/^\/(?!\/)/.test(source.url) ||
            typeof source.title !== "string"
          )
            continue;
          const a = document.createElement("a");
          a.href = source.url;
          a.textContent = t.source + source.title;
          links.append(a);
        }
        article.append(links);
      }
    }
    thread.append(article);
    thread.scrollTop = thread.scrollHeight;
  }
  async function initialize() {
    if (initialized) return;
    try {
      const r = await fetch("/api/frag-moritz.php?action=status", {
        cache: "no-store",
        credentials: "same-origin",
        signal: AbortSignal.timeout(8000),
      });
      if (!r.ok) throw Error();
      const data = await r.json();
      ready = data.ready === true;
      status.textContent = ready ? t.ai : t.knowledge;
      initialized = true;
      setBusy(false);
      updateDisclosure();
    } catch {
      error.textContent = t.failed;
      status.textContent = t.knowledge;
    }
  }
  async function ask(question) {
    if (busy) return;
    question = question.trim();
    if (!question) {
      error.textContent = t.empty;
      return;
    }
    if (!initialized) {
      await initialize();
      if (!initialized) return;
    }
    error.textContent = "";
    message("user", question);
    input.value = "";
    input.style.height = "44px";
    setBusy(true);
    status.textContent = t.loading;
    controller = new AbortController();
    const request = controller;
    const timeout = setTimeout(() => request.abort(), 26000);
    try {
      const r = await fetch("/api/frag-moritz.php?action=ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ question, language, history: history.slice(-6), allowAi: ready, }),
        signal: request.signal,
      });
      const data = await r.json();
      if (!r.ok) throw Error(typeof data.error === "string" ? data.error : t.failed);
      if (typeof data.answer !== "string" || !Array.isArray(data.sources)) throw Error(t.failed);
      if (request !== controller) return;
      message("assistant", data.answer, data.sources, data.mode, data.reason);
      if (typeof data.availableAi === 'boolean' && data.availableAi !== ready) { ready = data.availableAi; updateDisclosure(); }
        history.push(
        { role: "user", content: question },
        { role: "assistant", content: data.answer.slice(0, 1800) },
      );
      history = history.slice(-6);
    } catch (e) {
      if (request === controller && e.name !== "AbortError")
        error.textContent = e.message || t.failed;
      else if (request === controller) error.textContent = t.failed;
    } finally {
      clearTimeout(timeout);
      if (request === controller) {
        setBusy(false);
        status.textContent = ready ? t.ai : t.knowledge;
        controller = null;
      }
    }
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    ask(input.value);
  });
  chat.addEventListener("click", (event) => {
    const prompt = event.target.closest("[data-chat-prompt]");
    if (prompt) ask(prompt.textContent);
  });
  input.addEventListener("input", () => {
    input.style.height = "44px";
    input.style.height = Math.min(100, input.scrollHeight) + "px";
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      ask(input.value);
    }
  });
  chat.querySelector("[data-chat-reset]").addEventListener("click", () => {
    controller?.abort();
    controller = null;
    history = [];
    thread.replaceChildren(welcome.cloneNode(true));
    input.value = "";
    error.textContent = "";
    setBusy(false);
    status.textContent = t.cleared;
    input.focus({ preventScroll: true });
  });
  if (!chat.closest("[data-nav-panel]") || location.hash === "#chat") initialize();
  document.addEventListener("site-panel-change", (event) => {
    if (event.detail.id === "chat") initialize();
  });
}
