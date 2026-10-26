# Portfolio workflow

Follow the workspace rules when present. The owner requests this order after completed changes: implement and verify locally, commit and push to GitHub, then deploy the same verified version to the existing portfolio site and verify it. Do not stop after local changes when the publishing access is available.

This repository currently contains a recovered static production version. Its newer original JavaScript/SCSS sources are temporarily unavailable. Preserve the older src/ tree, but do not rebuild or deploy it instead of the current static version.

Use npm run build and npm run check. Keep site-files.json updated for added or removed website files. Deploy only dist/ to the confirmed portfolio destination using the locally configured connection. Back up the previous live version, verify uploaded file hashes before activation, and verify the public result afterward.

Do not commit credentials, private keys, local backups or deployment access details. Do not change repository visibility. Keep existing local user edits and avoid force pushes or destructive Git resets.