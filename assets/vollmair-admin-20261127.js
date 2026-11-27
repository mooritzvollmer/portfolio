const form = document.querySelector("#vm-login"),
  password = document.querySelector("#vm-password"),
  button = form.querySelector("button"),
  error = document.querySelector("#vm-error"),
  panel = document.querySelector("#vm-signed-in"),
  logout = document.querySelector("#vm-logout");
let csrf = null;
async function state() {
  const r = await fetch("/api/vollmair.php?action=admin-state", {
    cache: "no-store",
    credentials: "same-origin",
  });
  if (!r.ok) throw Error("Die Anmeldung ist gerade nicht erreichbar.");
  const data = await r.json();
  csrf = data.csrf;
  const visibility = document.querySelector("[data-vm-visibility]");
  if (visibility)
    visibility.textContent = data.publicEnabled
      ? "Du bist angemeldet. Der Chat ist öffentlich freigegeben."
      : "Du bist angemeldet. Die öffentliche KI bleibt gesperrt; Du kannst den internen Chat testen.";
  form.hidden = data.authenticated === true;
  panel.hidden = data.authenticated !== true;
}
async function post(action, body) {
  const r = await fetch("/api/vollmair.php?action=" + action, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", "X-CSRF-Token": csrf },
    body: JSON.stringify(body),
  });
  const data = await r.json();
  if (!r.ok) throw Error(data.error || "Bitte versuche es später erneut.");
}
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  button.disabled = true;
  error.textContent = "";
  try {
    if (!csrf) await state();
    await post("login", { password: password.value });
    password.value = "";
    await state();
    document.querySelector("#vm-open-chat").focus();
  } catch (e) {
    error.textContent = e.message;
  } finally {
    button.disabled = false;
  }
});
logout.addEventListener("click", async () => {
  logout.disabled = true;
  error.textContent = "";
  try {
    await post("logout", {});
    await state();
    password.focus();
  } catch (e) {
    error.textContent = e.message;
  } finally {
    logout.disabled = false;
  }
});
state().catch((e) => {
  error.textContent = e.message;
});
