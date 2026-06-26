# 07 — Tetris: segundo juego real (port de imk-tetris) con audio sintetizado y scores en Supabase

> **Estado:** Implemented · **Depende de:** Spec 04, Spec 05, Spec 06 · **Fecha:** 2026-06-26
> **Objetivo:** Portar el proyecto standalone `imk-tetris` (vanilla JS) al engine de canvas de la plataforma como el juego `tetris`, conservando audio, ghost piece, countdown y nivel inicial, con el puntaje persistido en Supabase.

---

## Scope

**Dentro:**

- **Puerto de la lógica** (`app/games/tetris/game.ts`): refactor de `imk-tetris/game.js` a un módulo que cumple el contrato `GameFactory → GameController`. Conserva: tablero 10×20, las 7 piezas, rotación con wall-kicks (±1, ±2), gravedad por nivel (`calcDropInterval`), soft/hard drop, line-clears, scoring `LINE_SCORES × level`, combos, ghost piece y countdown 3-2-1. Encapsula todo el estado de módulo en el closure; elimina los ~30 `getElementById`, los `addEventListener` globales y el `localStorage` de high-scores propio.
- **Puerto del audio** (`app/games/tetris/audio.ts`): refactor de `imk-tetris/audio.js` a un módulo que expone el equivalente de `Sfx` (SFX + música menú/gameplay vía Web Audio API, sin assets). Se instancia/limpia con el controller; respeta autoplay-policy (init perezoso en el primer gesto). Conserva su persistencia de volumen/mute en `localStorage` (`imktetris.audio.*`).
- **Layout en canvas 800×600:** el tablero (300×600) se dibuja centrado; los paneles laterales (NEXT piece + SCORE/LINES/LEVEL/COMBO) se dibujan dentro del mismo canvas a los lados, aprovechando el ancho horizontal. Paleta oscura fija (skin Pastel única); sin lectura de CSS vars del DOM externo.
- **Puente de estado a React:** el juego emite `onState({score, lines, level, status})` y `onGameOver(finalScore)`. El HUD de React de `PlayerView` se adapta a tetris mostrando **SCORE / LINES / LEVEL / PLAYER** (LINES sustituye a LIVES). COMBO se muestra solo en el panel del canvas.
- **Selector de nivel inicial (1-10):** control React (±) junto al bezel, pre-partida; al arrancar (y en cada PLAY AGAIN) la partida usa ese nivel.
- **Registro del juego:** añadir `tetris: createTetris` en `app/games/registry.ts`.
- **Catálogo:** renombrar la entrada `cascade` → `tetris` (id + ruta `/game/tetris` + título `TETRIS`) vía migración SQL en `public.games`. Se mantiene `category: "PUZZLE"` y `icon: "cascade"`.
- **Scores en Supabase:** reutiliza el flujo del Spec 05 sin cambios de esquema — al game over, `GameOverModal` inserta `{game_id: "tetris", player, score}` en `public.scores`; el leaderboard de `/game/tetris` lee de ahí.
- **Pausa:** el botón PAUSE de `PlayerView` pausa/reanuda el engine (gravedad + audio).

**Fuera (specs futuros):**

- Skins Arcade/Glass y su selector (se ship solo Pastel).
- Freeze mode (tecla F, modo test del original).
- Controles de mouse (izq/der/medio) — **solo teclado** en esta versión.
- Toggle light/dark propio del juego (paleta oscura fija).
- Start screen y pause-menu propios de tetris (los provee la plataforma).
- Persistir lines/combo en `public.scores` (solo se guarda `score`).
- Portar arkanoid/otros juegos (sigue el patrón, pero fuera de este spec).
- Soporte táctil/móvil; autenticación real de Supabase (otro spec).

---

## Data Model

### Tipos del engine (`app/games/engine/types.ts`) — extensión

`GameState` gana un campo opcional `lines` para que el HUD de React pueda mostrarlo. `lives` pasa a opcional (tetris no lo usa).

```ts
export interface GameState {
  score: number;
  level: number;
  status: GameStatus;
  lives?: number; // asteroids
  lines?: number; // tetris
}
```

`GameContext`, `GameController` y `GameFactory` no cambian. `onGameOver(finalScore)` sigue igual.

### Estado interno del juego (`app/games/tetris/game.ts`, dentro del closure)

