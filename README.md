# Portfolio · Moritz Vollmer

Persönliche Website unter https://moritzvollmer.de/.

Positionierung: **Digital Strategist – Design. Technik. Sichtbarkeit.**
Die aktuelle berufliche Position bleibt davon getrennt: SEO & GEO Manager bei Hottgenroth Software AG, seit Oktober 2026.

## Aktuelle Arbeitsfassung

Die Website basiert auf dem am 26.10.2026 gesicherten Live-Build. Die neuere ursprüngliche SCSS-/JavaScript-Quelle ist weiterhin nicht verfügbar. Die alten Dateien in src/, public/, main.js und die Vite-Konfiguration bleiben erhalten und dürfen die aktuelle Website nicht ersetzen.

Die überarbeiteten Seiten vom 17.11.2026 sind direkt editierbares HTML. Ihr gemeinsames Design und Verhalten liegen in assets/strategist-20261117.css und assets/strategist-20261117.js. Dateinamen von geänderten Assets bei künftigen Veröffentlichungen versionieren: IONOS liefert sie mit langfristigem Cache aus.

## Seiten und Inhalte

- Startseite: Positionierung, drei Perspektiven, Arbeitsweise und eine kleine Auswahl eigener Tools.
- /ueber-mich/: kompakter Werdegang, fachliches Profil und Qualifikationen.
- /arbeitsweise/: Vorgehen und typische Fragestellungen; keine erfundenen Kundenresultate.
- /seo-geo/: vertiefender Blick auf organische Sichtbarkeit.
- /kontakt/: E-Mail, LinkedIn, GitHub und vCard.
- /en/, /leicht/ und /en/easy/: englische bzw. vereinfachte Fassungen. Die vereinfachten Texte sind keine zertifizierte Leichte Sprache.
- /kompetenzen/ und /projekte/: bestehende Adressen mit dem gleichen Design und aktualisierten Inhalten.
- /404.html: Fehlerseite, über Apache mit HTTP 404 ausgeliefert.

Das Original-Favicon, die Moritzfontmer-Wortmarke, die animierte Namensunterstreichung und die dezenten Kontakticons oberhalb der Fortschrittsanzeige bleiben erhalten. Die Bildmarkenfläche oberhalb des Einleitungstextes kann später durch ein echtes Porträt ersetzt werden. Sie hat dieselbe Breite wie der Text; mobil folgt sie auf die Überschrift. Es liegt noch kein echtes Porträt vor.

## Lokal arbeiten

Node.js ab Version 20 genügt. Keine Installation von Abhängigkeiten erforderlich.

    npm run dev
    npm run build
    npm run check
    npm run preview

Der lokale Server läuft auf http://127.0.0.1:5173/ und liefert nur Dateien aus site-files.json. Der Build kopiert dieselben Dateien nach dist/. Neue veröffentlichte Dateien immer in die Liste aufnehmen.

## Veröffentlichen

1. Lokal umsetzen, Build und Prüfung abschließen.
2. Änderungen auf main committen und pushen; GitHub-Commit vergleichen.
3. Den identischen dist/-Build mit dem bestehenden Werkzeuge/Deploy-Portfolio.ps1 veröffentlichen.
4. Hashes und HTTP-Auslieferung prüfen; Deployment-Datensatz aktualisieren.

Das Deploymentwerkzeug liegt außerhalb dieses Repositorys im lokalen Arbeitsbereich. Es schützt den vorherigen Live-Stand und ersetzt ausschließlich das bestätigte Portfolio-Ziel. Zugangsdaten und Schlüssel gehören nicht ins Repository.

## Eigenständiger Code-Formatierer

Die bestehende Route /code-formatierer/ bleibt technisch erhalten, ist aber kein Bestandteil der Profilnavigation. Sie enthält lokal ausgeliefertes Prettier 3.10.1 mit MIT-Lizenz und formatiert Code im Browser-Worker. Eine spätere eigenständige Veröffentlichung des Tools ist separat vorbereitet; sie wird durch dieses Portfolio-Update nicht vorweggenommen.
