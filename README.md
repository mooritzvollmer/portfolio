# Portfolio · Moritz Vollmer

Aktueller Stand von [moritzvollmer.de](https://moritzvollmer.de/) mit der Positionierung **SEO & GEO Manager**.

## Stand dieser Kopie

Am 26.10.2026 wurde die bei IONOS ausgelieferte Version übernommen. Zuvor enthielten GitHub und die lokale Kopie denselben älteren Stand vom 15.09.2026.

Die übernommene Live-Version ist die Basis dieser Arbeitsfassung. Seitdem wurde das persönliche Profil lokal vereinfacht: Start, Über mich und Kontakt; Skills- und Projektübersichten sind aus der Startseite entfernt. Die eigenständigen Unterseiten bleiben erhalten. Alle Website-Dateien stehen in `site-files.json`. Weiterentwicklungen werden nach lokaler Prüfung zuerst auf GitHub übertragen und anschließend auf IONOS veröffentlicht.

**Wichtig:** Die neueren ursprünglichen JavaScript-/SCSS-Quelldateien befinden sich auf einem momentan nicht zugänglichen Rechner. Deshalb ist dies eine wiederhergestellte statische Arbeitsfassung aus dem Live-Build. Die Dateien unter `src/`, `main.js`, `public/` und die bisherige Vite-Konfiguration bleiben als älterer Quellstand erhalten; sie erzeugen die aktuelle Version noch nicht. Die aktuellen CSS- und JavaScript-Dateien unter `assets/` sind bereits gebündelt.

## Lokal starten

Node.js ab Version 20 genügt. Für diese statische Arbeitsfassung müssen keine npm-Abhängigkeiten installiert werden.

```sh
npm run dev
```

Anschließend `http://127.0.0.1:5173/` öffnen. HTML-Änderungen erscheinen nach Neuladen. Der lokale Server liefert ausschließlich die freigegebenen Website-Dateien aus; private Repository- und Konfigurationsdateien werden nicht bereitgestellt.

## Build und Prüfung

```sh
npm run build
npm run check
npm run preview
```

Der Build kopiert die in `site-files.json` aufgeführten Dateien unverändert nach `dist/`. Die Prüfung kontrolliert die Dateien, lokale HTML-/CSS-Ressourcen und die Übereinstimmung des Builds. Neue oder entfernte Website-Dateien auch in der Dateiliste berücksichtigen.

## Später die neueren Quellen übernehmen

Sobald der andere Rechner verfügbar ist, dessen HTML-, JavaScript- und SCSS-Quellen zusätzlich sichern, mit diesem Stand abgleichen und den ursprünglichen Vite-Build wieder aktivieren. Den älteren `src/`-Stand nicht unbesehen über die aktuelle Website deployen. Die bisherige Build-Variante ist unter `npm run build:legacy` verfügbar und schreibt getrennt nach `dist-legacy/`.

## Deployment

Dieser Abgleich hat die Live-Website nicht verändert. Das vorhandene Deploy-Skript bleibt erhalten. Es nutzt `DEPLOY_TARGET` und `rsync`; vor einem Deployment Zielpfad und Übertragungsumfang mit dem Dry Run prüfen. Unter Windows steht `rsync` nicht automatisch zur Verfügung; alternativ den geprüften `dist/`-Stand per SFTP übertragen.

Zugangsdaten und private SSH-Schlüssel gehören nicht in das Repository.

## Digitale Visitenkarte

Die Startseite bietet direkte Kontaktaktionen und eine speicherbare vCard. Auf Mobilgeraeten sind die Abstaende reduziert; der berufliche Hintergrund und fruehere Stationen sind einklappbar. Weitere priorisierte Empfehlungen stehen unter [docs/SEO-Empfehlungen.md](docs/SEO-Empfehlungen.md).
