# imk's Playground

> **Work in progress** — the platform is actively being built. Expect incomplete features, rough edges, and frequent changes.

A platform to play games online and compete for the highest score.

## Stack

- **Next.js 16** (App Router)
- **React 19** / TypeScript 5 (strict mode)
- **Tailwind CSS v4** (CSS-based config)
- **Supabase** (database + leaderboards)
- **ESLint 9** (flat config)

## Commands

```bash
npm run dev     # start dev server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Development workflow

This project follows spec-driven development. Features are designed in `specs/` before any code is written.

| # | Spec | Status |
|---|------|--------|
| 01 | MVP visual screens | Approved |
| 02 | Home page | Approved |
| 03 | About / contact (Resend) | Approved |
| 04 | Supabase client setup | Implemented |
| 05 | Asteroids game integration | Implemented |
| 06 | Games table + Supabase leaderboard | Implemented |

Skills used: [`Klerith/fernando-skills`](https://github.com/Klerith/fernando-skills)

```bash
npx skills@latest add Klerith/fernando-skills
```
