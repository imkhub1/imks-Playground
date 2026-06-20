"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Game } from "@/app/lib/games";
import { fmt } from "@/app/lib/scores";
import { useAppState } from "@/app/components/AppStateProvider";
import GameGlyph from "@/app/components/GameGlyph";
import Btn from "@/app/components/Btn";

function useTypewriter(text: string, active: boolean, speed = 55) {
  const [out, setOut] = useState("");
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!active) { setOut(""); return; }
    let i = 0;
    setOut("");
    const t = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(t);
    }, speed);
    return () => clearInterval(t);
  }, [text, active, speed]);
  /* eslint-enable react-hooks/set-state-in-effect */
  return out;
}

function GameOverModal({
  game,
  score,
  onSubmit,
  onReplay,
  onExit,
}: {
  game: Game;
  score: number;
  onSubmit: (gameId: string, score: number, player: string) => void;
  onReplay: () => void;
  onExit: () => void;
}) {
  const { user } = useAppState();
  const [name, setName] = useState(user ? user.name : "");
  const [saved, setSaved] = useState(false);
  const [shown, setShown] = useState(0);
  const typed = useTypewriter("SCORE SAVED", saved, 60);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const dur = 700;
    const steps = 26;
    let i = 0;
    const t = setInterval(() => {
      i++;
      setShown(i >= steps ? score : Math.round((score * i) / steps));
      if (i >= steps) clearInterval(t);
    }, dur / steps);
    return () => clearInterval(t);
  }, [score]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const save = () => {
    const player =
      (name || "GUEST").trim().slice(0, 14).toUpperCase() || "GUEST";
    onSubmit(game.id, score, player);
    setSaved(true);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(6,7,10,0.82)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "grid",
        placeItems: "center",
        padding: 20,
        animation: "viewIn 0.25s ease both",
      }}
    >
      <div
        style={{
          width: "min(440px, 100%)",
          background: "var(--surface-1)",
          border: "1px solid var(--border-2)",
          borderRadius: 16,
          padding: "36px 32px",
          textAlign: "center",
          boxShadow: "0 40px 100px -30px rgba(0,0,0,0.9)",
        }}
      >
        <h2
          className="mono"
          style={{
            margin: 0,
            fontSize: 32,
            fontWeight: 800,
            color: "var(--accent)",
            letterSpacing: "0.02em",
          }}
        >
          GAME OVER
        </h2>
        <p
          className="mono"
          style={{
            margin: "6px 0 0",
            fontSize: 11,
            letterSpacing: "0.16em",
            color: "var(--text-faint)",
          }}
        >
          {game.title}
        </p>

        <div
          style={{
            margin: "28px 0",
            padding: "22px 0",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div
            className="mono"
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.16em",
              color: "var(--text-faint)",
            }}
          >
            FINAL SCORE
          </div>
          <div
            className="mono"
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: "var(--text)",
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1.1,
              marginTop: 6,
            }}
          >
            {fmt(shown)}
          </div>
        </div>

        {saved ? (
          <div style={{ marginBottom: 22 }}>
            <span
              className="mono"
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "var(--accent)",
                letterSpacing: "0.1em",
              }}
            >
              {typed}
              <span style={{ opacity: typed.length < 11 ? 1 : 0 }}>▌</span>
            </span>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginBottom: 22,
            }}
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={14}
              placeholder="Enter name to save score"
              className="mono"
              style={{
                width: "100%",
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "12px 14px",
                color: "var(--text)",
                fontSize: 13,
                textAlign: "center",
                outline: "none",
                letterSpacing: "0.06em",
              }}
            />
            <Btn variant="solid" full onClick={save}>
              SAVE SCORE
            </Btn>
            {!user && (
              <span
                className="mono"
                style={{ fontSize: 10, color: "var(--text-faint)" }}
              >
                Playing as guest — score saved locally only
              </span>
            )}
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="line" full onClick={onReplay}>
            PLAY AGAIN
          </Btn>
          <Btn variant="ghost" full onClick={onExit}>
            BACK TO LIBRARY
          </Btn>
        </div>
      </div>
    </div>
  );
}

export default function PlayerView({ game }: { game: Game }) {
  const router = useRouter();
  const { user, submitScore } = useAppState();
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [paused, setPaused] = useState(false);
  const [over, setOver] = useState(false);
  const level = Math.floor(score / 2000) + 1;

  const startRun = useCallback(() => {
    setScore(0);
    setLives(3);
    setPaused(false);
    setOver(false);
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (over || paused) return;
    const id = setInterval(() => {
      setScore((s) => s + Math.floor(Math.random() * 35) + 5);
    }, 240);
    return () => clearInterval(id);
  }, [over, paused]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleEndRun = () => setOver(true);

  const playerName = user ? user.name : "GUEST";

  const hudItems: [string, string][] = [
    ["SCORE", fmt(score)],
    ["LIVES", "★".repeat(lives) || "—"],
    ["LEVEL", String(level).padStart(2, "0")],
    ["PLAYER", playerName],
  ];

  return (
    <div
      className="view-enter"
      style={{ maxWidth: 980, margin: "0 auto", padding: "28px 24px 60px" }}
    >
      {/* HUD */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: 26, flexWrap: "wrap" }}>
          {hudItems.map(([k, v]) => (
            <div
              key={k}
              style={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              <span
                className="mono"
                style={{
                  fontSize: 9.5,
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  color: "var(--text-faint)",
                }}
              >
                {k}
              </span>
              <span
                className="mono"
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "var(--accent)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {v}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn
            variant="surface"
            size="sm"
            leftIcon={paused ? "play" : "pause"}
            onClick={() => setPaused((p) => !p)}
          >
            {paused ? "RESUME" : "PAUSE"}
          </Btn>
          <Btn
            variant="surface"
            size="sm"
            leftIcon="exit"
            onClick={() => router.push("/library")}
          >
            EXIT
          </Btn>
        </div>
      </div>

      {/* bezel */}
      <div
        style={{
          position: "relative",
          borderRadius: 16,
          border: "2px solid var(--border-2)",
          background: "#06070a",
          boxShadow: "0 30px 70px -30px rgba(0,0,0,0.9)",
          overflow: "hidden",
          aspectRatio: "16 / 9",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(60% 70% at 50% 50%, var(--accent-soft), transparent 72%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 22,
          }}
        >
          <div
            style={{
              animation:
                paused || over ? "none" : "float 2.6s ease-in-out infinite",
            }}
          >
            <svg viewBox="0 0 160 112" width="200">
              <GameGlyph icon={game.icon} />
            </svg>
          </div>
          <span
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.22em",
              color: "var(--text-faint)",
            }}
          >
            {paused ? "— PAUSED —" : "DEMO BUILD · LIVE GAMEPLAY NOT INCLUDED"}
          </span>
          {!over && (
            <Btn variant="line" size="sm" onClick={handleEndRun}>
              END RUN
            </Btn>
          )}
        </div>
      </div>

      <p
        className="mono"
        style={{
          textAlign: "center",
          marginTop: 16,
          fontSize: 11,
          color: "var(--text-faint)",
          letterSpacing: "0.04em",
        }}
      >
        {game.title} · score accrues automatically in this mock — press END RUN
        to see the game-over flow.
      </p>

      {over && (
        <GameOverModal
          game={game}
          score={score}
          onSubmit={submitScore}
          onReplay={startRun}
          onExit={() => router.push("/library")}
        />
      )}
    </div>
  );
}
