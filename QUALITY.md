# Qualitätsprüfung · 23.11.2026

## Umgesetzte Änderungen

- Alle zwölf Finder-Ordner sind echte, benannte Links und öffnen ihre externe Website mit einem Klick in einem neuen Tab. Suche, Pfeiltasten und Symbol-/Listenansicht bleiben erhalten. Der frühere Zwischenschritt entfällt.
- Drei eigene Projektberichte mit belegten Beiträgen aus dem vorhandenen Lebenslauf: Lekkerland Karriere, Eisberg, Starke Periode. Eigene Seitenadressen, Metadaten und strukturierte Daten; keine erfundenen Ergebniskennzahlen.
- Kontrastkorrekturen in hellen und dunklen Zuständen, einschließlich Fensterleisten, Navigation, Lebenslaufrollen, Kompetenz-Link und rechtlicher Links. Alte Überblendungseffekte bei Footertexten entfernt.
- Tastatur-Sprunglink ins aktive Fenster. Fokus nach geöffneten längeren Notizen bleibt oberhalb des mobilen Docks sichtbar. Systemseitige Bewegungsreduktion und Forced Colors berücksichtigt.
- Ohne JavaScript sind die redaktionellen Seiten über eine Alternativnavigation erreichbar. Projektberichte funktionieren als normale HTML-Seiten.
- Sitemap, Inhaltsverlinkung, llms.txt und Projekt-Weiterleitungen aktualisiert. Fehlerseiten-Metadaten bereinigt; 404 bleibt noindex.

## Durchgeführte Prüfung

- 262 Browserprüfungen in Chrome/Playwright, keine Fehler. Bildschirmbreiten 320, 390, 600, 601, 768, 1199, 1200, 1440 und 1920 CSS-Pixel. Auch 320 Pixel als Reflow-Prüfung für eine stark vergrößerte Desktopansicht.
- Deutsche, englische und vereinfachte Startfassungen; Finder-Direktöffnung, Suche, Listenansicht, Lebenslaufstationen, Kompetenzbereiche, Tastatur-Sprunglink, Pfeiltasten, Fokusfreiheit gegenüber dem Dock, kein horizontaler Überlauf.
- axe-core 4.14.1: 51 geprüfte Seiten-/Interaktionszustände ohne automatisch gemeldete Verstöße. Ausgewählte Regeln aus WCAG A/AA (2.0, 2.1, 2.2) und Best Practices. Enthalten sind Hauptfenster in hell/dunkel, mobile/desktop, geöffnete Menüs, drei geöffnete Kompetenzbereiche, Lebenslaufstationen sowie neun redaktionelle Seiten.
- Browserprüfung mit deaktiviertem JavaScript und aktiviertem Forced-Colors-Modus. Sichtprüfung der mobilen und Desktopansicht und der neuen Projektberichte.
- Regulärer statischer Build, Ressourcen-/Hashprüfung und Git-Whitespaceprüfung gehören zum Veröffentlichungsablauf.

## Grenzen

Das ist keine vollständige WCAG-Konformitätsprüfung. Automatische Prüfungen können nicht alle Kontrast-, Inhalts- oder Bedienungsfragen entscheiden. Ein vollständiger manueller Test mit NVDA/VoiceOver und auf realen iOS-/Android-Geräten steht noch aus. Die 320-Pixel-Prüfung ersetzt keinen vollständigen Test aller Browser bei 400 Prozent Zoom.

Es wurden keine Core-Web-Vitals-Felddaten, Rankingveränderungen oder Erwähnungen in KI-Antworten gemessen. Strukturierte Daten und llms.txt garantieren weder Indexierung noch Sichtbarkeit. Die bestehenden Profilverknüpfungen und die vCard wurden auf Konsistenz geprüft; externe Profile wurden nicht bearbeitet.

## Referenzen

- [Google: Links crawlbar gestalten](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [Google: KI-Funktionen und Websites](https://developers.google.com/search/docs/appearance/ai-features)
- [Google: ProfilePage](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- [W3C: Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum/)

## Ergänzung: Frag Moritz · 23.11.2026

- 203 Browser-/API-Prüfungen für Chat, fünf Fenster, mobile Ansichten, echte PHP-Endpunkte, Anmeldung, CSRF, fremde Origins, Wissensänderungen und unbekannte Fragen ohne Fehler.
- 35 isolierte PHP-Tests für Suche, englische Fragen, Kontextbegrenzung, sichere Quellen, Antwortschema und Anfragegrenzen ohne Fehler. Reproduzierbar unter scripts/test-profile-chat.php.
- 14 zusätzliche axe-Prüfzustände des Chats und der Verwaltung ohne automatisch gemeldete Verstöße.
- Kein OpenAI-API-Schlüssel eingerichtet; eine echte Modellantwort und das Pro-API-Guthaben sind deshalb noch nicht verifiziert. Ohne Schlüssel ist der klar gekennzeichnete Profilwissen-Modus aktiv.
- Die lokale Vorschau nutzt dieselbe PHP-Version wie IONOS (8.4.28). Die portable Testlaufzeit und private Zugangsdaten werden nicht veröffentlicht.

## Kostenregel · 24.11.2026

Externe KI ist im Backend unveränderlich durch Konfiguration gesperrt; der Providertransport wurde entfernt. Auch Admin-Tests bleiben im lokalen Profilwissen-Modus. Es werden keine API-Schlüssel benötigt und keine zusätzlichen kostenpflichtigen Dienste aktiviert.

Current public release: visual chat preview only. No backend files or admin pages are published. Input, starter questions and send controls remain disabled; no requests are sent. API integration is a later, separately verified step. Preserve the unpublished backend source for that step.

2026-11-26: minimal native PHP runtime check at /api/runtime-check.php. Reports only version and feature booleans; no secrets, personal data, external requests or API charges. Chat remains an inactive visual preview. Do not deploy the former API handler override or CGI wrapper.

2026-11-26 internal-test exception authorized by owner: approved-profile.json (private storage, approved records only) is the sole chat knowledge source. Authenticated administrators may test gpt-6-luna via Responses with store:false, no tools, bounded history/output and hard request limits using the Pro credit grant only. Public AI remains hard-disabled (VM_PUBLIC_ENABLED=false); do not enable public access or add payment methods/auto-recharge without a new explicit instruction. No CGI or PHP-handler overrides. Preserve secrets and knowledge outside dist and GitHub. Current internal implementation: api/vollmair.php and vollmair-core.php. Earlier frag-moritz backend remains unpublished.

2026-11-26: owner additionally approved the published website career and project information. Private knowledge now includes the CV, twelve project names and the three published contribution reports; live/source hashes were compared before ingestion. Keep paraphrasing natural and grammatically correct, distinguish past/current roles and individual contributions from entire projects. Do not infer roles for projects with only a name. Show only fixed own-site source links. Public AI remains disabled.

2026-11-27 public-release preparation only: production VM_PUBLIC_ENABLED stays false, and private public_enabled/ai_enabled plus publicActivationApproved must also all be true before public access is possible. A cli-server-only VOLLMAIR_TEST_PUBLIC=1 switch allows local public-flow testing with dummy credentials. Starting the prepared public chat establishes a session without making a model request. Public visitors are limited to 6 questions per fixed 10-minute window/IP; the shared UTC-day cap remains 50 requests including internal tests. No automatic retries or recharge. Keep public activation pending explicit final owner approval.
