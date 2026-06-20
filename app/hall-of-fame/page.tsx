"use client";

import { useState } from "react";
import { GAMES } from "@/app/lib/games";
import { getLeaderboard, fmt, type ScoreRow } from "@/app/lib/scores";
import { useAppState } from "@/app/components/AppStateProvider";
import ScoreTable from "@/app/components/ScoreTable";
import Pill from "@/app/components/Pill";
import Ico from "@/app/components/Ico";

export default function HallOfFameView() {
  const { user, userScores } = useAppState();
  const [tab, setTab] = useState("global");

  let rows: ScoreRow[];
  if (tab === "global") {
    const all: ScoreRow[] = [];
    GAMES.forEach((g) =>
      getLeaderboard(g.id, userScores).forEach((r) =>
        all.push({ ...r, player: r.player })
      )
    );
    all.sort((a, b) => b.score - a.score);
    rows = all.slice(0, 10);
  } else {
    rows = getLeaderboard(tab, userScores).slice(0, 10);
  }

  let myBest: ScoreRow | null = null;
  if (user) {
    const mine = rows.filter((r) => r.mine && r.player === user.name);
    if (mine.length) {
      myBest = mine.reduce((a, b) => (b.score > a.score ? b : a));
    }
  }

  return (
    <div
      className="view-enter"
      style={{ maxWidth: 920, margin: "0 auto", padding: "48px 24px 80px" }}
    >
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <Ico name="trophy" size={26} />
      </div>
      <h1
        className="mono"
        style={{
          textAlign: "center",
          margin: "8px 0 0",
          fontSize: "clamp(32px, 5vw, 50px)",
          fontWeight: 800,
          color: "var(--accent)",
          letterSpacing: "-0.01em",
        }}
      >
        HALL OF FAME
      </h1>
      <p
        className="mono"
        style={{
          textAlign: "center",
          margin: "14px 0 36px",
          fontSize: 11,
          letterSpacing: "0.2em",
          color: "var(--text-faint)",
        }}
      >
        THE TEN BEST RUNS EVER RECORDED
      </p>

      {/* tabs */}
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: 28,
        }}
      >
        <Pill active={tab === "global"} onClick={() => setTab("global")}>
          GLOBAL
        </Pill>
        {GAMES.map((g) => (
          <Pill key={g.id} active={tab === g.id} onClick={() => setTab(g.id)}>
            {g.title}
          </Pill>
        ))}
      </div>

      {myBest && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            background: "var(--accent-soft)",
            border: "1px solid var(--accent-line)",
            borderRadius: "var(--radius-card)",
            padding: "16px 20px",
            marginBottom: 22,
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: 4 }}
          >
            <span
              className="mono"
              style={{
                fontSize: 9.5,
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: "var(--accent)",
              }}
            >
              YOUR BEST
            </span>
            <span
              className="mono"
              style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}
            >
              {user!.name}
            </span>
          </div>
          <span
            className="mono"
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "var(--accent)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {fmt(myBest.score)}
          </span>
        </div>
      )}

      <div
        key={tab}
        style={{
          background: "var(--surface-1)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-card)",
          padding: "20px 8px 8px",
        }}
      >
        {tab === "global" && (
          <div style={{ padding: "0 14px 14px" }}>
            <span
              className="mono"
              style={{
                fontSize: 9.5,
                fontWeight: 600,
                letterSpacing: "0.14em",
                color: "var(--text-faint)",
              }}
            >
              ACROSS ALL GAMES
            </span>
          </div>
        )}
        <ScoreTable
          rows={rows}
          currentUser={user ? user.name : null}
          animateRows
        />
      </div>
    </div>
  );
}
