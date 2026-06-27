/* ============================================================
   TETRIS – game.ts  (port of imk-tetris/game.js)
   Logic ported to the platform's GameFactory → GameController
   contract. Renders entirely inside the 800×600 game canvas:
   board centered, side panels for NEXT + SCORE/LINES/LEVEL/COMBO.
   No DOM access, no high-score localStorage, no start/pause menus
   (those are provided by the React PlayerView).
   ============================================================ */

import type {
  GameContext,
  GameController,
  GameState,
  GameStatus,
} from "../engine/types";
import { createSfx } from "./audio";

// ── Canvas / board geometry ──────────────────────────────────
const W = 800;
const H = 600;
const COLS = 10;
const ROWS = 20;
const BLOCK = 30; // board 300×600
const NEXT_BLOCK = 24;
const BOARD_W = COLS * BLOCK; // 300
const BOARD_H = ROWS * BLOCK; // 600
const BOARD_X = (W - BOARD_W) / 2; // 250 — centered
const BOARD_Y = (H - BOARD_H) / 2; // 0

const COUNTDOWN_MS = 3000;
const LINE_SCORES = [0, 100, 300, 500, 800];

// Neighbor bitmask (top/right/bottom/left) for merged-cell rendering.
const NB_TOP = 1,
  NB_RIGHT = 2,
  NB_BOTTOM = 4,
  NB_LEFT = 8;

// Piece colors come from the injected skin (`ctx.skin.entities`): a piece's
// colorIdx (1-7) maps to `skin.entities[colorIdx - 1]`.

// Piece definitions: square matrices, index matches the entity palette (1-7).
const PIECES: (number[][] | null)[] = [
  null,
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ], // I
  [
    [2, 2],
    [2, 2],
  ], // O
  [
    [0, 3, 0],
    [3, 3, 3],
    [0, 0, 0],
  ], // T
  [
    [0, 4, 4],
    [4, 4, 0],
    [0, 0, 0],
  ], // S
  [
    [5, 5, 0],
    [0, 5, 5],
    [0, 0, 0],
  ], // Z
  [
    [6, 0, 0],
    [6, 6, 6],
    [0, 0, 0],
  ], // J
  [
    [0, 0, 7],
    [7, 7, 7],
    [0, 0, 0],
  ], // L
];

interface Piece {
  matrix: number[][];
  x: number;
  y: number;
  colorIdx: number;
}

// ── Brick rendering helpers ───────────────────────────────────
function shade(hex: string, amt: number): string {
  const h = hex.replace("#", "");
  let r = parseInt(h.slice(0, 2), 16);
  let g = parseInt(h.slice(2, 4), 16);
  let b = parseInt(h.slice(4, 6), 16);
  if (amt >= 0) {
    r += (255 - r) * amt;
    g += (255 - g) * amt;
    b += (255 - b) * amt;
  } else {
    const k = 1 + amt;
    r *= k;
    g *= k;
    b *= k;
  }
  return `rgb(${r | 0},${g | 0},${b | 0})`;
}

/** Re-emit a `#rrggbb` skin token as an rgba() string at the given alpha. */
function withAlpha(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radii: { tl: number; tr: number; br: number; bl: number },
): void {
  const { tl, tr, br, bl } = radii;
  ctx.beginPath();
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + w - tr, y);
  if (tr) ctx.arcTo(x + w, y, x + w, y + tr, tr);
  ctx.lineTo(x + w, y + h - br);
  if (br) ctx.arcTo(x + w, y + h, x + w - br, y + h, br);
  ctx.lineTo(x + bl, y + h);
  if (bl) ctx.arcTo(x, y + h, x, y + h - bl, bl);
  ctx.lineTo(x, y + tl);
  if (tl) ctx.arcTo(x, y, x + tl, y, tl);
  ctx.closePath();
}

function cornerRadii(neighbors: number, radius: number) {
  const open = (side: number) => (neighbors & side) === 0;
  const t = open(NB_TOP),
    r = open(NB_RIGHT),
    b = open(NB_BOTTOM),
    l = open(NB_LEFT);
  return {
    tl: t && l ? radius : 0,
    tr: t && r ? radius : 0,
    br: b && r ? radius : 0,
    bl: b && l ? radius : 0,
  };
}

