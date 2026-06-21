# 04 — Supabase Client Setup (Browser + SSR)

- **Status:** Implemented
- **Date:** 2026-06-20
- **Dependencies:** none (standalone base infrastructure)
- **Objective:** Install and configure the Supabase clients (browser + SSR)
  and session middleware as base infrastructure for future specs on
  authentication, database, and realtime.

---

## Scope

### In

- Install `@supabase/supabase-js` and `@supabase/ssr` via npm
- Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  to `.env.template` and `.env.local` (already present)
- Create `utils/supabase/client.ts` — browser client (`createBrowserClient`)
  for use in Client Components
- Create `utils/supabase/server.ts` — server client (`createServerClient` with
  Next.js cookies) for Server Components and Route Handlers
- Create `utils/supabase/middleware.ts` — `updateSession` helper that refreshes
  the session on every request
- Create `proxy.ts` at the repo root — calls `updateSession`; matcher
  excludes static assets and image files (Next.js 16: `middleware.ts` renamed to `proxy.ts`)

### Not In

- Any authentication UI (login, register, password recovery)
- Auth flows (sign in, sign out, sign up, OAuth)
- Database queries or realtime subscriptions
- RLS configuration in the Supabase dashboard
- Redirect logic in middleware (protected routes) — goes in the auth spec
- `SUPABASE_SERVICE_ROLE_KEY` or other server-only keys

---

## Data Model

No new persistent data structures are introduced. Only environment variables:

| Variable                               | File(s)                       | Value in this spec |
| -------------------------------------- | ----------------------------- | ------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`             | `.env.template`, `.env.local` | already present    |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `.env.template`, `.env.local` | already present    |

The `NEXT_PUBLIC_` prefix is required for the browser client to read them at runtime.
Note: Supabase renamed `anon` key to `publishable`; this project uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

---

## Implementation Plan

1. **Install packages.**
   - `npm install @supabase/supabase-js @supabase/ssr`
   - Verify: both appear in `dependencies` in `package.json`.

2. **Add environment variables.**
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
     already present in `.env.template` and `.env.local`.
   - Verify: `.env.local` is not tracked by git.

3. **Create `utils/supabase/client.ts`.**
   - Exports `createClient()` returning `createBrowserClient(URL, PUBLISHABLE_KEY)`.
   - For exclusive use in Client Components (`'use client'`).
   - Verify: TypeScript compiles without errors.

4. **Create `utils/supabase/server.ts`.**
   - Exports async `createClient()` that instantiates `createServerClient` with
     `cookieStore` from `next/headers` (getAll / setAll).
   - For use in Server Components and Route Handlers.
   - Verify: TypeScript compiles without errors.

5. **Create `utils/supabase/middleware.ts`.**
   - Exports `updateSession(request: NextRequest)` that:
     1. Creates an initial `NextResponse.next()`.
     2. Instantiates `createServerClient` reading and writing cookies from the request.
     3. Calls `supabase.auth.getUser()` to refresh the token.
     4. Returns the `supabaseResponse` with updated cookies.
   - Verify: TypeScript compiles without errors.

6. **Create `proxy.ts` at the repo root** (Next.js 16 renamed `middleware.ts` → `proxy.ts`; exports `proxy` function).
   - Calls `updateSession(request)` and returns its result.
   - Matcher: excludes `_next/static`, `_next/image`, `favicon.ico`, and image
     extensions (`svg|png|jpg|jpeg|gif|webp`).
   - Verify: dev server starts without errors; no existing route
     (/, /library, /hall-of-fame, /about) shows regression.

7. **Smoke test and build.**
   - `npm run build` with no errors.
   - ESLint with no errors.
   - Navigate existing routes and confirm no visual or behavioral degradation.

---

## Acceptance Criteria

**Packages**

- [x] `@supabase/supabase-js` is listed in `dependencies` in `package.json`.
- [x] `@supabase/ssr` is listed in `dependencies` in `package.json`.

**Environment variables**

- [x] `NEXT_PUBLIC_SUPABASE_URL=` exists in `.env.template`.
- [x] `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=` exists in `.env.template` (renamed from `ANON_KEY` — Supabase changed the name).
- [x] `NEXT_PUBLIC_SUPABASE_URL=` exists in `.env.local`.
- [x] `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=` exists in `.env.local`.
- [x] `.env.local` does not appear in `git status` (it is in `.gitignore`).

**Clients**

- [x] `utils/supabase/client.ts` exports `createClient()` returning a Supabase browser client.
- [x] `utils/supabase/server.ts` exports async `createClient()` returning a Supabase server client.
- [x] `utils/supabase/middleware.ts` exports `updateSession(request)` that refreshes
      the session and returns a `NextResponse`.

**Proxy (formerly Middleware)**

- [x] `proxy.ts` exists at the repo root (Next.js 16 renamed `middleware.ts` → `proxy.ts`; exports `proxy` function).
- [x] The proxy does not produce errors on any existing route.
- [x] The matcher excludes static assets and images.

**Build and quality**

- [x] `npm run build` passes with no errors.
- [x] ESLint passes with no errors on new files.
- [x] Routes `/`, `/library`, `/hall-of-fame`, and `/about` load without
      visual or behavioral regression.

---

## Decisions Taken and Discarded

| #   | Decision                     | Chosen                                 | Discarded                       | Justification                                                                                                 |
| --- | ---------------------------- | -------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 1   | SSR package                  | `@supabase/ssr`                        | `@supabase/auth-helpers-nextjs` | `auth-helpers` is deprecated; `@supabase/ssr` is the current official recommendation for App Router           |
| 2   | Middleware in this spec      | Included (session refresh only)        | Defer to auth spec              | It is part of the base SSR infrastructure; without it, the server client reads stale tokens                   |
| 3   | Redirect logic in middleware | Not included                           | Include protected route guards  | Redirect logic belongs to the auth spec, not to infrastructure setup                                          |
| 4   | `NEXT_PUBLIC_` prefix        | Applied to URL and PUBLISHABLE_KEY     | Variables without prefix        | Next.js requires the prefix to expose variables to the client bundle; the publishable key is public by design |
| 5   | Helpers directory            | `utils/supabase/`                      | `lib/supabase/`                 | `lib/` is already used for game data (`games.ts`, `scores.ts`); `utils/` avoids mixing domains                |
| 6   | Env var key name             | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Already configured in `.env.local` / `.env.template`; Supabase renamed `anon` → `publishable`                 |
| 7   | Root file name               | `proxy.ts` (exports `proxy`)           | `middleware.ts`                 | Next.js 16 deprecated `middleware.ts`; the correct convention is `proxy.ts` with a `proxy` export             |

---

## Identified Risks

| #   | Risk                                   | Impact                                                                                 | Mitigation                                                                                                                                    |
| --- | -------------------------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Empty env vars in `.env.local`         | Supabase clients throw at runtime on first call                                        | Acceptable in this spec — no real calls are made yet; the user must fill in the values before implementing auth or DB specs                   |
| 2   | Middleware running with empty env vars | If `NEXT_PUBLIC_SUPABASE_URL` is empty, `createServerClient` may throw on server start | Mitigation: middleware only activates on an incoming request; in development, fill vars before testing any authenticated route                |
| 3   | `@supabase/ssr` version and Next.js 16 | The `next/headers` cookies API may differ in this non-standard version                 | Check `node_modules/next/dist/docs/` for the cookies API before writing `server.ts`; adjust if `cookies()` requires a different await pattern |
