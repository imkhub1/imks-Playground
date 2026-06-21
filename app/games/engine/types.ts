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