function bevelEdges(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  neighbors: number,
  hi: string,
  lo: string,
  thick: number,
): void {
  if ((neighbors & NB_TOP) === 0) {
    ctx.fillStyle = hi;
    ctx.fillRect(x, y, w, thick);
  }
  if ((neighbors & NB_LEFT) === 0) {
    ctx.fillStyle = hi;
    ctx.fillRect(x, y, thick, h);
  }
  if ((neighbors & NB_BOTTOM) === 0) {
    ctx.fillStyle = lo;
    ctx.fillRect(x, y + h - thick, w, thick);
  }
  if ((neighbors & NB_RIGHT) === 0) {
    ctx.fillStyle = lo;
    ctx.fillRect(x + w - thick, y, thick, h);
  }
}

const pendingStartLevelDefault = 1;
let pendingStartLevel = pendingStartLevelDefault;

/** Set the starting level applied on the next start()/restart(). */
export function setTetrisStartLevel(n: number): void {
  pendingStartLevel = Math.min(10, Math.max(1, Math.floor(n) || 1));
}

export function createTetris(gameCtx: GameContext): GameController {
  const canvas = gameCtx.canvas;
  const ctx = canvas.getContext("2d")!;
  const { skin } = gameCtx;
  const sfx = createSfx();

  // ── State (closure-scoped) ─────────────────────────────────
  let board: number[][] = createBoard();
  let current: Piece | null = null;
  let next: Piece = randomPiece();
  let score = 0;
  let lines = 0;
  let level = 1;
  let combo = 0;
  let startLevel = 1;
  let dropInterval = calcDropInterval(1);

  let status: GameStatus = "playing";
  let counting = false;
  let countStart: number | null = null;
  let countShown: number | null = null;

  let paused = false;
  let lastTime: number | null = null;
  let accumulated = 0;
  let rafId: number | null = null;
  let gameOverEmitted = false;

  // Line-clear flash animation.
  let clearing = false;
  let clearRows: number[] = [];
  let clearStart = 0;
  const CLEAR_DURATION = 320;

  let lastEmitted: string | null = null;

  // ── Board / pieces ─────────────────────────────────────────
  function createBoard(): number[][] {
    return Array.from({ length: ROWS }, () => new Array<number>(COLS).fill(0));
  }

  function randomPiece(): Piece {
    const idx = Math.floor(Math.random() * 7) + 1; // 1-7
    return {
      matrix: PIECES[idx]!.map((row) => [...row]),
      x: 0,
      y: 0,
      colorIdx: idx,
    };
  }

  function calcDropInterval(lvl: number): number {
    return Math.max(50, 1000 - (lvl - 1) * 90);
  }

  function spawn(): void {
    current = next;
    current.x = Math.floor((COLS - current.matrix[0].length) / 2);
    current.y = 0;
    next = randomPiece();
    if (collide(current)) endGame();
  }

  // ── Collision / rotation / movement ────────────────────────
  function collide(piece: Piece): boolean {
    const { matrix, x, y } = piece;
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (!matrix[r][c]) continue;
        const nx = x + c;
        const ny = y + r;
        if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
        if (ny >= 0 && board[ny][nx]) return true;
      }
    }
    return false;
  }

  function rotateCW(matrix: number[][]): number[][] {
    return matrix[0].map((_, c) => matrix.map((row) => row[c]).reverse());
  }

  function tryRotate(): void {
    if (!current) return;
    const rotated = rotateCW(current.matrix);
    const kicks = [0, 1, -1, 2, -2]; // wall-kicks ±1, ±2
    for (const kick of kicks) {
      const test: Piece = { ...current, matrix: rotated, x: current.x + kick };
      if (!collide(test)) {
        current = test;
        sfx.play("rotate");
        return;
      }
    }
  }

  function tryMove(dx: number): void {
    if (!current) return;
    const test: Piece = { ...current, x: current.x + dx };
    if (!collide(test)) {
      current = test;
      sfx.play("move");
    }
  }

  function softDrop(): void {
    if (!current) return;
    const test: Piece = { ...current, y: current.y + 1 };
    if (!collide(test)) {
      current = test;
      score += 1; // +1 per row
      sfx.play("softdrop");
      emitState();
    } else {
      lockPiece();
    }
  }

  function hardDrop(): void {
    if (!current) return;
    let dropped = 0;
    while (true) {
      const test: Piece = { ...current, y: current.y + 1 };
      if (collide(test)) break;
      current = test;
      dropped++;
    }
    score += dropped * 2; // +2 per cell
    sfx.play("harddrop");
    emitState();
    lockPiece(true);
  }

  // ── Lock / clear / scoring ─────────────────────────────────
  function lockPiece(viaHardDrop = false): void {
    if (!current) return;
    const { matrix, x, y } = current;
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (!matrix[r][c]) continue;
        const ny = y + r;
        if (ny < 0) {
          endGame();
          return;
        }
        board[ny][x + c] = matrix[r][c];
      }
    }

    const full = getFullRows();
    if (!viaHardDrop) sfx.play("lock");
    if (full.length > 0) sfx.play("lineclear", full.length);

    if (full.length === 0) {
      combo = 0; // reset combo on lock with no clears
      emitState();
      spawn();
      return;
    }

    // Defer the actual clear until the flash animation finishes.
    clearing = true;
    clearRows = full;
    clearStart = performance.now();
  }

  function getFullRows(): number[] {
    const rows: number[] = [];
    for (let r = 0; r < ROWS; r++) {
      if (board[r].every((cell) => cell !== 0)) rows.push(r);
    }
    return rows;
  }

  function applyLineClear(rows: number[]): void {
    const cleared = rows.length;
    if (cleared === 0) return;

    const drop = new Set(rows);
    const kept = board.filter((_, r) => !drop.has(r));
    while (kept.length < ROWS) kept.unshift(new Array<number>(COLS).fill(0));
    board = kept;

    combo++;
    lines += cleared;
    score += LINE_SCORES[cleared] * level;
    const prevLevel = level;
    level = startLevel + Math.floor(lines / 10);
    dropInterval = calcDropInterval(level);
    if (level > prevLevel) sfx.play("levelup");
  }

  // ── Ghost ──────────────────────────────────────────────────
  function getGhostY(): number {
    if (!current) return 0;
    let gy = current.y;
    while (true) {
      const test: Piece = { ...current, y: gy + 1 };
      if (collide(test)) break;
      gy++;
    }
    return gy;
  }

  // ── Game over ──────────────────────────────────────────────
  function endGame(): void {
    if (status === "gameover") return;
    status = "gameover";
    counting = false;
    countStart = null;
    clearing = false;
    sfx.play("gameover");
    sfx.stopGameplayMusic();
    emitState();
    if (!gameOverEmitted) {
      gameOverEmitted = true;
      gameCtx.onGameOver(score);
    }
  }

  // ── State bridge ───────────────────────────────────────────
  function emitState(): void {
    const s: GameState = { score, lines, level, status };
    const key = `${score}|${lines}|${level}|${status}`;
    if (key === lastEmitted) return;
    lastEmitted = key;
    gameCtx.onState(s);
  }

  // ── Init / restart ─────────────────────────────────────────
  function initGame(): void {
    startLevel = pendingStartLevel;
    board = createBoard();
    score = 0;
    lines = 0;
    level = startLevel;
    combo = 0;
    dropInterval = calcDropInterval(level);
    lastTime = null;
    accumulated = 0;
    paused = false;
    status = "playing";
    counting = true;
    countStart = null;
    countShown = null;
    clearing = false;
    clearRows = [];
    gameOverEmitted = false;
    lastEmitted = null;

    next = randomPiece();
    spawn();
    emitState();

    sfx.unlock();
    sfx.play("gamestart");
    sfx.startMenuMusic(); // pre-game ambience during the countdown
  }

  // ── Rendering ──────────────────────────────────────────────
  function drawBlock(
    c2d: CanvasRenderingContext2D,
    col: number,
    row: number,
    color: string,
    size: number,
    neighbors = 0,
  ): void {
    const x = col * size;
    const y = row * size;
    const rx = x + 1,
      ry = y + 1,
      w = size - 2,
      h = size - 2;
    const radius = Math.max(2, size * 0.18);
    const radii = cornerRadii(neighbors, radius);

    const grad = c2d.createLinearGradient(0, ry, 0, ry + h);
    grad.addColorStop(0, shade(color, 0.12));
    grad.addColorStop(0.5, color);
    grad.addColorStop(1, shade(color, -0.16));
    roundRectPath(c2d, rx, ry, w, h, radii);
    c2d.fillStyle = grad;
    c2d.fill();

    c2d.save();
    roundRectPath(c2d, rx, ry, w, h, radii);
    c2d.clip();
    const hi = withAlpha(skin.particle, 0.38);
    const lo = withAlpha(skin.well, 0.26);
    bevelEdges(c2d, rx, ry, w, h, neighbors, hi, lo, 1.5);
    c2d.restore();

    roundRectPath(c2d, rx + 0.5, ry + 0.5, w - 1, h - 1, radii);
    c2d.strokeStyle = withAlpha(skin.particle, 0.16);
    c2d.lineWidth = 1;
    c2d.stroke();
  }

  function boardNeighbors(r: number, c: number): number {
    const v = board[r][c];
    let m = 0;
    if (r > 0 && board[r - 1][c] === v) m |= NB_TOP;
    if (c < COLS - 1 && board[r][c + 1] === v) m |= NB_RIGHT;
    if (r < ROWS - 1 && board[r + 1][c] === v) m |= NB_BOTTOM;
    if (c > 0 && board[r][c - 1] === v) m |= NB_LEFT;
    return m;
  }

  function matrixNeighbors(matrix: number[][], r: number, c: number): number {
    let m = 0;
    if (r > 0 && matrix[r - 1][c]) m |= NB_TOP;
    if (c < matrix[r].length - 1 && matrix[r][c + 1]) m |= NB_RIGHT;
    if (r < matrix.length - 1 && matrix[r + 1] && matrix[r + 1][c])
      m |= NB_BOTTOM;
    if (c > 0 && matrix[r][c - 1]) m |= NB_LEFT;
    return m;
  }

  function drawGrid(): void {
    ctx.strokeStyle = skin.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let c = 1; c < COLS; c++) {
      const gx = c * BLOCK + 0.5;
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, BOARD_H);
    }
    for (let r = 1; r < ROWS; r++) {
      const gy = r * BLOCK + 0.5;
      ctx.moveTo(0, gy);
      ctx.lineTo(BOARD_W, gy);
    }
    ctx.stroke();
  }

  function drawBoardCells(): void {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (board[r][c]) {
          drawBlock(
            ctx,
            c,
            r,
            skin.entities[board[r][c] - 1],
            BLOCK,
            boardNeighbors(r, c),
          );
        }
      }
    }
  }

  function drawGhost(): void {
    if (!current) return;
    const gy = getGhostY();
    ctx.globalAlpha = 0.32;
    const { matrix, x } = current;
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (matrix[r][c]) {
          drawBlock(
            ctx,
            x + c,
            gy + r,
            skin.entities[current.colorIdx - 1],
            BLOCK,
            matrixNeighbors(matrix, r, c),
          );
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  function drawActivePiece(): void {
    if (!current) return;
    const { matrix, x, y, colorIdx } = current;
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (matrix[r][c]) {
          drawBlock(
            ctx,
            x + c,
            y + r,
            skin.entities[colorIdx - 1],
            BLOCK,
            matrixNeighbors(matrix, r, c),
          );
        }
      }
    }
  }

  function drawClearAnim(): void {
    const p = Math.min(1, (performance.now() - clearStart) / CLEAR_DURATION);
    for (const r of clearRows) {
      const y = r * BLOCK;
      if (p < 0.5) {
        const a = Math.sin((p / 0.5) * Math.PI) * 0.92;
        ctx.fillStyle = withAlpha(skin.particle, a);
        ctx.fillRect(0, y, BOARD_W, BLOCK);
      } else {
        const q = (p - 0.5) / 0.5;
        ctx.clearRect(0, y, BOARD_W, BLOCK);
        const h = Math.max(1, BLOCK * (1 - q));
        const yy = y + (BLOCK - h) / 2;
        ctx.save();
        ctx.globalAlpha = 1 - q;
        ctx.fillStyle = withAlpha(skin.particle, 0.9);
        ctx.fillRect(0, yy, BOARD_W, h);
        ctx.restore();
      }
    }
  }

  // ── Side panels ────────────────────────────────────────────
  function panelLabel(text: string, x: number, y: number): void {
    ctx.fillStyle = skin.textFaint;
    ctx.font = "600 11px monospace";
    ctx.textAlign = "left";
    ctx.fillText(text, x, y);
  }

  function panelValue(
    text: string,
    x: number,
    y: number,
    color = skin.text,
  ): void {
    ctx.fillStyle = color;
    ctx.font = "700 26px monospace";
    ctx.textAlign = "left";
    ctx.fillText(text, x, y);
  }

  function drawLeftPanel(): void {
    const x = 28;
    let y = 70;
    const rows: [string, string, string?][] = [
      ["SCORE", String(score), skin.accent],
      ["LINES", String(lines)],
      ["LEVEL", String(level)],
      [
        "COMBO",
        combo > 1 ? `${combo}×` : "—",
        combo > 1 ? skin.gold : skin.textFaint,
      ],
    ];
    for (const [label, value, color] of rows) {
      panelLabel(label, x, y);
      panelValue(value, x, y + 30, color);
      y += 72;
    }
  }

  function drawRightPanel(): void {
    const px = BOARD_X + BOARD_W; // 550
    const panelW = W - px; // 250
    panelLabel("NEXT", px + 28, 70);

    // Preview box.
    const boxW = 150;
    const boxH = 120;
    const boxX = px + (panelW - boxW) / 2;
    const boxY = 86;
    ctx.fillStyle = skin.surface;
    ctx.strokeStyle = skin.border;
    ctx.lineWidth = 1;
    roundRectPath(ctx, boxX, boxY, boxW, boxH, {
      tl: 10,
      tr: 10,
      br: 10,
      bl: 10,
    });
    ctx.fill();
    ctx.stroke();

    // Centered next piece.
    const { matrix, colorIdx } = next;
    let minR = matrix.length,
      maxR = -1,
      minC = matrix[0].length,
      maxC = -1;
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (!matrix[r][c]) continue;
        if (r < minR) minR = r;
        if (r > maxR) maxR = r;
        if (c < minC) minC = c;
        if (c > maxC) maxC = c;
      }
    }
    const occCols = maxC - minC + 1;
    const occRows = maxR - minR + 1;
    const offX = boxX + (boxW - occCols * NEXT_BLOCK) / 2 - minC * NEXT_BLOCK;
    const offY = boxY + (boxH - occRows * NEXT_BLOCK) / 2 - minR * NEXT_BLOCK;
    ctx.save();
    ctx.translate(offX, offY);
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (matrix[r][c]) {
          drawBlock(
            ctx,
            c,
            r,
            skin.entities[colorIdx - 1],
            NEXT_BLOCK,
            matrixNeighbors(matrix, r, c),
          );
        }
      }
    }
    ctx.restore();
  }

  function drawCountdown(): void {
    if (countShown == null) return;
    ctx.save();
    ctx.fillStyle = skin.overlay;
    ctx.fillRect(0, 0, BOARD_W, BOARD_H);
    ctx.fillStyle = skin.text;
    ctx.font = "800 120px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(countShown), BOARD_W / 2, BOARD_H / 2);
    ctx.textBaseline = "alphabetic";
    ctx.restore();
  }

  function drawGameOver(): void {
    ctx.save();
    ctx.fillStyle = skin.overlay;
    ctx.fillRect(0, 0, BOARD_W, BOARD_H);
    ctx.fillStyle = skin.text;
    ctx.textAlign = "center";
    ctx.font = "800 36px monospace";
    ctx.fillText("GAME OVER", BOARD_W / 2, BOARD_H / 2);
    ctx.restore();
  }

  function draw(): void {
    // Backdrop.
    ctx.fillStyle = skin.bg;
    ctx.fillRect(0, 0, W, H);

    // Board well.
    ctx.fillStyle = skin.well;
    ctx.fillRect(BOARD_X, BOARD_Y, BOARD_W, BOARD_H);
    ctx.strokeStyle = skin.border;
    ctx.lineWidth = 1;
    ctx.strokeRect(BOARD_X + 0.5, BOARD_Y + 0.5, BOARD_W - 1, BOARD_H - 1);

    // Board contents (translated into the well).
    ctx.save();
    ctx.translate(BOARD_X, BOARD_Y);
    drawGrid();
    drawBoardCells();
    drawGhost();
    drawActivePiece();
    if (clearing) drawClearAnim();
    if (counting) drawCountdown();
    if (status === "gameover") drawGameOver();
    ctx.restore();

    // Panels.
    drawLeftPanel();
    drawRightPanel();
  }

  // ── Loop ───────────────────────────────────────────────────
  function loop(timestamp: number): void {
    rafId = requestAnimationFrame(loop);
    if (lastTime == null) lastTime = timestamp;
    const dt = timestamp - lastTime;
    lastTime = timestamp;

    if (status === "gameover") {
      draw();
      return;
    }

    // Pre-game countdown owns the frame: gravity frozen until it finishes.
    if (counting) {
      if (countStart == null) countStart = timestamp;
      const elapsed = timestamp - countStart;
      if (elapsed >= COUNTDOWN_MS) {
        counting = false;
        countStart = null;
        sfx.play("countbeep", true); // "go"
        sfx.stopMenuMusic();
        sfx.startGameplayMusic();
        accumulated = 0;
      } else {
        const n = 3 - Math.floor(elapsed / 1000); // 3,2,1
        if (n !== countShown) {
          countShown = n;
          sfx.play("countbeep", false);
        }
        draw();
        return;
      }
    }

    if (paused) {
      draw();
      return;
    }

    // Line-clear animation owns the frame: no gravity.
    if (clearing) {
      if (timestamp - clearStart >= CLEAR_DURATION) {
        clearing = false;
        applyLineClear(clearRows);
        clearRows = [];
        accumulated = 0;
        emitState();
        spawn();
      }
      draw();
      return;
    }

    accumulated += dt;
    if (accumulated >= dropInterval && current) {
      accumulated -= dropInterval;
      const test: Piece = { ...current, y: current.y + 1 };
      if (collide(test)) lockPiece();
      else current = test;
    }

    draw();
  }

  // ── Input ──────────────────────────────────────────────────
  const blockRepeat = new Set(["Space", "KeyP", "Escape"]);

  function active(): boolean {
    return status === "playing" && !paused && !counting && !clearing;
  }

  const onKeyDown = (e: KeyboardEvent): void => {
    if (status === "gameover") return;
    if (e.repeat && blockRepeat.has(e.code)) {
      e.preventDefault();
      return;
    }
    switch (e.code) {
      case "ArrowLeft":
      case "KeyA":
        e.preventDefault();
        if (active()) tryMove(-1);
        break;
      case "ArrowRight":
      case "KeyD":
        e.preventDefault();
        if (active()) tryMove(1);
        break;
      case "ArrowUp":
      case "KeyW":
        e.preventDefault();
        if (active()) tryRotate();
        break;
      case "ArrowDown":
      case "KeyS":
        e.preventDefault();
        if (active()) softDrop();
        break;
      case "Space":
        e.preventDefault();
        if (active()) hardDrop();
        break;
      case "KeyP":
      case "Escape":
        e.preventDefault();
        keyboardPause();
        break;
    }
  };

  function keyboardPause(): void {
    if (status === "gameover" || counting) return;
    if (paused) doResume();
    else doPause();
  }

  function doPause(): void {
    if (paused || status === "gameover") return;
    paused = true;
    sfx.play("pause");
    sfx.stopGameplayMusic();
  }

  function doResume(): void {
    if (!paused || status === "gameover") return;
    paused = false;
    lastTime = null;
    accumulated = 0;
    sfx.play("resume");
    if (!counting) sfx.startGameplayMusic();
  }

  // ── Controller ─────────────────────────────────────────────
  return {
    start() {
      window.addEventListener("keydown", onKeyDown);
      initGame();
      rafId = requestAnimationFrame(loop);
    },
    pause() {
      doPause();
    },
    resume() {
      doResume();
    },
    restart() {
      initGame();
      lastTime = null;
      if (rafId == null) rafId = requestAnimationFrame(loop);
    },
    destroy() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      window.removeEventListener("keydown", onKeyDown);
      sfx.dispose();
    },
  };
}