```ts
// Constantes
const COLS = 10, ROWS = 20, BLOCK = 30;       // tablero 300×600
const BOARD_X = (800 - COLS * BLOCK) / 2;      // tablero centrado en canvas 800×600
const LINE_SCORES = [0, 100, 300, 500, 800];

// Estado (todo en el closure, no a nivel de módulo)
let board: number[][];                 // ROWS × COLS, 0 vacío | 1-7 índice de color
let current: { matrix: number[][]; x: number; y: number; colorIdx: number };
let next: typeof current;
let score = 0, lines = 0, level = 1, combo = 0;
let startLevel = 1;                     // inyectado por el selector React
let dropInterval: number;              // calcDropInterval(level)
let status: GameStatus;                // "playing" | "gameover"
let counting: boolean;                 // countdown 3-2-1 activo
```

Convenciones: origen del tablero arriba-izquierda; piezas como matrices cuadradas de enteros 1-7 que indexan la paleta Pastel; rotación pura (`rotateCW`) con wall-kicks en offsets `[0, ±1, ±2]`.

### Inyección del nivel inicial

`createTetris` lee el nivel inicial vía una variable de módulo escribible desde `PlayerView` antes de `start()`/`restart()`:

```ts
// app/games/tetris/game.ts
let pendingStartLevel = 1;
export function setTetrisStartLevel(n: number) {
  pendingStartLevel = Math.min(10, Math.max(1, n));
}
```

`init()`/`restart()` leen `pendingStartLevel` al arrancar la partida.

### Catálogo (`public.games`) — migración

Renombrar la fila `cascade` → `tetris`:

| Columna | Antes | Después |
| --- | --- | --- |
| `id` | `cascade` | `tetris` |
| `title` | `CASCADE` | `TETRIS` |
| `icon` | `cascade` | `cascade` (sin cambio) |
| `category` | `PUZZLE` | `PUZZLE` (sin cambio) |
| `controls` | `["← / → shift piece", ...]` | `["← / →  move", "↑ / W  rotate", "↓ / S  soft drop", "SPACE  hard drop", "P / Esc  pause"]` |
| `blurb` / `about` / `seed` / `sort_order` | — | sin cambio |

`public.scores` **no cambia** (esquema `game_id, player, score`). Los scores previos con `game_id="cascade"` (sembrados) quedan huérfanos; el leaderboard real arranca limpio con `game_id="tetris"`.

### GlyphId (`app/lib/games.ts`)

Sin cambios: `icon` sigue siendo `"cascade"`, que ya existe como `GlyphId`. No se toca el tipo.

---

## Implementation Plan

Cada paso deja el sistema compilando y navegable.

1. **Engine: extender `GameState`.**
   - En `app/games/engine/types.ts`: `lives` → opcional; añadir `lines?: number`.
   - Verificar: `npm run build` OK (asteroids sigue compilando; `lives` ya se setea).

2. **Puerto del audio.**
   - Crear `app/games/tetris/audio.ts`: refactor de `imk-tetris/audio.js` exportando una factory `createSfx()` (o un singleton) con la API `play/setVolume/getVolume/toggleMute/setMuted/isMuted/unlock/startMenuMusic/stopMenuMusic/startGameplayMusic/stopGameplayMusic`.
   - Quitar cualquier acceso global a `window`/`document` salvo `AudioContext` y los listeners de gesto (registrados/limpiables).
   - Conservar persistencia `imktetris.audio.volume` / `imktetris.audio.muted`.
   - Verificar: typecheck OK (sin consumidores aún).

3. **Puerto de la lógica del juego.**
   - Crear `app/games/tetris/game.ts` exportando `createTetris(ctx: GameContext): GameController` y `setTetrisStartLevel(n)`.
   - Encapsular el estado de módulo en el closure; `ctx.canvas.getContext("2d")`.
   - Eliminar todos los `getElementById`, overlays/pause-menu/start-screen del DOM, el high-score localStorage propio y los `addEventListener` globales (los de teclado se registran en `start`, se limpian en `destroy`).
   - Dibujar dentro del canvas 800×600: tablero centrado (`BOARD_X`), grid, bloques fijos, ghost, pieza activa, y paneles laterales NEXT + SCORE/LINES/LEVEL/COMBO. Paleta Pastel fija.
   - Conservar: rotación + wall-kicks, soft/hard drop, line-clears, scoring, combos, ghost, countdown 3-2-1.
   - Emitir `onState({score, lines, level, status})` al cambiar; `onGameOver(score)` al pasar a `"gameover"`.
   - Quitar el reinicio interno (lo maneja el modal React vía `restart()`); `restart()` reinicia leyendo `pendingStartLevel` y vuelve a lanzar el countdown.
   - Cablear el audio: menú→gameplay en el countdown, stop en pausa/game-over, resume en unpause.
   - Verificar: typecheck OK.

