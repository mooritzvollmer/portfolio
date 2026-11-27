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

Public assistant name: Moritz Vollmair. The letters ai are subtly blue; the avatar renders at 52 × 52 CSS pixels. The small avatar is a deliberately doodled version of the owner’s supplied portrait, generated with the built-in image editing tool. Brief: preserve identity and photo; add visibly fake felt-tip glasses and a curled scribbled moustache. Asset: assets/mobot-avatar-20261124.jpg. This does not activate any AI functionality.

2026-11-26 internal-test exception authorized by owner: approved-profile.json (private storage, approved records only) is the sole chat knowledge source. Authenticated administrators may test gpt-6-luna via Responses with store:false, no tools, bounded history/output and hard request limits using the Pro credit grant only. Public AI remains hard-disabled (VM_PUBLIC_ENABLED=false); do not enable public access or add payment methods/auto-recharge without a new explicit instruction. No CGI or PHP-handler overrides. Preserve secrets and knowledge outside dist and GitHub. Current internal implementation: api/vollmair.php and vollmair-core.php. Earlier frag-moritz backend remains unpublished.

2026-11-26: owner additionally approved the published website career and project information. Private knowledge now includes the CV, twelve project names and the three published contribution reports; live/source hashes were compared before ingestion. Keep paraphrasing natural and grammatically correct, distinguish past/current roles and individual contributions from entire projects. Do not infer roles for projects with only a name. Show only fixed own-site source links. Public AI remains disabled.

2026-11-27 public-release preparation only: production VM_PUBLIC_ENABLED stays false, and private public_enabled/ai_enabled plus publicActivationApproved must also all be true before public access is possible. A cli-server-only VOLLMAIR_TEST_PUBLIC=1 switch allows local public-flow testing with dummy credentials. Starting the prepared public chat establishes a session without making a model request. Public visitors are limited to 6 questions per fixed 10-minute window/IP; the shared UTC-day cap remains 50 requests including internal tests. No automatic retries or recharge. Keep public activation pending explicit final owner approval.

2026-11-27: owner approved public activation and hourly-throttled email notifications to hello@moritzvollmer.de. Successful public answers count without transcripts/IP identifiers; only the first answer per session is eligible for a notification. Aggregate counts retained thirty days. Notification errors do not fail the chat. No mail for page views, start, failed responses or authenticated internal tests. All existing cost caps and private-storage protections remain in force.

IONOS script mail uses the existing technical From address from the host-provisioned msmtp configuration. Store that address only as usage_notification_from in private config; do not expose SMTP credentials or change the notification recipient. Sender settings are restricted to a simple validated address.

2026-11-27 mail delivery limitation: the host-provisioned IONOS SMTP account returns 535 Authentication credentials invalid, verified by one direct transport diagnostic. Usage email attempts are paused in private config until IONOS repairs that account or the owner configures an existing authenticated mailbox. Public chat and private aggregate counters work. Do not claim mail delivery, repeatedly retry, buy a mailbox or expose SMTP credentials.
