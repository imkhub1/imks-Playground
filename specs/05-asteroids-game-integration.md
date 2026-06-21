# 05 — Asteroids: primer juego real + engine de canvas + scores en Supabase

- **Estado:** Implemented
- **Dependencias:** Spec 04 (cliente Supabase browser/SSR en `utils/supabase/`). Catálogo en `app/lib/games.ts`, estado global en `app/components/AppStateProvider.tsx`, leaderboard en `app/lib/scores.ts`.
- **Fecha:** 2026-06-21
- **Objetivo:** Convertir el Asteroids de `references/` en el primer juego jugable de la plataforma, montado mediante un engine de canvas reutilizable y con puntajes reales persistidos en Supabase.

---

## Scope

### Dentro

- **Engine reutilizable** (`app/games/engine/`): hook + contrato de tipos para montar cualquier juego de canvas en React, con ciclo de vida (start/pause/resume/destroy), loop con `requestAnimationFrame`, escalado responsivo y manejo de teclado acotado y limpiable.
- **Puerto de Asteroids** (`app/games/asteroids/game.ts`): refactor de `references/started-games/02-asteroids/game.js` a un módulo que cumple el contrato del engine. Conserva clases (`Bullet`, `Asteroid`, `Ship`, `Particle`, `PowerUp`), HUD en canvas, niveles, 3 vidas, power-up de triple disparo y partículas. Deja de auto-arrancar y de tocar el DOM global.
- **Puente de estado a React:** el juego emite `onState({score, lives, level, status})` en cada cambio y `onGameOver(finalScore)` al terminar; el HUD de React (SCORE/LIVES/LEVEL/PLAYER en `PlayerView`) se alimenta de ahí. Ambos HUD (canvas + React) coexisten.
- **Registro de juegos reales:** mapa `gameId → GameFactory` en `app/games/registry.ts`; solo `asteroids` registrado ahora. `PlayerView` renderiza el engine si el juego está registrado; si no, cae al mock actual (los otros 7 siguen igual).
- **Renombrar el catálogo:** en `app/lib/games.ts`, la entrada `rocks` pasa a `id: "asteroids"`, `title: "ASTEROIDS"`. Ruta resultante `/game/asteroids` y `/game/asteroids/play`. El glifo `icon: "rocks"` se mantiene.
- **Supabase — persistencia de puntajes:**
  - Migración: tabla `public.scores` + RLS (lectura pública, insert anónimo validado).
  - Guardado: al terminar la partida, el `GameOverModal` inserta el puntaje en Supabase vía cliente browser.
  - Lectura: el leaderboard de `asteroids` (en `DetailView`) lee los Top scores reales desde Supabase.
- **Control de pausa:** el botón PAUSE de `PlayerView` pausa/reanuda el engine.
- **Localización:** traducir los textos en español del HUD/overlay del canvas (`NIVEL`, `PUNTAJE`, `ESPACIO PARA REINICIAR`) a inglés para alinear con la plataforma.

### Fuera (explícito)

- Portar tetris y arkanoid (solo se establece el patrón reutilizable).
- Autenticación real de Supabase — el `user` sigue siendo el mock de localStorage; el `player` se toma del nombre ingresado en el modal / "GUEST". Migrar el login a Supabase Auth es otro spec.
- Migrar a Supabase los leaderboards de los otros 7 juegos ni el `hall-of-fame` (siguen con datos sembrados de `scores.ts`).
- Anti-cheat / validación server-side de puntajes.
- Sonido (el juego original no tiene audio).
- Soporte táctil/móvil para los controles (solo teclado, como el original).

---

## Data Model

### Tabla Supabase `public.scores`

| Columna      | Tipo          | Notas                                                              |
| ------------ | ------------- | ------------------------------------------------------------------ |
| `id`         | `uuid`        | PK, `default gen_random_uuid()`                                    |
| `game_id`    | `text`        | id del juego (ej. `"asteroids"`); indexado                         |
| `player`     | `text`        | nombre mostrado, ≤14 chars, mayúsculas; `check (char_length >= 1)` |
| `score`      | `integer`     | `check (score >= 0)`                                               |
| `created_at` | `timestamptz` | `default now()`                                                    |

- **Índice:** `(game_id, score desc)` para el leaderboard.
- **RLS:** habilitado. Política `select` pública (anon + authenticated). Política `insert` pública con `check (score >= 0 and char_length(player) between 1 and 14)`. Sin `update`/`delete`.

### Tipos TS del engine (`app/games/engine/types.ts`)

```ts
export type GameStatus = "playing" | "dead" | "gameover";

export interface GameState {
  score: number;
  lives: number;
  level: number;
  status: GameStatus;
}

export interface GameContext {
  canvas: HTMLCanvasElement;
  onState: (s: GameState) => void;
  onGameOver: (finalScore: number) => void;
}

export interface GameController {
  start(): void;
  pause(): void;
  resume(): void;
  restart(): void;
  destroy(): void;
}

export type GameFactory = (ctx: GameContext) => GameController;
```

