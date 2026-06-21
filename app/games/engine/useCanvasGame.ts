"use client";

import { useRef, useEffect, useCallback } from "react";
import type { GameFactory, GameState } from "./types";

const GAME_W = 800;
const GAME_H = 600;

// Keys that should not scroll the page while a game is active.
const BLOCKED_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Space",
]);

interface UseCanvasGameOptions {
  factory: GameFactory;
  onState?: (s: GameState) => void;
  onGameOver?: (finalScore: number) => void;
}

interface UseCanvasGameReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  pause: () => void;
  resume: () => void;
  restart: () => void;
}

export function useCanvasGame({
  factory,
  onState,
  onGameOver,
}: UseCanvasGameOptions): UseCanvasGameReturn {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Store controller in a ref so pause/resume/restart can access it without
  // triggering re-renders.
  const controllerRef = useRef<ReturnType<GameFactory> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Prevent page scroll while the game has focus.
    const blockScroll = (e: KeyboardEvent) => {
      if (BLOCKED_KEYS.has(e.code)) e.preventDefault();
    };
    window.addEventListener("keydown", blockScroll, { passive: false });

    const controller = factory({
      canvas,
      onState: (s) => onState?.(s),
      onGameOver: (score) => onGameOver?.(score),
    });
    controllerRef.current = controller;
    controller.start();

    return () => {
      controller.destroy();
      controllerRef.current = null;
      window.removeEventListener("keydown", blockScroll);
    };
    // factory is stable (module-level function); callbacks are forwarded via
    // closure so the effect intentionally doesn't re-run on callback identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [factory]);

  const pause = useCallback(() => controllerRef.current?.pause(), []);
  const resume = useCallback(() => controllerRef.current?.resume(), []);
  const restart = useCallback(() => controllerRef.current?.restart(), []);

  return { canvasRef, pause, resume, restart };
}

// CSS helper: scale an 800×600 canvas to fill its container while keeping
// aspect ratio (letterbox). Apply as inline style on the <canvas> element.
export function canvasScaleStyle(): React.CSSProperties {
  return {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    display: "block",
  };
}

export { GAME_W, GAME_H };
