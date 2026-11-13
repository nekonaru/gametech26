# Project

- `PROJECT_KIND`: web
- `PROJECT_NAME`: Asap yang Tak Padam
- `PROJECT_REPO`: nekonaru/gametech26
- `PROJECT_LANG`: Indonesian (project language; docs and in-game text are Indonesian, code and commit messages are English)
- One line: Indonesian 3D psychological horror narrative game running in the browser, PS1-style, deployed to GitHub Pages from `main`.
- `PIPELINE`: pr (gh authenticated, CI exists; branch, PR, CI, auto-merge).

## Stack

- Three.js + TypeScript + Vite (Rolldown). Static site, no backend, no database, no accounts.
- Saves in the browser (IndexedDB + localStorage). Content (chapters, locales) is JSON in `Game/public/`.
- Game code: `Game/src/` (core, game, render, ui, puzzles). Build output: `Game/dist/` (committed; the repo is meant to be downloadable and playable without a toolchain).

## Commands (run from `Game/`)

- `npm run dev` - dev server, port 3000
- `npm run build` - `tsc` then `vite build` to `dist/`
- `npm run lint` - eslint, must report 0 errors
- `npm test` - vitest, 45 tests
- `npm run audit` - 7 content validator suites
- `node serve.cjs` - static server for `dist/`, port 8000, no dependencies
- CI: `.github/workflows/ci.yml` (lint, test, audit, Lighthouse, auto-play, visual regression) + `deploy-pages.yml` (deploy to GitHub Pages on every push to `main`)

## Conventions

- Indonesian is the project language: README, changelogs, in-game strings, UI. English for code, identifiers, comments, commit messages.
- No em dash or en dash anywhere. No emoji in docs.
- Commit format: `type: short description` (feat, fix, docs, chore, refactor, test, perf, style, revert), under 72 characters, one logical change per commit. Commit and push every change.
- Security notes for this project: static site, no server, no secrets in the repo. `PROJECT_KIND=web`, so the security gate is the web checklist; the applicable items are dependency audit, exposed files, and headers. Most backend checks are N/A.
- Icon set and brand assets live in `brand/` (masters) and `Game/public/` (favicon, PWA icons, og-image).
