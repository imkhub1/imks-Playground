"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GAMES, CATEGORIES, type Game } from "@/app/lib/games";
import { bestScore, fmt } from "@/app/lib/scores";
import { useAppState } from "@/app/components/AppStateProvider";
import GameCover from "@/app/components/GameCover";
import ScorePill from "@/app/components/ScorePill";
import Pill from "@/app/components/Pill";
import Btn from "@/app/components/Btn";
import Ico from "@/app/components/Ico";

function GameCard({ game }: { game: Game }) {
  const { userScores } = useAppState();
  const [hover, setHover] = useState(false);
  const best = bestScore(game.id, userScores);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "var(--surface-1)",
        border: `1px solid ${hover ? "var(--accent-line)" : "var(--border)"}`,
        borderRadius: "var(--radius-card)",
        padding: 14,
        cursor: "pointer",
        transition:
          "transform 0.22s cubic-bezier(.22,1,.36,1), border-color 0.22s, box-shadow 0.22s",
        transform: hover
          ? "translateY(var(--card-lift)) scale(var(--card-scale))"
          : "none",
        boxShadow: hover ? "var(--shadow-hover)" : "var(--shadow-card)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <Link href={`/game/${game.id}`} style={{ display: "contents" }}>
        <GameCover game={game} height={150} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            padding: "0 2px",
          }}
        >
          <h3
            className="mono"
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "0.02em",
              color: "var(--text)",
            }}
          >
            {game.title}
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              lineHeight: 1.45,
              color: "var(--text-muted)",
              minHeight: 38,
            }}
          >
            {game.blurb}
          </p>
        </div>
      </Link>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          padding: "2px 2px 0",
          marginTop: "auto",
        }}
      >
        <ScorePill label="BEST SCORE" value={fmt(best)} />
        <Btn
          variant="line"
          size="sm"
          onClick={() =>
            (window.location.href = `/game/${game.id}`)
          }
        >
          PLAY
        </Btn>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      style={{
        height: 308,
        borderRadius: "var(--radius-card)",
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        animation: "skeletonPulse 1.3s ease-in-out infinite",
      }}
    />
  );
}

export default function LibraryView() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("ALL");
  const [focus, setFocus] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 480);
    return () => clearTimeout(t);
  }, []);

  const filtered = GAMES.filter((g) => {
    const okCat = cat === "ALL" || g.category === cat;
    const okQ =
      !q ||
      (g.title + " " + g.blurb + " " + g.category)
        .toLowerCase()
        .includes(q.toLowerCase());
    return okCat && okQ;
  });

  return (
    <div
      className="view-enter"
      style={{ maxWidth: 1240, margin: "0 auto", padding: "56px 24px 80px" }}
    >
      {/* hero */}
      <div style={{ textAlign: "center", marginBottom: 44 }}>
        <h1
          className="mono"
          style={{
            margin: 0,
            fontSize: "clamp(34px, 6vw, 58px)",
            fontWeight: 800,
            letterSpacing: "-0.01em",
            lineHeight: 1,
          }}
        >
          <span style={{ color: "var(--accent)" }}>imk&rsquo;s</span>{" "}
          Playground
        </h1>
        <p
          className="mono"
          style={{
            margin: "18px 0 0",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.28em",
            color: "var(--text-faint)",
            textTransform: "uppercase",
          }}
        >
          Insert a coin to play
        </p>
      </div>

      {/* search + filters */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 14,
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 30,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flex: "1 1 280px",
            maxWidth: 420,
            background: "var(--surface-1)",
            borderRadius: "var(--radius-btn)",
            border: `1px solid ${focus ? "var(--accent-line)" : "var(--border)"}`,
            boxShadow: focus ? "0 0 0 3px var(--accent-soft)" : "none",
            padding: "0 14px",
            height: 44,
            transition: "border-color 0.18s, box-shadow 0.18s",
            color: "var(--text-faint)",
          }}
        >
          <Ico name="search" size={16} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            placeholder="Search games by name or category…"
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              color: "var(--text)",
              fontSize: 14,
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CATEGORIES.map((c) => (
            <Pill key={c} active={cat === c} onClick={() => setCat(c)}>
              {c}
            </Pill>
          ))}
        </div>
      </div>

      {/* grid */}
      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(var(--card-min), 1fr))",
            gap: 20,
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="mono"
          style={{
            textAlign: "center",
            padding: "80px 0",
            color: "var(--text-faint)",
            fontSize: 14,
          }}
        >
          NO GAMES MATCH &ldquo;{q}&rdquo;
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(var(--card-min), 1fr))",
            gap: 20,
          }}
        >
          {filtered.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      )}
    </div>
  );
}
