# 02 — Home Page

- **Estado:** Implemented
- **Fecha:** 2026-06-20
- **Dependencias:** 01-mvp-visual-screens (Library, Detail, Player, Navbar, `lib/games.ts`, `lib/scores.ts` ya implementados)
- **Objetivo:** Add a landing home page at `/`, move Library to `/library`, and update
  all navigation and back-links to match the new route structure.

---

## Scope

### In

- New `/` route (`app/page.tsx`) — Home page with these sections (structure from reference,
  current app styles, all text in English):
  - **Hero:** floating pixel silhouettes, eyebrow, headline, subheading, two CTAs (Explore Games → `/library`, Create Account → `/auth`), scroll hint
  - **Why imk's Playground?** — 4 feature cards (GAMEPAD, FREE, TROPHY, ROCKET) with pixel SVG icons, scroll-reveal
  - **Games Available Now** — `GAMES.slice(0, 6)` mini-cards from `lib/games.ts`, link to `/library`
  - **Stats** — 3 stat blocks (hardcoded: 12+ games, thousands of games played, global ranking)
  - **Live Activity** — "Latest Scores" ticker + "Top Players Today" list, both fed from `buildSeedScores` across all games
  - **Pricing** — decorative single-plan card ($0 / always) + 3 FAQ items emphasizing the app is free; CTA → `/auth`
  - **Final CTA** — full-width band, "Insert Coin →" button → `/library`
  - Scroll-reveal (`IntersectionObserver`) on all sections below the hero

- Move Library from `app/page.tsx` → `app/library/page.tsx` (no logic changes, route only)

- **Navbar updates:**
  - Add "Home" link → `/`
  - Change "Library" link → `/library`
  - Translate all nav labels to English (Home, Library, Hall of Fame, About)

- **Back-link fixes:**
  - `app/game/[id]/page.tsx` — BACK button: `/` → `/library`
  - `app/game/[id]/play/page.tsx` — EXIT/BACK: `/` → `/library`

### Not In

- About page (`/about`) — separate spec
- Any routing change outside the files listed above
- Real leaderboard data (live activity uses `buildSeedScores`, not user-submitted scores)
- New game logic or Player changes beyond the back-link fix
- Animations beyond what the reference defines (no new keyframes)

---

## Implementation Plan

1. **Move Library to `/library`.**
   - Rename `app/page.tsx` → `app/library/page.tsx` (create `app/library/` directory).
   - Verify: `/library` loads the Library without errors; `/` returns 404 temporarily.

2. **Update Navbar.**
   - Add "Home" link → `/`.
   - Change "Library" href → `/library`.
   - Translate all nav labels to English: Home, Library, Hall of Fame, About.
   - Verify: all links resolve to the correct routes in every screen.

3. **Fix back-links in Detail and Player.**
   - `app/game/[id]/page.tsx`: BACK button href `/` → `/library`.
   - `app/game/[id]/play/page.tsx`: EXIT/BACK href `/` → `/library`.
   - Verify: navigating back from Detail and Player lands on `/library`.

4. **Build Home page (`app/page.tsx`).**
   - Create `app/page.tsx` as a client component.
   - Implement `useReveal()` hook (IntersectionObserver, `.reveal` + `.in` pattern).
   - Implement `FloatingSilhouettes` (8 pixel SVG shapes, exact structure from reference).
   - Implement `FeatureIcon` (GAMEPAD, FREE, TROPHY, ROCKET pixel SVG icons).
   - Assemble all 7 sections in order; wire CTAs to `/library` and `/auth` via `<Link>`.
   - Live Activity: derive ticker rows and top-5 list from `buildSeedScores` across all `GAMES`;
     sort by score descending; top row gets a timestamp mock string ("2 min ago", etc.).
   - Verify: `/` renders all 7 sections; scroll-reveal fires on scroll; CTAs navigate correctly.

