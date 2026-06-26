# 01 — MVP visual de imk's Playground

- **Estado:** Implemented
- **Fecha:** 2026-06-19
- **Dependencias:** ninguna (primer spec de funcionalidad; parte del scaffold actual de Next.js)
- **Objetivo (una frase):** Implementar visualmente las cinco pantallas de imk's Playground
  (Library, Detail, Player, Auth y Hall of Fame) sobre Next.js 16 / React 19 / Tailwind v4,
  con toda la interacción de UI pero sin motor de juego real.

---

## Alcance

### Dentro (in)

**Las 5 pantallas como rutas reales del App Router:**
- `/` — **Library**: hero "imk's Playground", buscador, filtros por categoría (pills),
  grid responsivo de game cards, estado de carga (skeletons) y estado vacío ("no matches").
- `/game/[id]` — **Detail**: cover grande, categoría/título/about, botón PLAY NOW,
  lista de controles y leaderboard "TOP SCORES" (sticky).
- `/game/[id]/play` — **Player**: HUD (score/lives/level/player), bezel del juego con arte SVG,
  botones PAUSE/EXIT/END RUN, mock de score que sube solo, y modal GAME OVER con guardado de score.
- `/auth` — **Auth**: tabs Sign in / Create account, formulario mock, login social (Google/GitHub)
  y "Play as guest". Sin backend.
- `/hall-of-fame` — **Hall of Fame**: tabs Global + por juego, tarjeta "Your best", tabla de ranking.

**Sistema de diseño y chrome compartido:**
- Theming dark/light con tokens en `globals.css` (`@theme`), acento lima, blooms radiales.
- Navbar sticky (logo, links, toggle de tema, estado usuario/sign-in) + menú móvil (burger).
- Componentes compartidos: `Btn`, `Pill`, `ScorePill`, `Rank`, `ScoreTable`, `GameCover`/`GameGlyph`,
  iconos inline (`Ico`), `Logo`.
- Fuentes Geist + Geist Mono vía `next/font`.

**Interacción de UI (sin juego real):**
- Búsqueda + filtro por categoría en Library.
- Toggle de tema (persistido en localStorage).
- Auth mock: "iniciar sesión" setea un usuario en estado/localStorage.
- Player: score simulado, pausa, END RUN → modal Game Over → guardar score.
- Persistencia en `localStorage` de tema, usuario y scores enviados.
- Datos: los 8 juegos + leaderboards sembrados deterministas.

### Fuera (NOT in) — explícito

- **Cualquier motor o lógica de juego real.** El Player es un mock; el score no refleja gameplay.
- **Panel de Tweaks** (`tweaks-panel.jsx`): herramienta de diseño, no entra en el MVP.
- **Backend real**: sin API, sin base de datos, sin auth real (Supabase/REST quedan como stubs/comentarios).
- **Validación real de credenciales, registro, recuperación de contraseña, OAuth funcional.**
- **Scores globales reales/multijugador online**: los leaderboards son datos sembrados + envíos locales.
- **Tests automatizados, SEO avanzado, i18n, accesibilidad más allá de lo que trae la referencia.**

---

## Modelo de datos

No hay base de datos ni API. Los "datos" son módulos TypeScript tipados + estado en
`localStorage`. Tipos nuevos:

### `app/lib/games.ts`

```ts
export type Category = "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS";
export type GlyphId = "block" | "cascade" | "serpent" | "glutton"
  | "invaders" | "rocks" | "crosshop" | "duel";

export interface Game {
  id: string;          // slug de la ruta, ej. "block-buster"
  title: string;       // "BLOCK BUSTER"
  category: Category;
  icon: GlyphId;       // selecciona el arte SVG del cover
  blurb: string;       // texto corto de la card
  about: string;       // descripción larga del Detail
  controls: string[];  // ej. ["← / →  move paddle", "SPACE  launch ball"]
  seed: number;        // semilla del leaderboard determinista
}

export const GAMES: Game[];                       // los 8 juegos
export const CATEGORIES: ("ALL" | Category)[];    // ["ALL", "ARCADE", ...]
```

### `app/lib/scores.ts`

