import { createAsteroids } from "./asteroids/game";
import { createTetris } from "./tetris/game";
import type { GameFactory } from "./engine/types";

export const GAME_FACTORIES: Record<string, GameFactory> = {
  asteroids: createAsteroids,
  tetris: createTetris,
};