4. **Registro.**
   - En `app/games/registry.ts`: añadir `tetris: createTetris`.
   - Verificar: `npm run build` OK.

5. **`PlayerView`: HUD adaptado + selector de nivel.**
   - HUD por juego: si `game.id === "tetris"`, los `hudItems` son `SCORE / LINES / LEVEL / PLAYER` (LINES desde `gameState.lines`); asteroids conserva `SCORE / LIVES / LEVEL / PLAYER`.
   - Estado inicial de tetris: `{score:0, lines:0, level: startLevel, status:"playing"}`.
   - Selector de nivel inicial (control React ±, 1-10) junto al bezel, visible antes/entre partidas; al cambiarlo llama `setTetrisStartLevel(n)`; en `start`/PLAY AGAIN se aplica.
   - Verificar en navegador: `/game/tetris/play` corre el juego real; flechas/espacio responden sin scroll; HUD refleja score/lines/level en vivo; PAUSE pausa gravedad + audio.

6. **Migración del catálogo `cascade` → `tetris`.**
   - Aplicar migración SQL: `UPDATE public.games SET id='tetris', title='TETRIS', controls=... WHERE id='cascade'`.
   - Verificar: `/library` lista "TETRIS"; el card enlaza a `/game/tetris`; no queda ruta `/game/cascade` funcional.

7. **Verificación E2E con Playwright.**
   - Screenshots en `.playwright-screenshots/YYYY-MM-DD/`.
   - Recorrido: library → TETRIS → elegir nivel → PLAY → countdown → jugar (mover/rotar/soft/hard drop, ghost visible, line-clear suma score) → game over → guardar → volver a `/game/tetris` → confirmar score en el leaderboard.
   - `npm run build` + ESLint sin errores antes de cerrar.

---

## Acceptance Criteria

**Engine**

- [ ] `GameState` tiene `lines?: number` y `lives?: number` (opcional); asteroids sigue compilando y mostrando LIVES.

**Tetris jugable**

- [ ] `/game/tetris/play` carga el juego real (no el mock); mover, rotar (con wall-kicks), soft drop y hard drop funcionan con teclado.
- [ ] Las líneas completas se limpian, el score sigue `LINE_SCORES × level`, el combo incrementa en clears consecutivos y el nivel sube cada 10 líneas.
- [ ] El ghost piece se dibuja en la columna de caída y el countdown 3-2-1 corre antes de que empiece la gravedad.
- [ ] El tablero se dibuja centrado en el canvas 800×600 con paneles laterales NEXT y SCORE/LINES/LEVEL/COMBO; sin distorsión.
- [ ] El HUD de React muestra SCORE / LINES / LEVEL / PLAYER reflejando el estado en vivo.
- [ ] El botón PAUSE pausa y reanuda gravedad **y** audio.
- [ ] El selector de nivel inicial (1-10) junto al bezel fija el nivel de arranque, y se respeta en PLAY AGAIN.
- [ ] No quedan referencias a `getElementById`, start-screen, pause-menu ni high-score localStorage propios del original en `game.ts`.

**Audio**

- [ ] Hay SFX (move/rotate/drop/lineclear/levelup/gameover) y música (menú en la pantalla previa, gameplay tras el countdown).
- [ ] El audio se inicializa en el primer gesto del usuario (sin errores de autoplay-policy) y se limpia al desmontar (`destroy`), sin voces colgadas al salir.
- [ ] Volumen/mute persisten en `localStorage` (`imktetris.audio.*`).

**Catálogo**

- [ ] `/library` muestra "TETRIS" (no "CASCADE"); el id y la ruta son `tetris`; no queda `/game/cascade` funcional.

**Supabase**

