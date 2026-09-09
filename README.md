# Moritz Vollmer Portfolio

Static Vite portfolio.

## Commands

```sh
npm run dev
npm run build
npm run preview
```

## Deploy

Run a dry-run first:

```sh
DEPLOY_TARGET="user@example.com:/absolute/path/to/webroot/" npm run deploy:dry
```

If the output looks right, deploy:

```sh
DEPLOY_TARGET="user@example.com:/absolute/path/to/webroot/" npm run deploy
```

The deploy command builds the site and syncs `dist/` with `rsync --delete`, so files removed from the build are removed from the server too.

Do not store SSH passwords in this project. Use the interactive SSH password prompt or set up SSH keys locally.