```ts
export interface ScoreRow {
  player: string;
  score: number;
  date: string;        // "YYYY-MM-DD"
  seeded?: boolean;    // fila sembrada (demo)
  mine?: boolean;      // enviada por el usuario actual
}

// Estado de scores enviados, indexado por gameId (lo que se persiste).
export type UserScores = Record<string, ScoreRow[]>;

// Helpers portados de data.jsx:
export function buildSeedScores(game: Game): ScoreRow[];   // determinista por seed
export function getLeaderboard(gameId: string, userScores: UserScores): ScoreRow[];
export function bestScore(gameId: string, userScores: UserScores): number;
export function fmt(n: number): string;                    // toLocaleString("en-US")
```

### Estado persistido en `localStorage`

Clave única (replicando la referencia, `arcadeVault_v1` → renombrada a la marca):

```ts
// clave: "imkPlayground_v1"
interface PersistedState {
  theme: "dark" | "light";
  user: { name: string } | null;     // null = invitado
  userScores: UserScores;             // scores enviados por el usuario
}
```

- Versión en el nombre de la clave (`_v1`) para invalidar si el formato cambia.
- Helpers `loadState()` / `saveState(patch)` con `try/catch` (SSR-safe: guardas para `typeof window`).

### Estado efímero (solo React, no se persiste)

- Library: query de búsqueda, categoría activa, flag de loading (skeleton), focus del input.
- Player: `score`, `lives`, `level`, `paused`, `over`.
- Auth: tab activa, campos del formulario.
- Hall of Fame: tab activa (global / por juego).

---

## Plan de implementación

Cada paso deja el sistema compilando y navegable. Antes de escribir código Next-específico,
consultar `node_modules/next/dist/docs/01-app/` (ver AGENTS.md: este Next 16 tiene breaking changes).

1. **Base de diseño (theming + fuentes + chrome global).**
   - Llevar todos los tokens de la referencia (dark + light) al `@theme`/`:root` de `app/globals.css`:
     colores, radios, sombras, `--nav-bg`, blooms, scrollbar, keyframes (`viewIn`, `pulseGlow`,
     `rowIn`, `skeletonPulse`, `float`, `coverBall`) y `prefers-reduced-motion`.
   - En `app/layout.tsx`: cablear Geist + Geist Mono (`next/font`) como `--font-ui` / `--font-mono`,
     `data-theme` inicial, `<title>imk's Playground</title>`, y el bloom de fondo (`body::before`).
   - **Verificable:** la app levanta con el fondo y la tipografía correctas.

2. **Datos tipados.**
   - Crear `app/lib/games.ts` (8 juegos + `CATEGORIES`) y `app/lib/scores.ts`
     (`buildSeedScores`, `getLeaderboard`, `bestScore`, `fmt`, tipos).
   - Crear `app/lib/storage.ts` con `loadState`/`saveState` SSR-safe y el tipo `PersistedState`.
   - **Verificable:** se importan sin errores de tipo (`tsc`/build).

3. **Provider de estado global de UI.**
   - `app/components/AppStateProvider.tsx` (client): contexto con `theme`, `user`, `userScores`
     y acciones (`toggleTheme`, `signIn`, `signOut`, `submitScore`), hidratando de `localStorage`
     y persistiendo en cambios. Envolver `children` en `layout.tsx`.
   - **Verificable:** el toggle de tema cambia `data-theme` y persiste al recargar.

4. **Componentes compartidos.**
   - `app/components/`: `Ico` (iconos inline), `Logo`, `Btn`, `Pill`, `ScorePill`, `Rank`,
     `ScoreTable`, `GameCover`/`GameGlyph` (arte SVG de los 8 juegos), `Navbar` (con menú móvil).
   - Marcar como client los que llevan estado/hover; `GameCover` puede ser server.
   - **Verificable:** Navbar renderiza en todas las rutas con links, toggle y estado de usuario.

5. **Ruta Library (`/`).**
   - `app/page.tsx` → `LibraryView` (client): hero, buscador, pills de categoría, grid de
     `GameCard`, skeletons en carga inicial y estado vacío. Cards enlazan a `/game/[id]`.
   - **Verificable:** se ven los 8 juegos; buscar/filtrar reduce el grid; cards navegan al detalle.

6. **Ruta Detail (`/game/[id]`).**
   - `app/game/[id]/page.tsx`: resuelve el juego por `id` (404 si no existe), cover grande,
     about, controles, leaderboard sticky, botón PLAY NOW → `/game/[id]/play`.
   - **Verificable:** cada card abre su detalle con su leaderboard sembrado; back vuelve a `/`.