### Registro (`app/games/registry.ts`)

```ts
import { createAsteroids } from "./asteroids/game";
import type { GameFactory } from "./engine/types";

export const GAME_FACTORIES: Record<string, GameFactory> = {
  asteroids: createAsteroids,
};
```

---

## Implementation Plan

Cada paso deja el sistema compilando y navegable.

1. **Engine: tipos + hook.**
   - Crear `app/games/engine/types.ts` con el contrato de arriba.
   - Crear `app/games/engine/useCanvasGame.ts`: hook que recibe `factory` + callbacks, mantiene una `ref` al canvas, instancia el controller, gestiona `start`/`destroy` en mount/unmount y expone `pause`/`resume`/`restart`. El canvas usa resolución interna 800×600 y escala por CSS preservando el aspecto (letterbox dentro del bezel 16:9). Los listeners de teclado se registran al `start`, se remueven al `destroy`, y hacen `preventDefault` en flechas/`Space` para que la página no haga scroll.
   - Verificar: `npm run build` y typecheck OK (sin consumidores aún).

2. **Puerto de Asteroids.**
   - Crear `app/games/asteroids/game.ts`: refactor de `references/started-games/02-asteroids/game.js` exportando `createAsteroids(ctx: GameContext): GameController`.
     - Quitar `document.getElementById`, `window.addEventListener` globales y el `requestAnimationFrame` de auto-arranque.
     - El contexto 2D se obtiene de `ctx.canvas.getContext("2d")`.
     - Encapsular todo el estado global (`ship`, `bullets`, `asteroids`, `particles`, `powerUps`, `score`, `lives`, `level`, `state`) en el closure del factory.
     - Conservar: HUD en canvas, overlay de game over, niveles, 3 vidas con invencibilidad parpadeante, power-up de triple disparo, partículas de explosión.
     - Emitir `ctx.onState(...)` cuando cambie score/lives/level/status.
     - Emitir `ctx.onGameOver(finalScore)` al pasar a `"gameover"`.
     - Quitar el reinicio con `Space` en game over — lo maneja el modal React vía `controller.restart()`.
     - Traducir textos: `NIVEL` → `LEVEL`, `PUNTAJE` → `SCORE`, `ESPACIO PARA REINICIAR` → `PRESS PLAY AGAIN`.
   - Verificar: typecheck OK.

3. **Registro + render real en `PlayerView`.**
   - Crear `app/games/registry.ts` con `GAME_FACTORIES`.
   - Modificar `app/game/[id]/play/PlayerView.tsx`:
     - Si `GAME_FACTORIES[game.id]` existe: montar `useCanvasGame` dentro del bezel; alimentar el HUD de React desde `onState`; el botón PAUSE llama `pause`/`resume`; eliminar el intervalo de "score al azar".
     - Si no existe: mantener el mock actual (los otros 7 juegos no se tocan).
   - Verificar en navegador: `/game/asteroids/play` muestra el juego real; flechas/espacio responden sin scroll; HUD de React refleja score/lives/level en vivo.

4. **Renombrar entrada del catálogo.**
   - En `app/lib/games.ts`: `id: "rocks"` → `id: "asteroids"`, `title: "ROCKS"` → `"ASTEROIDS"`. Mantener `icon: "rocks"`, `category: "SHOOTER"`, `seed: 41200`, `controls`.
   - Verificar: `/library` lista "ASTEROIDS"; el card enlaza a `/game/asteroids`; ninguna ruta `/game/rocks` queda funcional.

5. **Supabase: migración de la tabla `scores`.**
   - Aplicar migración con `apply_migration`: tabla, índice y políticas RLS descritas en Data Model.
   - Verificar con `list_tables` que `public.scores` existe y RLS está activo; `get_advisors` (security) sin hallazgos críticos.

6. **Guardado real de puntaje.**
   - Crear `app/lib/supabaseScores.ts` con:
     - `saveScore(gameId: string, player: string, score: number): Promise<void>` — insert con el cliente browser de `utils/supabase/client.ts`.
     - `fetchLeaderboard(gameId: string, limit = 10): Promise<ScoreRow[]>` — `select ... order by score desc limit`.
   - Modificar `GameOverModal` en `PlayerView.tsx`: al "SAVE SCORE", llamar `saveScore`; mantener `submitScore` (localStorage) para el highlight "YOU" en sesión.
   - "PLAY AGAIN" → `controller.restart()`; "BACK TO LIBRARY" igual que hoy.
   - Verificar: completar una partida, guardar; la fila aparece en Supabase.

7. **Leaderboard real en `DetailView`.**
   - Para `asteroids`: cargar Top scores desde `fetchLeaderboard` en un `useEffect` y pasarlos a `ScoreTable`.
   - Para los otros juegos: seguir con `getLeaderboard` sembrado (sin cambios).
   - Verificar: el puntaje guardado en el paso 6 aparece en `/game/asteroids` bajo TOP SCORES.

