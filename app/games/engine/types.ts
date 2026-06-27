import type { GameSkin } from "./skins";

export type GameStatus = "playing" | "dead" | "gameover";

export interface GameState {
  score: number;
  level: number;
  status: GameStatus;
  lives?: number; // asteroids
  lines?: number; // tetris
}

export interface GameContext {
  canvas: HTMLCanvasElement;
  onState: (s: GameState) => void;
  onGameOver: (finalScore: number) => void;
  /** Color palette the game must draw through (defaults to the Pastel skin). */
  skin: GameSkin;
}

export interface GameController {
  start(): void;
  pause(): void;
  resume(): void;
  restart(): void;
  destroy(): void;
}

export type GameFactory = (ctx: GameContext) => GameController;
