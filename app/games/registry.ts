import { createAsteroids } from "./asteroids/game";
import type { GameFactory } from "./engine/types";

export const GAME_FACTORIES: Record<string, GameFactory> = {
  asteroids: createAsteroids,
};
