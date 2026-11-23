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
