"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { Game } from "@/app/lib/games";
import { getLeaderboard, type ScoreRow } from "@/app/lib/scores";
import { useAppState } from "@/app/components/AppStateProvider";
import GameCover from "@/app/components/GameCover";
import ScoreTable from "@/app/components/ScoreTable";
import Btn from "@/app/components/Btn";
import Ico from "@/app/components/Ico";
import { fetchLeaderboard } from "@/app/lib/supabaseScores";
import { GAME_FACTORIES } from "@/app/games/registry";

export default function DetailView({ game }: { game: Game }) {
  const router = useRouter();
  const { userScores } = useAppState();

  const isRealGame = !!GAME_FACTORIES[game.id];
  const seededLb = isRealGame
    ? []
    : getLeaderboard(game.id, userScores).slice(0, 10);

  const [lb, setLb] = useState<ScoreRow[]>(seededLb);

   
  useEffect(() => {
    if (!isRealGame) return;
    fetchLeaderboard(game.id, 10).then(setLb).catch(console.error);
  }, [game.id, isRealGame]);
   

  return (
    <div
      className="view-enter"
      style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}
    >
      <Link
        href="/library"
        className="mono"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          color: "var(--text-faint)",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.08em",
          marginBottom: 28,
          textDecoration: "none",
        }}
      >
        <Ico name="chevL" size={15} />
        BACK TO LIBRARY
      </Link>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: 28,
          alignItems: "start",
        }}
        className="detail-grid"
      >
        {/* left: hero */}
        <div>
          <GameCover game={game} height={300} radius={16} big />
          <div style={{ marginTop: 26 }}>
            <span
              className="mono"
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.16em",
                color: "var(--text-faint)",
              }}
            >
              {game.category}
            </span>
            <h1
              className="mono"
              style={{
                margin: "10px 0 0",
                fontSize: "clamp(34px, 5vw, 52px)",
                fontWeight: 800,
                color: "var(--accent)",
                letterSpacing: "-0.01em",
                lineHeight: 1,
              }}
            >
              {game.title}
            </h1>
            <p
              style={{
                margin: "20px 0 0",
                fontSize: 15.5,
                lineHeight: 1.6,
                color: "var(--text-muted)",
                maxWidth: 560,
              }}
            >
              {game.about}
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginTop: 26,
              }}
            >
              <Btn
                variant="solid"
                size="lg"
                leftIcon="play"
                onClick={() => router.push(`/game/${game.id}/play`)}
                style={{ animation: "pulseGlow 2.4s ease-in-out infinite" }}
              >
                PLAY NOW
              </Btn>
              <Btn
                variant="ghost"
                size="lg"
                onClick={() => router.push("/library")}
              >
                BACK TO LIBRARY
              </Btn>
            </div>

            {/* controls */}
            <div style={{ marginTop: 30 }}>
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  color: "var(--text-faint)",
                  marginBottom: 12,
                }}
              >
                CONTROLS
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {game.controls.map((c, i) => (
                  <span
                    key={i}
                    className="mono"
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      background: "var(--surface-1)",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      padding: "7px 11px",
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* right: sticky leaderboard */}
        <aside
          style={{
            background: "var(--surface-1)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-card)",
            padding: "20px 8px 8px",
            position: "sticky",
            top: 92,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "0 14px 16px",
            }}
          >
            <Ico name="trophy" size={15} />
            <span
              className="mono"
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: "var(--accent)",
              }}
            >
              TOP SCORES
            </span>
          </div>
          <ScoreTable rows={lb} />
        </aside>
      </div>
    </div>
  );
}
