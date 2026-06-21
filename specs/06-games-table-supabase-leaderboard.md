# 06 — Catálogo de juegos en Supabase + leaderboard por juego

> **Estado:** Implemented · **Depende de:** Spec 04, Spec 05 · **Fecha:** 2026-06-21
> **Objetivo:** Migrar el catálogo de juegos a una tabla `games` en Supabase como fuente de verdad, de modo que cada juego nuevo incorporado tenga su propio leaderboard automáticamente gracias al campo `game_id` de `public.scores`.

---

## Scope

**Dentro:**

- Tabla `public.games` en Supabase con todos los campos del interface `Game` actual (`id`, `title`, `category`, `icon`, `blurb`, `about`, `controls`, `seed`) más `sort_order` para preservar el orden de la librería.
- Migración con seed de los 8 juegos actuales como datos iniciales; futuros juegos se agregan via migración SQL.
- Supabase como fuente de verdad del catálogo: `app/lib/games.ts` pierde la constante `GAMES`; quedan solo los tipos TypeScript (`Game`, `Category`, `GlyphId`, `CATEGORIES`).
- Nuevas funciones async `getGames()` y `getGame(id)` en `app/lib/gamesSupabase.ts` que leen desde Supabase con el cliente server.
- Actualizar todos los consumidores de `GAMES` en el app para usar las nuevas funciones async (Server Components, rutas).
- `app/lib/scores.ts` sin cambios de comportamiento: los 7 juegos sin gameplay real siguen usando `buildSeedScores(game)` con el `seed` leído ahora desde Supabase en lugar de la constante local.
- Asteroids: su leaderboard en `DetailView` ya lee desde `public.scores` (implementado en Spec 05); no hay cambios de UI.

**Fuera (specs futuros):**

- Portar los otros 7 juegos a leaderboards reales en Supabase (siguen con datos sembrados generados desde `seed`).
- UI de administración para crear/editar juegos desde el app.
- RLS de escritura en `games` (la tabla es solo de lectura para el cliente; las inserciones van por migración SQL).
- Autenticación de Supabase (sigue siendo otro spec).
- Cambios visuales en `DetailView` o `ScoreTable` (solo cambia la fuente de datos, no la UI).
- La ruta `/hall-of-fame` (sigue con datos sembrados).

---

## Data Model

### Tabla Supabase `public.games`

| Columna      | Tipo      | Notas                                                                  |
| ------------ | --------- | ---------------------------------------------------------------------- |
| `id`         | `text`    | PK (ej. `"asteroids"`, `"cascade"`)                                    |
| `title`      | `text`    | NOT NULL (ej. `"ASTEROIDS"`)                                           |
| `category`   | `text`    | NOT NULL; `check (category in ('ARCADE','PUZZLE','SHOOTER','VERSUS'))` |
| `icon`       | `text`    | NOT NULL; GlyphId del SVG (ej. `"rocks"`)                              |
| `blurb`      | `text`    | NOT NULL; descripción corta                                            |
| `about`      | `text`    | NOT NULL; descripción larga                                            |
| `controls`   | `jsonb`   | NOT NULL DEFAULT `'[]'`; array de strings (ej. `["← / → rotate"]`)     |
| `seed`       | `integer` | NOT NULL DEFAULT `0`; semilla para `buildSeedScores`                   |
| `sort_order` | `integer` | NOT NULL DEFAULT `0`; orden de aparición en la librería                |

- **RLS:** habilitado. Política `select` pública (anon + authenticated). Sin `insert`/`update`/`delete` para clientes anon — las escrituras van por migración SQL.
- **Seed inicial:** los 8 juegos actuales se insertan en la misma migración, con `sort_order` 0–7 según el orden actual de `GAMES` en `app/lib/games.ts`.

### Relación con `public.scores`

No cambia el esquema de `scores`. El campo `game_id` de `scores` referencia lógicamente a `games.id`; un nuevo juego insertado en `games` ya tiene leaderboard disponible en `scores` sin DDL adicional.

### Cambios en TypeScript

**`app/lib/games.ts` — después de este spec:**