5. **Style pass.**
   - Apply current app CSS tokens (`--color-*`, `--font-*`, Tailwind v4 utilities) to all
     new elements — no new CSS variables, no new keyframes unless the reference uses one
     not yet in `globals.css`.
   - Verify: visual consistency with existing screens (same dark background, same accent colors,
     same button styles).

---

## Acceptance Criteria

**Routes & navigation**
- [ ] `/` loads the Home page without errors.
- [ ] `/library` loads the Library page (same content as current `/`).
- [ ] The old `/` no longer serves the Library.
- [ ] Navbar "Home" link navigates to `/`; "Library" link navigates to `/library`.
- [ ] All navbar labels are in English (Home, Library, Hall of Fame, About).
- [ ] BACK in Detail navigates to `/library`.
- [ ] EXIT/BACK in Player navigates to `/library`.

**Home — Hero**
- [ ] Floating pixel silhouettes render (8 SVG shapes).
- [ ] Eyebrow, headline, subheading, and two CTA buttons are visible.
- [ ] "Explore Games" CTA navigates to `/library`; "Create Account" CTA navigates to `/auth`.
- [ ] Scroll hint is visible below the CTAs.

**Home — Sections**
- [ ] "Why imk's Playground?" renders 4 feature cards with pixel SVG icons.
- [ ] "Games Available Now" renders 6 mini-cards from real `GAMES` data; "See All Games" navigates to `/library`.
- [ ] Stats section renders 3 stat blocks with hardcoded values.
- [ ] "Live Activity" ticker shows at least 5 rows derived from `buildSeedScores`; "Top Players Today" shows top 5.
- [ ] Pricing section renders the $0 plan card and 3 FAQ items.
- [ ] Final CTA band renders; "Insert Coin →" navigates to `/library`.

**Scroll-reveal**
- [ ] All sections below the hero have the `.reveal` class and animate in on scroll.

**Style consistency**
- [ ] Home page uses the same color tokens, typography, and button styles as the rest of the app.
- [ ] `npm run build` and lint pass with no errors.

---

## Decisions Taken and Discarded

| # | Decision | Chosen | Discarded | Justification |
|---|----------|--------|-----------|---------------|
| 1 | Home route | `/` for Home, `/library` for Library | Keep `/` as Library, add `/home` | Canonical UX: the landing page owns the root URL. |
| 2 | Live Activity data | `buildSeedScores` across all games | Static hardcoded mock | Reuses existing infrastructure; data is consistent with Detail leaderboards. |
| 3 | About page | Out of scope | Implement alongside Home | Keeps the spec focused; About is a separate deliverable. |
| 4 | Pricing section | Included as decorative (free messaging) | Omitted entirely | Reinforces the free value proposition without implying a real billing system. |
| 5 | App language | English throughout | Keep Spanish from reference | Spec 01 decision #6 established English as the app language. |
| 6 | Styles | Current app tokens (Tailwind v4 + CSS vars) | Port reference styles as-is | Consistent with existing screens; reference styles are incompatible with the current stack. |

---

## Identified Risks

| # | Risk | Impact | Mitigation |
|---|------|--------|------------|
| 1 | **`buildSeedScores` called for all 8 games on every render.** Generates ~80 rows synchronously. | Perceptible render delay on low-end devices. | Call once outside the component or memoize with `useMemo`; data is deterministic so no stale risk. |
| 2 | **Scroll-reveal on SSR.** `IntersectionObserver` is browser-only; accessing it during server render crashes. | Build error or hydration mismatch. | Initialize the observer inside `useEffect` only (already the pattern in the reference). |
| 3 | **Library route change breaks existing links.** Any hardcoded `/` pointing to Library (e.g. in auth redirect after login) silently sends users to Home instead. | Unexpected navigation after sign-in. | Audit `app/auth/page.tsx` redirect target and update to `/library` if needed (covered in step 3 of the plan). |
