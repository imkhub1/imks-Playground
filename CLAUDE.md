# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

**imk's Playground** — a platform to play games online and compete for the highest score. The repo is currently a near-default `create-next-app` scaffold (`app/page.tsx` is still the starter page); features are being built out from here.

## Stack

- **Next.js 16.2.9** — App Router (note: non-standard build, see below)
- **React 19.2.4** / React DOM 19.2.4
- **TypeScript 5** (strict mode)
- **Tailwind CSS v4** (CSS-based config, no `tailwind.config.js`)
- **ESLint 9** (flat config via `eslint-config-next`)

## Commands

```bash
npm run dev     # start dev server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint (flat config, eslint.config.mjs)
```

There is no test runner configured yet.

## Critical: this is a non-standard Next.js (v16.2.9)

Per `AGENTS.md`, this Next.js has **breaking changes vs. what you may know**. APIs, conventions, and file structure may differ from training data. The authoritative docs are vendored in the package itself:

- **Read `node_modules/next/dist/docs/` before writing any Next-specific code.** Structure: `01-app/` (App Router), `02-pages/`, `03-architecture/`. The `.mdx`/`.md` files contain embedded *AI agent hints* flagging the breaking changes — e.g. fixing slow client navigation requires exporting `unstable_instant` from the route (see `01-app/02-guides/instant-navigation.mdx`), not just Suspense.
- Heed deprecation notices in those docs.

## Architecture & conventions

- **App Router** under `app/`. `app/layout.tsx` is the root layout (wires Geist fonts as CSS variables + global styles); `app/page.tsx` is the home route.
- **TypeScript strict mode**; import alias `@/*` maps to the repo root (e.g. `@/app/...`).
- **Tailwind CSS v4** — configured entirely in CSS, not JS. There is no `tailwind.config.js`; theme tokens live in `app/globals.css` via `@import "tailwindcss"` and the `@theme inline { ... }` block. PostCSS uses `@tailwindcss/postcss` (`postcss.config.mjs`).

## Spec-driven workflow

This project follows spec-driven development using the `/spec` and `/spec-impl` skills (from [Klerith/fernando-skills](https://github.com/Klerith/fernando-skills), installed via `npx skills@latest add Klerith/fernando-skills`). Author/refine a spec with `/spec` before implementing with `/spec-impl`.
