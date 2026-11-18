# Portfolio · Moritz Vollmer

Persönliche Website: https://moritzvollmer.de/

## Positionierung und Aufbau

Digital Strategist – Design, Technik und Sichtbarkeit. Die aktuelle berufliche Stelle bleibt SEO & GEO Manager bei Hottgenroth Software AG.

Das ursprüngliche Design und Setup sind die verbindliche Basis: animierter Hintergrund, Rahmen, schwebende Navigation, Moritzfontmer, Light-/Dark- und Schriftwahl sowie die drei Bereiche Start, Über mich und Kontakt. Die Ausrichtung wurde am 18.11.2026 inhaltlich angepasst, ohne daraus eine neue Landingpage zu machen. Künftige Änderungen am Seitenaufbau und visuellen Konzept nur auf ausdrücklichen Wunsch.

Die dezenten Kontakticons oberhalb der Sektionsanzeige, die animierte Unterstreichung des Namens und der Porträtplatz bleiben unverändert. Die bereitgestellten Profilfotos sind eingebunden. Der Platz hat dieselbe Breite wie der Einleitungstext; mobil steht er unter der Headline und vor dem Text.

Die Unterseiten behalten den vorhandenen gemeinsamen Rahmen. /arbeitsweise/ vertieft das Profil innerhalb desselben Designs. Englische und vereinfachte Versionen folgen dem gleichen Drei-Bereiche-Aufbau.

## Statische Arbeitsfassung

Die Basis wurde am 26.10.2026 aus dem Live-Build gesichert. Die neuere ursprüngliche SCSS-/JavaScript-Quelle ist nicht verfügbar. src/, public/, main.js und die alte Vite-Konfiguration sind kein Ersatz für die aktuelle Arbeitsfassung.

Veröffentlichte Dateien stehen in site-files.json. HTML direkt bearbeiten; gemeinsame Styles und Verhalten liegen in assets/. Das ursprüngliche Stylesheet digital-card-7a51acda.css und die vorhandenen Navigationsskripte bleiben die Designbasis. Die Dateien strategist-20261117.css und strategist-20261117.js aus dem verworfenen Umbau werden nicht mehr ausgeliefert oder eingebunden.

## Lokal arbeiten

Node.js ab Version 20 genügt. Keine Installation von Abhängigkeiten erforderlich.

    npm run dev
    npm run build
    npm run check
    npm run preview

Der lokale Server läuft auf http://127.0.0.1:5173/. Neue veröffentlichte Dateien in site-files.json aufnehmen. Der Build kopiert genau diese Dateien nach dist/.

## Veröffentlichung

Lokal prüfen, auf main committen und pushen, GitHub-Commit vergleichen. Anschließend denselben Build mit dem bestehenden lokalen Werkzeuge/Deploy-Portfolio.ps1 nach IONOS übertragen. Das Werkzeug sichert den vorherigen Stand und prüft Dateihashes und HTTP-Auslieferung. Nur das bestätigte Portfolio-Ziel ändern. Zugangsdaten und Schlüssel niemals committen.

Die bestehende Route /code-formatierer/ bleibt technisch erhalten; die separate Veröffentlichung des Tools ist ein eigener Arbeitsschritt.

## Detailseiten vom 18.11.2026

Die Startseite und ihre Bedienung bleiben unverändert. Die Inhaltsseiten verwenden eine offene Lesestruktur mit seitlichem Inhaltsverzeichnis, nummerierten Abschnitten und einer aufklappbaren beruflichen Chronologie. Die zusätzlichen Styles liegen ausschließlich in assets/profile-detail-20261118.css und greifen nur auf .profile-editorial. Die ursprüngliche Farbwelt, Bildmarke, Moritzfontmer und schwebende Navigation bleiben erhalten.

Werkzeuge werden im persönlichen Profil vorerst nicht vorgestellt oder verlinkt. /projekte/ leitet vorübergehend mit HTTP 302 auf /ueber-mich/ weiter; die eigenständigen Projekte selbst werden dadurch nicht verändert.

## Profilfotos

Die Startseite nutzt das nahe Porträt, /ueber-mich/ die weiter gefasste Aufnahme. Beide stammen aus den vom Inhaber bereitgestellten Fotos. Responsive WebP-Varianten und JPEG-Fallbacks werden lokal ausgeliefert; die Originaldateien und ihre Metadaten werden nicht veröffentlicht. Zusätzliche Darstellung ausschließlich in assets/portrait-20261118.css. Der Ausschnitt im bestehenden Startseiten-Platz ist per object-position auf das Gesicht abgestimmt.
