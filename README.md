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

Auf der Startseite wird kein Foto gezeigt. /ueber-mich/ nutzt die weiter gefasste Aufnahme. Beide stammen aus den vom Inhaber bereitgestellten Fotos. Responsive WebP-Varianten und JPEG-Fallbacks werden lokal ausgeliefert; die Originaldateien und ihre Metadaten werden nicht veröffentlicht. Zusätzliche Darstellung ausschließlich in assets/portrait-20261118.css. Der Ausschnitt im bestehenden Startseiten-Platz ist per object-position auf das Gesicht abgestimmt.

## Hauptbereiche als Fenster

Start, Über mich und Kontakt liegen auf dem Desktop in drei versetzten Programmfenstern. Aktive Fenster kommen mit einer räumlichen Transition nach vorn. Die ursprüngliche Navigation, URL-Hashes, Pfeile und Kontakticons bleiben erhalten. Zusätzlich können die hinteren Fensterleisten und die Bereichsauswahl genutzt werden. Mobil und auf schmalen Tablets wird eine einzelne Lesefläche mit kompakter Bereichsauswahl und horizontalem Übergang verwendet. Die Startseite enthält auf ausdrücklichen Wunsch kein Foto. Die Profilseite bleibt unverändert.

Ergänzende Darstellung und Interaktion in assets/desktop-windows-20261118.css und .js. Die alte Navigation bleibt für Abschnittsstatus und History zuständig; das neue Modul synchronisiert Fenster, ARIA und mobile Höhen nach dem Ereignis site-panel-change. Bewegungsreduktion wird respektiert.

## Fensterverfeinerung

Der große Titel bleibt in allen Bereichen vollständig sichtbar. Die Fenster haben individuelle Abmessungen, leicht versetzte Positionen und unterschiedliche Gestaltung: Browser (Start), warmes Profil-Dokument (Über mich), Mail-Fenster (Kontakt). Desktopwechsel nutzen eine unterbrechbare Animation mit kurzem Anheben und sanftem Einfedern. Mobile Darstellung und Bewegungsreduktion bleiben erhalten. Ergänzungen in desktop-windows-20261118b.css und .js; die ältere Version ist nicht mehr in den Startseiten eingebunden. Hintere Titelleisten sind anklickbar; nur der Inhalt inaktiver Fenster wird inert geschaltet.

Die Fenster sind auf ausdrücklichen Wunsch gerade ausgerichtet, auch während des Wechsels. Überlappung, individuelle Größen, Positionen und das federnde Anheben bleiben erhalten. Aktuelle Styles: desktop-windows-20261118c.css.

## Interaktionszustände

Korrigierte Hover- und Fokusfarben des Arbeitgeberlinks, zentrierte Menüpunkte und stabile Link-Unterstreichungen. Im geöffneten mobilen Menü sind die darunterliegenden Hauptinhalte und Kontakticons inert; der Tastaturfokus bleibt im Menü und kehrt bei Escape zum Schalter zurück. Aktuelle Styles: desktop-windows-20261118d.css. Ergänzende Menüzustände: interaction-states-20261118.js. Zusätzliche Design-/Codefenster sind nur als Konzept besprochen, noch nicht Bestandteil dieser Veröffentlichung.

## Zusätzliche Mac-Fenster

Über mich verwendet eine Notizen-Ansicht mit Profil und Werdegang. Von dort öffnen sich native modale Dialoge für Bildstudio und Code. Bildstudio: Zoom, Ausschnittwahl, Auswahlrahmen, Ebenen und Arbeitsflächenfarbe. Code: drei Quelldateien, Zeilennummern, Syntaxfarben, Kopieren und tatsächlich bedienbare Vorschau. Der angezeigte JavaScript-Ausschnitt ist die tatsächlich genutzte Vorschaufunktion. Kontakt übernimmt eine Apple-Mail-inspirierte Werkzeugleiste mit echten Mail-/Kopier-/vCard-Aktionen. Mobil sind die Zusatzfenster Vollbildansichten mit Zurück. Escape, Fokus-Rückgabe und unterbundene Hintergrund-Swipe-Steuerung sind berücksichtigt. Die bisherigen drei Hauptbereiche und das Browser-Startfenster bleiben erhalten.

Bildstudio und Codeansicht sind als optionale Anhänge im kompakten Menü der Notizen-Werkzeugleiste erreichbar. Im Profiltext gibt es keine hervorgehobenen Startkacheln mehr. Nach dem Schließen kehrt der Fokus zum sichtbaren Anhänge-Schalter zurück.

Die drei Hauptfenster richten ihre Höhe am tatsächlichen Dokumentinhalt aus. Die maximale Desktophöhe bleibt auf den vorhandenen Bühnenbereich begrenzt; längere Inhalte scrollen innerhalb des Fensters. Hintergrundfenster werden auf die aktive Höhe begrenzt, die Bereichsauswahl folgt dem Fensterrand. Mobil bleibt die natürliche Dokumenthöhe erhalten.

Die Desktopfenster berücksichtigen den tatsächlich verbleibenden Platz bis zur Bereichsauswahl und zum unteren Rahmen. Im Kontaktfenster bleiben Werkzeugleiste und Adresszeilen stehen; nur der Nachrichtentext scrollt bei Platzmangel. Deutsche Navigation und Profilüberschriften heißen Profil bzw. Erfahrung. Bestehende URLs bleiben bestehen.
