# Frag Moritz – Betrieb ohne externe KI

Der Chat im Nachrichtenfenster beantwortet Fragen aus 15 freigegebenen Profil-Einträgen. Es ist kein Sprachmodell aktiv. Unbekannte Informationen werden nicht erfunden. Antworten und Quellen stammen aus der eigenen Wissensbasis.

## Kostenregel

Externe KI-Aufrufe sind im Backend fest gesperrt. Konfiguration, Besuchereingaben und Admin-Tests können sie nicht aktivieren. Der Netzwerktransport zum Modellanbieter ist entfernt. Es gibt keine API-Schlüssel-Eingabe und keine Aktivierung kostenpflichtiger Dienste. Die App läuft im vorhandenen IONOS-Webhosting; es wird kein zusätzlicher Hostingvertrag eingerichtet.

## Verwaltung

Unter /frag-moritz/admin/ lassen sich Einträge bearbeiten, deaktivieren, ergänzen und als JSON importieren oder exportieren. Erst Wissen speichern veröffentlicht Änderungen. Die vorherige Fassung bleibt serverseitig erhalten. Unter Testen kannst Du Antworten prüfen. Private Anmeldedaten werden außerhalb dieses öffentlichen Repositorys verwahrt.

## Technik

PHP 8.4 wird für die API über einen expliziten CGI-Einstieg ausgeführt, weil die bestehende Domain eine ältere PHP-Zuordnung verwendet. CGI-Dateien benötigen LF-Zeilenenden und Ausführungsrechte; beides ist im Repository und Deploywerkzeug berücksichtigt. Alle dynamischen Endpunkte werden bei der Veröffentlichung zusätzlich per HTTP überprüft.

Die Verwaltung ist durch Passwort-Hash, sichere Sitzung, CSRF-Token, Origin-Prüfung und Anmeldegrenzen geschützt. Wissensdateien liegen außerhalb von dist/. Gesprächsinhalte werden nicht serverseitig gespeichert. Flüchtiger Chatverlauf bleibt nur im Browser.

Die reinen Hilfsfunktionen zur Aufbereitung strukturierter Antworten sind nicht mit einem aktiven Modell verbunden. Die Wiedereinführung eines externen Dienstes würde eine ausdrückliche neue Entscheidung und Codeänderung erfordern.

Current public release: visual chat preview only. No backend files or admin pages are published. Input, starter questions and send controls remain disabled; no requests are sent. API integration is a later, separately verified step. Preserve the unpublished backend source for that step.

Public assistant name: MoBot. The small avatar is a deliberately doodled version of the owner’s supplied portrait, generated with the built-in image editing tool. Brief: preserve identity and photo; add visibly fake felt-tip glasses and a curled scribbled moustache. Asset: assets/mobot-avatar-20261124.jpg. This does not activate any AI functionality.
