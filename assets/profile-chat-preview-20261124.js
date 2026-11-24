// Visual preview only. No requests, storage or external services.
for (const chat of document.querySelectorAll('[data-profile-chat]')) {
  chat.querySelector('[data-chat-form]').addEventListener('submit', event => event.preventDefault());
  chat.querySelectorAll('textarea, button').forEach(control => { control.disabled = true; });
}
