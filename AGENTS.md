# Portfolio workflow

Follow the workspace rules when present. The owner requests this order after completed changes: implement and verify locally, commit and push to GitHub, then deploy the same verified version to the existing portfolio site and verify it. Do not stop after local changes when the publishing access is available.

This repository currently contains a recovered static production version. Its newer original JavaScript/SCSS sources are temporarily unavailable. Preserve the older src/ tree, but do not rebuild or deploy it instead of the current static version.

Use npm run build and npm run check. Keep site-files.json updated for added or removed website files. Deploy only dist/ to the confirmed portfolio destination using the locally configured connection. Back up the previous live version, verify uploaded file hashes before activation, and verify the public result afterward.

Do not commit credentials, private keys, local backups or deployment access details. Do not change repository visibility. Keep existing local user edits and avoid force pushes or destructive Git resets.
For typography, avoid umlaut characters in Moritzfontmer headlines: use ae/oe/ue (and ss where needed). Preserve normal German spelling in body copy, metadata and navigation when they use other fonts. Keep the animated underline on the introductory name. Homepage contact actions should remain discreet icon links above the progress indicator rather than prominent call-to-action buttons.

Use Moritzfontmer for the navigation wordmark as well as display headings. Content pages should use the shared subpage shell with the homepage color palette, frame, navigation and typefaces. Use a restrained portrait directly in Profile; do not restore an automatic portrait on Start or image-editing/code-demo windows.

The three pillar labels are always exactly Design, Technik, Sichtbarkeit, including the capabilities navigation. Work contains the twelve original frontend website references (Convista, ticket.io, Starke Periode, Buddystar, Lekkerland Karriere, FaktorZehn, MUNA+, Pflegeplanet, OnOffice, Eisberg, Konrad Graser, smartAware), not personal tools or subdomain apps unless the owner requests that change.

Capabilities belong to the third Notes sidebar entry (Kompetenzen), alongside profile and experience. Keep Design, Technik, Sichtbarkeit as compact expandable sections in that note, not in an extra dialog or toolbar launcher.

Keep capabilities concrete: languages, templates, CMS/frameworks, tools and topics supported by the existing CV. Experience is a chronological CV with individual employer stations, dates, role progression and qualifications; keep the Notes CV and detailed profile consistent. Do not invent skill ratings or certification dates.

Responsive contract: use desktop overlap only from 1200 CSS pixels. Below that, use the single-window app layout and bottom section dock. Keep CSS and navigation/window/menu/height media queries aligned. Notes switch to horizontal tabs at 600 pixels. Mobile contact actions and legal links must remain in document flow, never cover reading content. Reserve safe-area-aware space for the dock.

Project folders are ordinary links styled as Finder folders: a single click opens the external website directly in a new tab. Do not restore an inspector, selection or double-click requirement. The separate /projekte/ index contains factual own-contribution reports for Lekkerland Karriere, Eisberg and Starke Periode. Keep their claims supported by the existing CV and do not invent metrics. Preserve the skip link, no-JavaScript fallback, contrast fixes and focus clearance above the mobile dock.