- Se elimina: `GAMES: Game[]`.
- Se conservan: tipos `Game`, `Category`, `GlyphId`, constante `CATEGORIES`.

**`app/lib/gamesSupabase.ts` — nuevo:**

```ts
export async function getGames(): Promise<Game[]>;
// SELECT * FROM games ORDER BY sort_order ASC

export async function getGame(id: string): Promise<Game | null>;
// SELECT * FROM games WHERE id = $1 LIMIT 1
```

Ambas usan el cliente server de `utils/supabase/server.ts`.

---

## Implementation Plan

Cada paso deja el sistema compilando y navegable.

1. **Migración Supabase: tabla `games` + RLS + seed.**
   - Aplicar una sola migración que crea `public.games`, habilita RLS, define la política `select` pública y hace `INSERT` de los 8 juegos con sus valores actuales de `app/lib/games.ts`, asignando `sort_order` 0–7 según el orden actual.
   - Verificar: `list_tables` muestra `public.games` con 8 filas y RLS activo.

2. **Crear `app/lib/gamesSupabase.ts`.**
   - Exporta `getGames(): Promise<Game[]>` — `SELECT * FROM games ORDER BY sort_order ASC`.
   - Exporta `getGame(id: string): Promise<Game | null>` — `SELECT ... WHERE id = $1 LIMIT 1`.
   - Castear explícitamente `controls` a `string[]` tras el fetch (Supabase devuelve `jsonb` como `unknown`).
   - Ambas usan el cliente server de `utils/supabase/server.ts`.
   - Verificar: `npm run build` sin errores (sin consumidores aún).

3. **Refactorizar `app/lib/scores.ts`.**
   - Eliminar el import de `GAMES` y el cache estático `SEED_SCORES`.
   - Cambiar firma: `getLeaderboard(game: Game, userScores: UserScores): ScoreRow[]` — llama `buildSeedScores(game)` on-demand.
   - Cambiar `bestScore(game: Game, userScores: UserScores): number` de igual forma.
   - Verificar: TypeScript compila (los consumidores romperán — se arreglan en paso 5).

4. **Limpiar `app/lib/games.ts`.**
   - Eliminar la constante `GAMES`.
   - Conservar: tipos `Game`, `Category`, `GlyphId`, constante `CATEGORIES`.
   - Verificar: el archivo compila en aislamiento; los errores en consumidores son esperados y se resuelven en el paso siguiente.

5. **Actualizar todos los consumidores.**
   - En cada Server Component / Route Handler que importaba `GAMES`: reemplazar con `await getGames()` o `await getGame(id)` desde `app/lib/gamesSupabase.ts`.
   - Actualizar las llamadas a `getLeaderboard` / `bestScore` para pasar el objeto `game` completo (ya disponible del fetch anterior) en lugar de solo `gameId`.
   - Verificar: `npm run build` pasa sin errores de tipo ni de compilación; todas las rutas responden.

6. **Verificación E2E con Playwright.**
   - Screenshots en `.playwright-screenshots/YYYY-MM-DD/`.
   - Comprobar: `/library` lista los 8 juegos en el orden correcto; `/game/asteroids` muestra leaderboard real desde Supabase; `/game/cascade` muestra leaderboard sembrado sin regresión; `/hall-of-fame` carga sin errores.
   - `npm run build` + ESLint sin errores antes de cerrar.

---

## Acceptance Criteria

**Supabase — tabla `games`**

- [ ] `public.games` existe con las columnas: `id`, `title`, `category`, `icon`, `blurb`, `about`, `controls` (jsonb), `seed`, `sort_order`.
- [ ] RLS habilitado: `select` público (anon + authenticated); sin `insert`/`update`/`delete` para clientes anon.
- [ ] La tabla contiene exactamente 8 filas, en el orden correcto según `sort_order`.

**Catálogo desde Supabase**

- [ ] `app/lib/games.ts` no exporta `GAMES` ni ninguna constante con los datos de los juegos; solo exporta tipos y `CATEGORIES`.
- [ ] `app/lib/gamesSupabase.ts` exporta `getGames()` y `getGame(id)` async.
- [ ] `/library` lista los 8 juegos en el orden correcto leyendo desde Supabase.
- [ ] `/game/[id]` carga el detalle del juego correcto para cualquiera de los 8 ids.

