# Frag Moritz

## Zustand

Das Nachrichtenfenster ist in alle vier Startfassungen integriert. Es gibt außerdem /frag-moritz/ und die geschützte Verwaltung unter /frag-moritz/admin/. Fünf Navigationsbereiche: Start, Profil, Work, Chat, Kontakt.

Ohne aktivierte OpenAI-Anbindung antwortet der Chat direkt aus dem freigegebenen Profilwissen. Das wird im Fenster und an jeder Antwort angezeigt. Mit aktivierter Anbindung sucht der Server passende Fakten und übergibt sie zusammen mit der Frage und einem kurzen Verlauf an die OpenAI Responses API. Bei kleinen Wissensbasen erhält die KI alle freigegebenen Einträge innerhalb einer festen Kontextgrenze. Dadurch kann sie auch sinngemäße Fragen beantworten; bei größeren Beständen wird auf passende Treffer begrenzt. Es handelt sich um eine eigene Wissensbasis, nicht um neu trainierte Modellgewichte.

## Aktivierung durch den Kontoinhaber

1. Das API-Guthaben des berechtigten Pro-Abos gegebenenfalls in der ChatGPT-Abrechnung aktivieren und mit der richtigen API-Organisation verknüpfen. [Offizielle Bedingungen](https://help.openai.com/en/articles/20001626-api-credits-benefit-for-eligible-chatgpt-subscriptions).
2. Im passenden API-Projekt einen Schlüssel erstellen. [API-Schlüssel](https://platform.openai.com/api-keys).
3. Im Adminbereich unter KI-Anbindung den Schlüssel einsetzen, das Tageslimit prüfen und die KI aktivieren. Anschließend unter Testen eine Antwort kontrollieren.

Das Abo allein stellt keinen verwendbaren API-Schlüssel bereit. Zugangsdaten zur Verwaltung werden außerhalb dieses öffentlichen Repositorys verwahrt. API-Schlüssel gehören nicht in HTML, Browsercode, Git oder Chatnachrichten. Ein Schlüssel wird im Adminbereich nur entgegengenommen und danach nicht mehr ausgegeben.

## Wissen selbst pflegen

Unter Profilwissen lassen sich die 15 vorbereiteten Einträge bearbeiten, deaktivieren, ergänzen und als JSON exportieren oder importieren. Titel, Schlagwörter, deutsche und optional englische Informationen sowie eine Quellenseite im Portfolio sind vorgesehen. Änderungen werden erst mit Wissen speichern veröffentlicht. Die vorherige Fassung bleibt serverseitig erhalten. Der Testchat hilft beim Prüfen von Antworten und unbekannten Fragen. Besucher können das Wissen nicht verändern.

Neue Einträge sind zunächst nicht freigegeben. Ein Quellenlink muss innerhalb des Portfolios liegen. Wissen und verlinkte Profilseiten sollten inhaltlich übereinstimmen. Nur öffentlich beantwortbare Fakten hinterlegen. Es werden keine Gesprächsinhalte automatisch als neue Fakten übernommen.

## Technik und Schutz

- PHP 8.4, JSON-Dateien, mbstring und cURL; kein Datenbank- oder Modellserver nötig.
- Standardmodell GPT-6.1 Terra, Responses API, reasoning.effort none, maximal 650 Ausgabetokens und begrenzter Verlauf. Modellkonfiguration und Transport sind im Backend gekapselt.
- Maximal 50 Modellanfragen je UTC-Kalendertag voreingestellt, im Adminbereich 1 bis 200 einstellbar. Das ist eine Anfragenbegrenzung und kein Geldlimit. Fehlgeschlagene Provideranfragen zählen mit.
- Zusätzlich 20 Chatfragen je IP-Zeitfenster von zehn Minuten, begrenzte Anmeldeversuche und globale Grenzen. Zähler sind mit wechselnden Zeitfenstern und einem geheimen Schlüssel gehasht. Keine Klartext-IP-Speicherung durch die Chatfunktion.
- Adminzugriff mit Passwort-Hash, serverseitiger Sitzung, Secure/HttpOnly/SameSite-Cookie, Sitzungswechsel bei Anmeldung, Inaktivitätsablauf und CSRF-Token.
- Keine CORS-Freigabe, fremde Origins werden abgewiesen. Antworten werden als Text gerendert; Quellen werden serverseitig auf eigene Portfolio-Seiten begrenzt.
- Modellantworten verwenden ein striktes Schema. Unbekannte Quellen, unvollständige Antworten und ungültige Ausgaben werden verworfen. Keine externen Tools oder Aktionen für das Modell.
- Wissenseinträge, Schlüssel, Passwort-Hash und Zähler liegen im privaten Nachbarverzeichnis .frag-moritz außerhalb von dist/. Statische Deployments ersetzen sie nicht. Der öffentliche JSON-Seed enthält ausschließlich bereits freigegebene Profilfakten.
- Die Chatfunktion speichert keine Gesprächsinhalte auf dem Server. Der Browser hält den Verlauf nur im Arbeitsspeicher. store:false deaktiviert die API-Antwortspeicherung; etwaige Sicherheitsprotokolle des Anbieters sind davon unabhängig. Der Datenschutzhinweis beschreibt die Übertragung.

## Veröffentlichungsablauf

Quellcode prüfen, committen, nach GitHub pushen und denselben Build mit dem vorhandenen Portfolio-Deploywerkzeug veröffentlichen. Alle Dateien werden vor Aktivierung per Serverhash geprüft. Statische Dateien werden zusätzlich per HTTP-Hash verglichen. Die in site-files.json deklarierten PHP-Endpunkte werden auf JSON-Gesundheitsantwort beziehungsweise Zugriffssperre geprüft. PHP-Quelltext darf nicht als HTTP-Ausgabe verglichen werden.

## Prüfgrenzen

Die PHP-Sicherheitstests sind unter scripts/test-profile-chat.php reproduzierbar und verwenden isolierte Testdaten. Browserprüfungen umfassen echte lokale PHP-Endpunkte, Wissenspflege, Zugriffsschutz, Englisch, kleine Bildschirme, Tastatur und automatische Barrierefreiheitsregeln. Es wurden keine kostenpflichtigen OpenAI-Aufrufe ohne konfigurierten Schlüssel ausgelöst. Die echte Modellanbindung und das Guthaben des Kontoinhabers sind erst nach Aktivierung mit einer echten Anfrage überprüfbar. Automatische Barrierefreiheitsprüfungen ersetzen keinen vollständigen Screenreader- und Realgerätetest.