7. **Ruta Player (`/game/[id]/play`).**
   - `app/game/[id]/play/page.tsx` → `PlayerView` (client): HUD, bezel con glyph SVG, score
     simulado (interval), PAUSE/EXIT, END RUN → `GameOverModal` (cuenta de score + guardar →
     `submitScore` → localStorage). EXIT/replay según la referencia.
   - **Verificable:** END RUN abre el modal; guardar añade la fila al leaderboard del juego.

8. **Ruta Auth (`/auth`).**
   - `app/auth/page.tsx` → `AuthView` (client): tabs Sign in / Create account, campos mock,
     botones sociales y "Play as guest"; al "entrar" hace `signIn(name)` y redirige a `/`.
   - **Verificable:** enviar el formulario o un botón social setea el usuario en el navbar.

9. **Ruta Hall of Fame (`/hall-of-fame`).**
   - `app/hall-of-fame/page.tsx` → `HallOfFameView` (client): tabs Global + por juego,
     tarjeta "Your best" (si hay usuario con score), `ScoreTable` con animación de filas.
   - **Verificable:** Global agrega todos los juegos; cada tab muestra su ranking; "YOU" se resalta.

10. **Pulido responsive + navegación.**
    - Menú móvil (burger), grid `detail-grid` a una columna en móvil, `scroll-to-top` en cambio
      de ruta, y revisar navegación lenta cliente (ver `01-app/.../instant-navigation.mdx`:
      puede requerir exportar `unstable_instant` en las rutas, no solo Suspense).
    - **Verificable:** todo usable en viewport móvil; navegación entre pantallas fluida.

---

## Criterios de aceptación

Checklist booleano (cada ítem es verificable a simple vista o con una acción concreta):

**Rutas y navegación**
- [ ] `/`, `/game/[id]`, `/game/[id]/play`, `/auth` y `/hall-of-fame` cargan sin error.
- [ ] Un `id` inexistente en `/game/[id]` muestra el 404 de Next.
- [ ] El logo y los links del navbar navegan a la ruta correcta en todas las pantallas.
- [ ] Al cambiar de ruta la página queda scrolleada arriba.

**Library (`/`)**
- [ ] Se renderizan los 8 juegos en un grid responsivo.
- [ ] El buscador filtra por título/blurb/categoría en vivo.
- [ ] Las pills de categoría filtran; "ALL" muestra todo.
- [ ] Sin resultados se muestra el estado vacío ("NO GAMES MATCH …").
- [ ] En la carga inicial aparecen los skeletons antes del grid.
- [ ] Cada card muestra su BEST SCORE y navega al detalle.

**Detail (`/game/[id]`)**
- [ ] Muestra cover, categoría, título, about y controles del juego correcto.
- [ ] El leaderboard sticky muestra el top 10 sembrado de ese juego.
- [ ] PLAY NOW va a `/game/[id]/play`; BACK vuelve a `/`.

**Player (`/game/[id]/play`)**
- [ ] El HUD muestra SCORE/LIVES/LEVEL/PLAYER; el score sube solo mientras no está en pausa.
- [ ] PAUSE detiene el incremento y muestra el estado "PAUSED".
- [ ] END RUN abre el modal GAME OVER con el score final animado.
- [ ] Guardar un score lo añade al leaderboard de ese juego y persiste tras recargar.
- [ ] PLAY AGAIN reinicia el run; EXIT/BACK vuelve a la library.

**Auth (`/auth`)**
- [ ] Tabs Sign in / Create account alternan y muestran el campo email solo en registro.
- [ ] Enviar el formulario válido (o un botón social / "Play as guest") deja al usuario logueado.
- [ ] Tras loguear, el navbar muestra el avatar + nombre y aparece "Sign out".

**Hall of Fame (`/hall-of-fame`)**
- [ ] Tab Global agrega y ordena el top 10 entre todos los juegos.
- [ ] Cada tab por juego muestra su ranking.
- [ ] Si el usuario tiene un score propio en el scope, se ve "Your best" y la fila resaltada "YOU".

**Theming y persistencia**
- [ ] El toggle alterna dark/light y persiste tras recargar.
- [ ] Usuario y scores enviados persisten en `localStorage` tras recargar.
- [ ] `prefers-reduced-motion` desactiva animaciones.