**Leaderboards**

- [ ] El leaderboard de `/game/asteroids` muestra scores reales desde `public.scores` (comportamiento del Spec 05, sin regresión).
- [ ] Los leaderboards de los otros 7 juegos muestran datos sembrados generados desde el campo `seed` leído de Supabase, sin diferencia visual respecto al estado anterior.

**`scores.ts`**

- [ ] `getLeaderboard(game, userScores)` y `bestScore(game, userScores)` aceptan un objeto `Game` completo en lugar de solo `gameId`.
- [ ] `app/lib/scores.ts` no importa `GAMES` ni ninguna constante de juegos.

**Calidad**

- [ ] `npm run build` y ESLint sin errores.
- [ ] `/library`, `/game/asteroids`, `/game/cascade`, `/hall-of-fame` cargan sin regresión visual ni de comportamiento (verificado con Playwright).

---

## Decisions Taken and Discarded

| #   | Decisión                               | Elegido                                 | Descartado                                  | Justificación                                                                                              |
| --- | -------------------------------------- | --------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 1   | Fuente de verdad del catálogo          | Supabase como única fuente              | Duplicado `games.ts` + Supabase en paralelo | Elimina divergencia; un juego nuevo se agrega con una sola migración SQL                                   |
| 2   | Tipos TS                               | Conservar en `games.ts` (sin `GAMES`)   | Moverlos a `gamesSupabase.ts` o `types/`    | Los tipos no cambian; moverlos rompería imports existentes sin beneficio                                   |
| 3   | Leaderboards de otros 7 juegos         | Siguen con datos sembrados desde `seed` | Migrarlos a scores reales en Supabase       | Sin gameplay real no tiene sentido escribir scores a Supabase; el `seed` vive en `games`                   |
| 4   | Campo `sort_order`                     | Incluido en `games`                     | Ordenar por `title` o `created_at`          | El orden de la librería es una decisión editorial, no alfabética ni cronológica                            |
| 5   | Nuevos juegos vía migración SQL        | Seed por migración al hacer deploy      | UI de admin en el app                       | El equipo es pequeño; una migración es más segura y auditable que una ruta admin sin auth                  |
| 6   | Firma de `getLeaderboard`              | Recibe `Game` completo                  | Recibe solo `seed: number`                  | El objeto `Game` ya está disponible en el caller; pasar solo `seed` es una abstracción parcial             |
| 7   | FK entre `scores.game_id` y `games.id` | Sin FK formal (referencia lógica)       | FK con `REFERENCES games(id)`               | Los scores de Asteroids ya existen; agregar FK requeriría validar datos existentes sin beneficio inmediato |

---

## Identified Risks

| #   | Riesgo                                                | Impacto                                                    | Mitigación                                                                                                |
| --- | ----------------------------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| 1   | Latencia en el catálogo (cada ruta hace un SELECT)    | Páginas más lentas si Supabase tarda                       | Next.js cachea el fetch en el mismo request; `unstable_cache` queda para un spec posterior si se necesita |
| 2   | `controls` como jsonb rompe el tipado TS en el SELECT | Supabase devuelve `unknown` para jsonb                     | Castear explícitamente a `string[]` en `gamesSupabase.ts` tras el fetch                                   |
| 3   | Consumidores de `GAMES` no actualizados               | Errores de compilación en `npm run build`                  | El paso 5 del plan los cubre; el build falla rápido si quedan imports rotos                               |
| 4   | `scores.ts` con firma cambiada rompe callers          | Errores de tipo en componentes que llaman `getLeaderboard` | El cambio de firma es detectado por TypeScript en tiempo de compilación; se corrige en paso 5             |

---

## What is NOT in this spec

- Leaderboards reales para los 7 juegos sin gameplay (siguen con datos sembrados).
- UI de administración para gestionar juegos desde el app.
- Autenticación de Supabase.
- Cambios visuales en `DetailView`, `ScoreTable` o `/hall-of-fame`.
- FK formal entre `scores.game_id` y `games.id`.

Cada uno de esos, si llega, va en su propio spec.
