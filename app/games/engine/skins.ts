// ===========================================================================
// Game skins — the source of truth for how a game colors its canvas.
//
// A `GameSkin` is a flat palette of semantic color tokens. Games must draw
// exclusively through the skin they receive on `GameContext.skin` instead of
// hardcoding hex/rgba literals at draw sites. This keeps every game visually
// consistent and reskinnable from one place.
//
// `PASTEL` is the project's default skin. Its values are derived from the app
// theme in `app/globals.css` (so games sit in the same Arcade-Vault world as
// the surrounding UI) and from the soft pastel entity hues already used by
// Tetris. `DEFAULT_SKIN` is what the engine injects into every game.
//
// Owned by the `skin-designer` agent (see `.opencode/agent/skin-designer.md`).
// ===========================================================================

export interface GameSkin {
  /** Stable identifier, e.g. "pastel". */
  id: string;
  /** Human-readable name, e.g. "Pastel". */
  name: string;

  // --- Backdrop & surfaces (cohesive with globals.css) ---------------------
  /** Full-canvas backdrop fill. */
  bg: string;
  /** Play-area / board "well" fill (a darker inset behind gameplay). */
  well: string;
  /** Panels, preview boxes, and inset chrome. */
  surface: string;
  /** Faint grid lines (rgba). */
  grid: string;
  /** Play-area / panel borders (rgba). */
  border: string;

  // --- Foreground entity palette (shared soft pastels) ---------------------
  /**
   * Ordered set of pastel hues for game entities (pieces, ships, rocks,
   * pickups, …). Games index into this for per-entity coloring.
   */
  entities: string[];

  // --- Text ----------------------------------------------------------------
  /** Primary on-canvas text. */
  text: string;
  /** Secondary text. */
  textMuted: string;
  /** Labels / hints. */
  textFaint: string;

  // --- HUD accents (echo the app chrome inside the canvas) ------------------
  /** Primary highlight (the app's lime accent). */
  accent: string;
  /** Score / combo emphasis (the app's gold). */
  gold: string;

  // --- Effects & overlays --------------------------------------------------
  /** Base particle / spark color; games modulate its alpha. */
  particle: string;
  /** Thruster / energy glow (warm accent). */
  flame: string;
  /** Dim layer behind pause / countdown / game-over text (rgba). */
  overlay: string;
}

/**
 * Pastel — the default project skin. A soft, luminous entity palette glowing
 * on the dark Arcade-Vault base. Color values mirror `app/globals.css` tokens
 * and Tetris's existing pastel hues so the look stays cohesive end-to-end.
 */
export const PASTEL: GameSkin = {
  id: "pastel",
  name: "Pastel",

  bg: "#0b0c10", // globals --bg
  well: "#06070a", // darker inset behind gameplay
  surface: "#14161c", // globals --surface-1
  grid: "rgba(255, 255, 255, 0.05)",
  border: "rgba(255, 255, 255, 0.12)",

  entities: [
    "#7dd9e8", // cyan
    "#f3d97d", // butter
    "#c9a8e0", // lavender
    "#85d99f", // mint
    "#f09bb5", // rose
    "#748ae8", // periwinkle
    "#f0ab6f", // peach
  ],

  text: "#f2f3f5", // globals --text
  textMuted: "#a7afbd", // globals --text-muted
  textFaint: "#8a92a3", // globals --text-faint

  accent: "#bef264", // globals --accent (lime)
  gold: "#fbbf24", // globals --gold

  particle: "#f2f3f5",
  flame: "#f0ab6f", // pastel-aligned warm glow
  overlay: "rgba(7, 8, 12, 0.62)",
};

/** Registry of available skins, keyed by id. Pastel is the only one for now. */
export const SKINS: Record<string, GameSkin> = {
  [PASTEL.id]: PASTEL,
};

/** The skin the engine injects into every game by default. */
export const DEFAULT_SKIN: GameSkin = PASTEL;
