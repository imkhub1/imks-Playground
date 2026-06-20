import type { Game } from "@/app/lib/games";
import GameGlyph from "./GameGlyph";

interface GameCoverProps {
  game: Game;
  height?: number;
  radius?: number;
  big?: boolean;
}

export default function GameCover({
  game,
  height = 150,
  radius = 12,
  big = false,
}: GameCoverProps) {
  return (
    <div
      style={{
        position: "relative",
        height,
        borderRadius: radius,
        overflow: "hidden",
        background: "var(--surface-1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(60% 70% at 50% 50%, var(--accent-soft), transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <svg
        viewBox="0 0 160 112"
        width={big ? "62%" : "72%"}
        style={{ position: "relative", maxHeight: "78%" }}
      >
        <GameGlyph icon={game.icon} />
      </svg>
      <span
        className="mono"
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          fontSize: 9.5,
          fontWeight: 700,
          letterSpacing: "0.12em",
          color: "var(--text-faint)",
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
          borderRadius: 5,
          padding: "3px 7px",
        }}
      >
        {game.category}
      </span>
    </div>
  );
}