8. **Verificación E2E con Playwright.**
   - Screenshots en `.playwright-screenshots/YYYY-MM-DD/`.
   - Recorrido completo: library → ASTEROIDS → PLAY → jugar → game over → guardar → volver a `/game/asteroids` → confirmar que el puntaje aparece en el leaderboard.
   - `npm run build` + ESLint sin errores antes de cerrar.

---

## Acceptance Criteria

**Engine**

- [ ] `app/games/engine/useCanvasGame.ts` monta un canvas, corre el loop y limpia listeners + RAF al desmontar (sin fugas de memoria).
- [ ] Flechas y `Space` no hacen scroll de la página mientras el juego está activo.
- [ ] El canvas escala dentro del bezel conservando el aspecto 800×600 (sin distorsión).

**Asteroids jugable**

- [ ] `/game/asteroids/play` carga el juego real (no el mock); rotar/propulsar/disparar funcionan.
- [ ] Los asteroides se parten (grande → mediano → pequeño), hay 3 vidas con invencibilidad parpadeante, los niveles avanzan al limpiar la pantalla y el power-up 3x funciona.
- [ ] El HUD de React (SCORE/LIVES/LEVEL/PLAYER) refleja en vivo el estado del juego.
- [ ] El botón PAUSE de la plataforma pausa y reanuda el juego.
- [ ] No quedan textos en español en el HUD ni en los overlays del canvas.

**Catálogo**

- [ ] `/library` muestra "ASTEROIDS" (no "ROCKS"); el id y la ruta son `asteroids`.

**Supabase**

- [ ] Existe `public.scores` con RLS activo (select público, insert público validado, sin update/delete).
- [ ] Al guardar en el game over, se inserta una fila con `game_id="asteroids"`, `player` y `score` correctos.
- [ ] El leaderboard de `/game/asteroids` muestra los Top scores reales leídos desde Supabase.

**Calidad**

- [ ] `npm run build` y ESLint sin errores.
- [ ] Los otros 7 juegos siguen mostrando su mock y leaderboard sembrado sin regresión visible.

---

## Decisiones tomadas y descartadas

| #   | Decisión                  | Elegido                                          | Descartado                              | Justificación                                                         |
| --- | ------------------------- | ------------------------------------------------ | --------------------------------------- | --------------------------------------------------------------------- |
| 1   | Abstracción               | Engine genérico + Asteroids primero              | One-off directo                         | Es el primer juego real; tetris/arkanoid reutilizarán el patrón       |
| 2   | Slot del catálogo         | Renombrar `rocks` → `asteroids` (id+ruta+título) | Entrada nueva aparte / mantener `rocks` | El dueño quiere que se llame Asteroids en todo                        |
| 3   | HUD                       | Canvas propio + notifica a React (ambos)         | Solo React / solo canvas                | El juego es autocontenido; React necesita el estado para su HUD/modal |
| 4   | Puntajes                  | Supabase ahora (tabla + RLS)                     | Solo localStorage                       | Decisión del dueño; el cliente ya existe (spec 04)                    |
| 5   | Reinicio en game over     | `restart()` desde el modal React                 | Mantener `Space`=reiniciar del canvas   | Evita doble reinicio y conflicto con el modal de la plataforma        |
| 6   | Carpeta del engine/juegos | `app/games/`                                     | `lib/games/` (ya usado para datos)      | Separa lógica de juego de los datos del catálogo                      |
| 7   | Identidad del jugador     | Nombre del modal (user mock/guest)               | Esperar a Supabase Auth                 | Auth real es otro spec; no bloquear este                              |

---

## Riesgos identificados

| #   | Riesgo                                             | Impacto                              | Mitigación                                                                                        |
| --- | -------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------- |
| 1   | Insert anónimo en `scores` permite puntajes falsos | Leaderboard manipulable              | Aceptable para MVP arcade; validación `check` básica; anti-cheat server-side queda para otro spec |
| 2   | RAF/listeners no se limpian al cambiar de ruta     | Fugas de memoria, dobles inputs      | El engine limpia en `destroy`; criterio de aceptación explícito                                   |
| 3   | `game.js` asume DOM global (canvas, window)        | Roturas al portar a React/SSR        | El módulo recibe el canvas por `ctx`; sin `document`/`window` globales; todo client-side          |
| 4   | Doble HUD (canvas + React) puede verse redundante  | UX cargada                           | Decisión explícita del dueño; se puede afinar visualmente en otro spec                            |
| 5   | Aspecto 4:3 (800×600) dentro de bezel 16:9         | Letterboxing / franjas negras        | Escalado con preservación de aspecto centrado en el engine                                        |
| 6   | `@supabase/ssr` + Next.js 16 no estándar           | API de cookies/cliente puede diferir | Leer `node_modules/next/dist/docs/` y los helpers del spec 04 antes de codear el guardado         |
