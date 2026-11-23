# Portfolio · Moritz Vollmer

Persönliche Website: https://moritzvollmer.de/

## Aktuelle Ausrichtung

Digital Strategist – **Design, Technik, Sichtbarkeit**. Beruflich seit Oktober 2026 SEO & GEO Manager bei Hottgenroth Software AG. Die Website präsentiert Profil, Erfahrung, konkrete Kompetenzen und bisherige Frontend-Website-Projekte. Eigene Webtools werden hier nicht vorgestellt.

Die ursprüngliche Bildmarke, Moritzfontmer, animierte Namensunterstreichung, Farbwelt und Mac-Optik bleiben erhalten. Kein Foto auf Start, ein kleines Porträt im Profil. Keine Bildeditor- oder Code-Demofenster.

## Aufbau

Vier Fenster: Start, Profil (Notizen), Work (Finder), Kontakt (Mail). In Notizen stehen Mein Profil, Erfahrung und Kompetenzen als drei Tabs. Die Kompetenzbereiche Design, Technik, Sichtbarkeit enthalten konkrete Sprachen, Tools und Themen. Erfahrung zeigt einzelne Arbeitgeberstationen und Rollen.

Work enthält genau die zwölf ursprünglichen externen Frontend-Website-Referenzen. Ein Klick auf einen Ordner öffnet die Website direkt in einem neuen Tab. Suche und Symbol-/Listenansicht bleiben erhalten; es gibt keinen Auswahl- oder Bestätigungsschritt.

/projekte/ bietet drei eigene, sachliche Projektberichte: Lekkerland Karriere, Eisberg und Starke Periode. Sie beschreiben belegte Beiträge im Projektteam, keine erfundenen Kennzahlen. Der Bericht-Link steht separat im Finder-Fuß. Die frühere Weiterleitung von /projekte/ wurde entfernt. /lebenslauf/ führt zum Erfahrungsabschnitt von /ueber-mich/.

Weitere redaktionelle Seiten: /ueber-mich/, /kompetenzen/, /arbeitsweise/, /seo-geo/, /kontakt/. Englische und vereinfachte Startfassungen bleiben erhalten. Projektberichte sind deutsch und werden in englischen Fassungen entsprechend gekennzeichnet.

## Responsive und Bedienung

Ab 1200 CSS-Pixeln gerade, überlappende Desktopfenster. Darunter eine einzelne App-Fläche mit festem unterem Dock und natürlichem Dokumentfluss. Notizen wechseln bei 600 Pixeln zwischen horizontalen Tabs und Seitenleiste. Kontakticons und rechtliche Links bleiben mobil im Dokumentfluss. Sichere Bildschirmränder werden berücksichtigt.

Systemseitig reduzierte Bewegung wird respektiert. Tastaturfokus bleibt sichtbar; ein Sprunglink führt in das aktive Fenster. Ohne JavaScript steht eine Navigation zu den eigenständigen Inhaltsseiten bereit. Gezielt korrigierte gemeinsame Regeln liegen in assets/portfolio-quality-20261123.css und .js, direkte Finderlinks in assets/project-links-20261123.js.

## Statische Arbeitsfassung

Dies ist eine aus dem Live-Build gesicherte statische Fassung. Die neuere ursprüngliche SCSS-/JavaScript-Quelle ist derzeit nicht verfügbar. **src/, public/, main.js und die alte Vite-Konfiguration nicht anstelle dieser Fassung bauen oder veröffentlichen.**

Veröffentlichte Dateien stehen in site-files.json. HTML wird direkt bearbeitet; gemeinsame Styles und Verhalten liegen in assets/. Bei Änderungen an langfristig gecachten Assets neue Dateinamen verwenden. Alte nicht eingebundene Assets sind kein Hinweis auf den aktuellen Seitenaufbau.

## Lokal prüfen

Node.js ab Version 20, keine Installation von Abhängigkeiten nötig.

    npm run dev
    npm run build
    npm run check
    npm run preview

Der lokale Server läuft auf http://127.0.0.1:5173/. Der Build kopiert ausschließlich die Manifestdateien nach dist/. Die separat erhaltene Route /code-formatierer/ ist kein Bestandteil des persönlichen Work-Fensters.

## Veröffentlichung

Lokal prüfen, auf main committen und pushen, GitHub-Commit abgleichen, anschließend genau denselben Build mit Werkzeuge/Deploy-Portfolio.ps1 auf das bestehende IONOS-Ziel übertragen. Der Ablauf sichert den vorherigen Live-Stand und prüft Datei- sowie HTTP-Hashes. Keine Zugangsdaten, Schlüssel, privaten Backups oder lokalen Prüfwerkzeuge committen.

Details zu Prüfung und Grenzen: [QUALITY.md](QUALITY.md).