**Responsive y calidad**
- [ ] En móvil aparece el menú burger y el detalle pasa a una columna.
- [ ] `npm run build` y el lint pasan sin errores.
- [ ] No quedan referencias a "Arcade Vault" en UI visible (marca = "imk's Playground").

---

## Decisiones tomadas y descartadas

| # | Decisión | Elegido | Descartado | Justificación |
|---|----------|---------|------------|---------------|
| 1 | Enrutamiento | Rutas reales del App Router (`/`, `/game/[id]`, `/game/[id]/play`, `/auth`, `/hall-of-fame`) | Replicar el SPA por estado de `app.jsx` | Es Next.js idiomático: URLs compartibles, 404 nativo, aprovecha el framework. |
| 2 | Estilos | Tailwind v4 con tokens en `@theme`/`globals.css` | Portar inline styles + CSS vars tal cual | Coherente con el stack del repo (AGENTS.md) y más mantenible. Los CSS vars de tema se conservan como capa de theming. |
| 3 | Alcance de interacción | Toda la interacción de UI (filtros, tema, tabs, auth mock, player simulado, modal) | Maquetado estático sin estados | "Lo visual" incluye el comportamiento de UI; solo se excluye un motor de juego real. |
| 4 | Panel de Tweaks | Fuera del MVP | Incluirlo | Es una herramienta de diseño en vivo, no una pantalla del producto. |
| 5 | Persistencia | `localStorage` (tema, usuario, scores) | Solo estado en memoria | Trivial de implementar y hace la demo más creíble (scores que sobreviven recargas). |
| 6 | Marca | "imk's Playground" en toda la UI | "Arcade Vault" (del screenshot) | El HTML (`<title>`) y los views ya usan "imk's Playground"; es la marca real del proyecto. |
| 7 | Catálogo | Reutilizar los 8 juegos + leaderboards sembrados deterministas | Inventar nuevos juegos | Ya están bien diseñados y dan contenido realista sin esfuerzo extra. |
| 8 | Ubicación de datos | `app/lib/games.ts`, `app/lib/scores.ts`, `app/lib/storage.ts` | `lib/` o `data/` en la raíz | Mantiene el código bajo `app/` (alias `@/app/...`) y agrupado por responsabilidad. |
| 9 | Backend / auth | Mock sin backend; stubs comentados de REST/Supabase | Auth real u OAuth funcional | Fuera del alcance del MVP visual; la referencia ya marca dónde conectaría producción. |

---

## Riesgos identificados

| # | Riesgo | Impacto | Mitigación |
|---|--------|---------|------------|
| 1 | **Next.js 16 no estándar.** APIs/convenciones distintas a lo conocido (params async, layouts, etc.). | Código que no compila o patrones obsoletos. | Leer `node_modules/next/dist/docs/01-app/` antes de escribir cada ruta; respetar los *AI agent hints* y avisos de deprecación (AGENTS.md). |
| 2 | **Navegación cliente lenta** entre pantallas. | Transiciones con retraso perceptible. | Revisar `01-app/02-guides/instant-navigation.mdx`; puede requerir exportar `unstable_instant` desde la ruta, no solo `Suspense`. |
| 3 | **`localStorage` en SSR.** Acceso a `window`/`localStorage` durante el render del servidor rompe la hidratación. | Errores de hidratación / crash en build. | `loadState`/`saveState` con guard `typeof window !== "undefined"`; leer estado en `useEffect`, no en el render inicial. |
| 4 | **Mismatch de tema en hidratación.** El `data-theme` persistido difiere del render inicial del servidor (flash). | Parpadeo dark/light al cargar. | Aplicar el tema vía script inline temprano o aceptar default `dark` y sincronizar en `useEffect`; documentar el trade-off. |
| 5 | **Migración inline-styles → Tailwind.** La referencia usa muchos estilos calculados (hover, transforms con CSS vars). | Pérdida de fidelidad visual al traducir. | Conservar valores dinámicos vía CSS vars + utilidades arbitrarias de Tailwind v4; comparar contra el screenshot/HTML de referencia. |
| 6 | **Server vs Client components.** Marcar mal el límite (estado/eventos en server components). | Errores de build de Next. | Por defecto client en views con estado/hover; mantener server solo lo puramente presentacional (ej. `GameCover`). |
