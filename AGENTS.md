# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

@AGENTS.md

## Project

**imk's Playground** — a platform to play games online and compete for the highest score. The app has a working game engine (`app/games/engine/`) built around a `GameFactory`/`GameController` contract, two integrated games (`asteroids`, `tetris`), a Supabase-backed games catalog and score leaderboard, and the main pages (home, library, game detail/play, hall of fame, about, contact). Features continue to be built out from here.

## Language

Communicate with the user (chat, explanations, questions) in **Spanish**. Keep everything written into the repository in **English** — code, comments, identifiers, file and directory names, documentation, specs, and commit messages.

## Stack

- **Next.js 16.2.9** — App Router (note: non-standard build, see below)
- **React 19.2.4** / React DOM 19.2.4
- **TypeScript 5** (strict mode)
- **Tailwind CSS v4** (CSS-based config, no `tailwind.config.js`)
- **ESLint 9** (flat config via `eslint-config-next`)

## Skills

/frontend-design for UI/UX design and implementation guidance;
/spec and /spec-impl for spec-driven development (see below);
/code-review for code review;
/debug for debugging help.

## Agents

Custom agents live in `.opencode/agent/`. Restart opencode after adding or editing one.

- **game-planner** (`primary`) — Plans and decides which new game fits the platform. Reasons about the technical "fit" contract (Canvas 2D 800×600, `GameFactory`/`GameController`, score-driven, keyboard controls, `ARCADE|PUZZLE|SHOOTER|VERSUS`) and proposes/prioritizes ideas. Keeps a running backlog at `.opencode/game-planner/backlog.md` so it never repeats past suggestions. Planning only — it does not write game code; hand off to `/spec` and `/spec-impl` to build. Invoke with Tab → `game-planner` (or `@game-planner`).
- **game-jam** (`primary`) — Turns the planner's pick into a spec. Reads the game with status `Recommended` in `.opencode/game-planner/backlog.md` and writes one complete, implementation-ready spec (in English) at `specs/game-jam/<game-id>/<game-id>.md`, born as `Status: Proposed` and modeled on `specs/05`/`07` (Scope, Data Model, Implementation Plan, Acceptance Criteria, Decisions, Risks). Spec-writing only — it does not implement game code, and it only reads the backlog (status changes belong to `game-planner`); its edits are locked to `specs/game-jam/**`. Hand off to `/spec-impl` to build. Invoke with Tab → `game-jam` (or `@game-jam`).
- **skin-designer** (`primary`) — Owns the project's default **Pastel** game skin (`app/games/engine/skins.ts`) and applies/verifies it on a single, specified game. Given a game id, it refactors that game's `app/games/<game-id>/game.ts` to render exclusively through `ctx.skin` (no hardcoded colors), keeping the look cohesive with the app theme in `app/globals.css`. Works per selected/mentioned game — it does **not** audit all games. Its edits are locked to `app/games/engine/skins.ts` and `app/games/*/game.ts`. Invoke with Tab → `skin-designer` (or `@skin-designer`).

## Critical: this is a non-standard Next.js (v16.2.9)

Per `AGENTS.md`, this Next.js has **breaking changes vs. what you may know**. APIs, conventions, and file structure may differ from training data. The authoritative docs are vendored in the package itself:

- **Read `node_modules/next/dist/docs/` before writing any Next-specific code.** Structure: `01-app/` (App Router), `02-pages/`, `03-architecture/`. The `.mdx`/`.md` files contain embedded _AI agent hints_ flagging the breaking changes — e.g. fixing slow client navigation requires exporting `unstable_instant` from the route (see `01-app/02-guides/instant-navigation.mdx`), not just Suspense.
- Heed deprecation notices in those docs.

## Architecture & conventions

- **App Router** under `app/`. `app/layout.tsx` is the root layout (wires Geist fonts as CSS variables + global styles); `app/page.tsx` is the home route.
- **TypeScript strict mode**; import alias `@/*` maps to the repo root (e.g. `@/app/...`).
- **Tailwind CSS v4** — configured entirely in CSS, not JS. There is no `tailwind.config.js`; theme tokens live in `app/globals.css` via `@import "tailwindcss"` and the `@theme inline { ... }` block. PostCSS uses `@tailwindcss/postcss` (`postcss.config.mjs`).

## Spec-driven workflow

This project follows spec-driven development using the `/spec` and `/spec-impl` skills (from [Klerith/fernando-skills](https://github.com/Klerith/fernando-skills), installed via `npx skills@latest add Klerith/fernando-skills`). Author/refine a spec with `/spec` before implementing with `/spec-impl`.
