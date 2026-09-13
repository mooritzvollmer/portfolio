# Portfolio · Moritz Vollmer

Persönliches Portfolio von [Moritz Vollmer](https://moritzvollmer.de/) mit Schwerpunkt auf Frontend- und WordPress-Entwicklung, Accessibility, technischer SEO und nachhaltiger Webentwicklung.

**Live:** [moritzvollmer.de](https://moritzvollmer.de/)

## Technische Basis

- semantisches HTML und progressive Verbesserung
- JavaScript ohne UI-Framework
- SCSS und Vite
- mehrsprachige sowie barrierearme Varianten
- strukturierte Daten, Canonicals und Sitemaps
- eigene statische Qualitätschecks für SEO und Accessibility

## Lokal starten

```sh
npm install
npm run dev
npm run build
npm run preview
```

Die vollständige Prüfung läuft mit `npm run check`.

## Deployment

Das Ziel wird ausschließlich lokal über `DEPLOY_TARGET` übergeben. Zugangsdaten gehören nicht in das Repository.

```sh
DEPLOY_TARGET="user@example.com:/absolute/path/to/webroot/" npm run deploy:dry
DEPLOY_TARGET="user@example.com:/absolute/path/to/webroot/" npm run deploy
```
