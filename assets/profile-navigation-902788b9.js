// Keep older section links usable after simplifying the personal profile.
function normalizeProfileHash() {
  if (['#skills', '#work'].includes(window.location.hash)) {
    const url = new URL(window.location.href)
    url.hash = 'about'
    window.history.replaceState(null, '', url)
  }
}
normalizeProfileHash()
window.addEventListener('hashchange', normalizeProfileHash)