- [ ] Al guardar en el game over se inserta una fila en `public.scores` con `game_id="tetris"`, `player` y `score` correctos (esquema sin cambios).
- [ ] El leaderboard de `/game/tetris` muestra los Top scores reales leídos desde `public.scores`.

**Calidad**

- [ ] `npm run build` y ESLint sin errores.
- [ ] Asteroids y los demás juegos siguen sin regresión visible.

---

## Decisiones tomadas y descartadas

| # | Decisión | Elegido | Descartado | Justificación |
| --- | --- | --- | --- | --- |
| 1 | Slot del catálogo | Renombrar `cascade` → `tetris` (id+ruta+título) | Entrada nueva / mantener `cascade` | Mismo patrón que `rocks`→`asteroids`; se quiere "TETRIS" en todos lados |
| 2 | Fuente del port | Standalone `imk-tetris` (rico) | `references/started-games/03-tetris` (simple ~300 líneas) | El dueño pidió portar el proyecto rico con audio/ghost/countdown |
| 3 | Layout en canvas | Tablero centrado + paneles dentro del canvas 800×600 | Letterbox 300×600 / canvas vertical por juego | Aprovecha el ancho; evita generalizar el engine/PlayerView |
| 4 | Audio | Portar `audio.js` completo (SFX + música) | Sin audio / solo SFX | El juego pierde mucho sin él; es autocontenido y sin assets |
| 5 | Skins | Solo Pastel, sin selector | 3 skins con selector | Reduce superficie de UI; Arcade/Glass quedan para otro spec |
| 6 | HUD React | SCORE/LINES/LEVEL/PLAYER (LINES sustituye LIVES) | Extender con COMBO / solo canvas | Mínimo cambio al contrato; combo se ve en el panel del canvas |
| 7 | Persistencia de score | Solo `score` a `public.scores` (sin cambio de esquema) | Añadir columnas lines/combo | Coherencia con asteroids; lines/combo son métricas en vivo |
| 8 | Controles | Solo teclado | Teclado + mouse | Evita chocar con el bezel/UI; menos eventos que portar |
| 9 | Nivel inicial | Control React pre-partida + `setTetrisStartLevel` | Pantalla en canvas / fijar nivel 1 | Limpio y visible; no reintroduce el pause-menu del original |
| 10 | Tema | Paleta oscura fija | Toggle light/dark del juego | El canvas vive en bezel negro; sin lectura de CSS vars externas |
| 11 | Reinicio en game over | `restart()` desde el modal React (relanza countdown) | Reinicio interno del canvas | Evita doble reinicio; consistente con asteroids |

---

## Riesgos identificados

| # | Riesgo | Impacto | Mitigación |
| --- | --- | --- | --- |
| 1 | `game.js` está muy acoplado al DOM (~30 `getElementById`, overlays, pause-menu) | Port largo y propenso a dejar referencias muertas | Portar solo la lógica pura; criterio de aceptación explícito de "sin getElementById/overlays propios" |
| 2 | `audio.js` con `AudioContext` y listeners globales | Errores autoplay-policy / voces colgadas al desmontar | Init perezoso en primer gesto; limpiar nodos y listeners en `destroy`; criterio de aceptación |
| 3 | Inyección de nivel vía variable de módulo (`pendingStartLevel`) | Estado compartido si hubiera 2 instancias | Solo hay un player montado a la vez; se setea justo antes de `start`/`restart` |
| 4 | Scores sembrados con `game_id="cascade"` quedan huérfanos | Leaderboard de tetris arranca vacío | Aceptable: el leaderboard real empieza limpio; los seed de cascade no se muestran en `/game/tetris` |
| 5 | Tablero 4:5 (300×600) dentro de canvas 800×600 | Espacio lateral desaprovechado si los paneles quedan pobres | Diseñar los paneles NEXT/stats para llenar los costados con intención |
| 6 | Web Audio sin gesto previo en navegación SPA | El primer sonido podría perderse | `play()` difiere la voz vía `ctx.resume().then(...)` cuando el contexto no corre aún |

---

## What is **not** in this spec

- Skins Arcade/Glass y su selector.
- Freeze mode (tecla F).
- Controles de mouse.
- Toggle light/dark propio del juego.
- Persistir lines/combo en `public.scores`.
- Start screen y pause-menu propios del original.
- Portar otros juegos; autenticación real de Supabase; soporte táctil/móvil.

Cada uno de esos, si llega, va en su propio spec.
