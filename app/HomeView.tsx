"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import type { Game } from "@/app/lib/games";
import { buildSeedScores } from "@/app/lib/scores";
import GameCover from "@/app/components/GameCover";

// ── scroll-reveal ──────────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ── floating pixel silhouettes ─────────────────────────────────────────────────
function FloatingSilhouettes() {
  return (
    <div className="home-silos" aria-hidden="true">
      {/* s1: alien invader */}
      <svg className="silo s1" viewBox="0 0 40 32">
        <g fill="#00f5ff">
          <rect x="6" y="4" width="4" height="4" />
          <rect x="30" y="4" width="4" height="4" />
          <rect x="2" y="8" width="36" height="4" />
          <rect x="2" y="12" width="4" height="4" />
          <rect x="14" y="12" width="4" height="4" />
          <rect x="22" y="12" width="4" height="4" />
          <rect x="34" y="12" width="4" height="4" />
          <rect x="2" y="16" width="36" height="4" />
          <rect x="6" y="20" width="4" height="4" />
          <rect x="30" y="20" width="4" height="4" />
        </g>
      </svg>
      {/* s2: ghost */}
      <svg className="silo s2" viewBox="0 0 32 32">
        <g fill="#ff006e">
          <rect x="8" y="0" width="16" height="4" />
          <rect x="4" y="4" width="24" height="4" />
          <rect x="0" y="8" width="32" height="12" />
          <rect x="0" y="20" width="6" height="6" />
          <rect x="10" y="20" width="4" height="6" />
          <rect x="18" y="20" width="4" height="6" />
          <rect x="26" y="20" width="6" height="6" />
        </g>
      </svg>
      {/* s3: pac-man */}
      <svg className="silo s3" viewBox="0 0 32 32">
        <g fill="#f5ff00">
          <rect x="10" y="0" width="12" height="4" />
          <rect x="6" y="4" width="20" height="4" />
          <rect x="4" y="8" width="6" height="6" />
          <rect x="22" y="8" width="6" height="6" />
          <rect x="2" y="14" width="28" height="10" />
          <rect x="6" y="24" width="4" height="4" />
          <rect x="14" y="24" width="4" height="4" />
          <rect x="22" y="24" width="4" height="4" />
        </g>
      </svg>
      {/* s4: crosshair */}
      <svg className="silo s4" viewBox="0 0 24 24">
        <g fill="#00ff88">
          <rect x="10" y="0" width="4" height="24" />
          <rect x="0" y="10" width="24" height="4" />
          <rect
            x="6"
            y="6"
            width="12"
            height="12"
            fill="none"
            stroke="#00ff88"
            strokeWidth="2"
          />
        </g>
      </svg>
      {/* s5: UFO */}
      <svg className="silo s5" viewBox="0 0 36 24">
        <g fill="#aa00ff">
          <rect x="14" y="2" width="8" height="4" />
          <rect x="10" y="6" width="16" height="4" />
          <rect x="4" y="10" width="28" height="4" />
          <rect x="0" y="14" width="36" height="4" />
          <rect x="6" y="18" width="4" height="2" />
          <rect x="16" y="18" width="4" height="2" />
          <rect x="26" y="18" width="4" height="2" />
        </g>
      </svg>
      {/* s6: coin */}
      <svg className="silo s6" viewBox="0 0 20 20">
        <g fill="#ffcf3a">
          <rect x="6" y="0" width="8" height="2" />
          <rect x="2" y="2" width="16" height="2" />
          <rect x="0" y="4" width="20" height="12" />
          <rect x="2" y="16" width="16" height="2" />
          <rect x="6" y="18" width="8" height="2" />
          <rect x="8" y="4" width="4" height="12" fill="#0a0a0f" />
        </g>
      </svg>
      {/* s7: pixel heart */}
      <svg className="silo s7" viewBox="0 0 24 22">
        <g fill="#ff3060">
          <rect x="2" y="2" width="6" height="2" />
          <rect x="16" y="2" width="6" height="2" />
          <rect x="0" y="4" width="10" height="4" />
          <rect x="14" y="4" width="10" height="4" />
          <rect x="0" y="8" width="24" height="4" />
          <rect x="2" y="12" width="20" height="2" />
          <rect x="4" y="14" width="16" height="2" />
          <rect x="6" y="16" width="12" height="2" />
          <rect x="8" y="18" width="8" height="2" />
          <rect x="10" y="20" width="4" height="2" />
        </g>
      </svg>
      {/* s8: D-pad */}
      <svg className="silo s8" viewBox="0 0 24 24">
        <g fill="#00d4ff">
          <rect x="8" y="2" width="8" height="6" />
          <rect x="2" y="8" width="20" height="8" />
          <rect x="8" y="16" width="8" height="6" />
          <rect x="11" y="6" width="2" height="2" fill="#0a0a0f" />
          <rect x="11" y="16" width="2" height="2" fill="#0a0a0f" />
          <rect x="4" y="11" width="2" height="2" fill="#0a0a0f" />
          <rect x="18" y="11" width="2" height="2" fill="#0a0a0f" />
        </g>
      </svg>
    </div>
  );
}

// ── feature icon ───────────────────────────────────────────────────────────────
function FeatureIcon({ kind }: { kind: string }) {
  const C = "currentColor";
  if (kind === "GAMEPAD")
    return (
      <svg viewBox="0 0 16 16" width="36" height="36" fill={C}>
        <rect x="2" y="6" width="12" height="6" />
        <rect x="0" y="8" width="2" height="4" />
        <rect x="14" y="8" width="2" height="4" />
        <rect x="3" y="8" width="2" height="2" />
        <rect x="11" y="7" width="1.5" height="1.5" />
        <rect x="11" y="10" width="1.5" height="1.5" />
      </svg>
    );
  if (kind === "FREE")
    return (
      <svg viewBox="0 0 16 16" width="36" height="36" fill={C}>
        <rect
          x="3"
          y="3"
          width="10"
          height="10"
          fill="none"
          stroke={C}
          strokeWidth="1.5"
        />
        <rect x="5" y="6" width="1.5" height="4" />
        <rect x="5" y="6" width="4" height="1.5" />
        <rect x="5" y="8" width="3" height="1" />
        <rect x="10" y="6" width="1.5" height="4" />
      </svg>
    );
  if (kind === "TROPHY")
    return (
      <svg viewBox="0 0 16 16" width="36" height="36" fill={C}>
        <rect x="3" y="2" width="10" height="2" />
        <rect x="3" y="2" width="2" height="6" />
        <rect x="11" y="2" width="2" height="6" />
        <rect x="5" y="8" width="6" height="2" />
        <rect x="7" y="10" width="2" height="3" />
        <rect x="5" y="13" width="6" height="1.5" />
        <rect x="1" y="3" width="2" height="3" />
        <rect x="13" y="3" width="2" height="3" />
      </svg>
    );
  if (kind === "ROCKET")
    return (
      <svg viewBox="0 0 16 16" width="36" height="36" fill={C}>
        <rect x="7" y="1" width="2" height="2" />
        <rect x="6" y="3" width="4" height="2" />
        <rect x="5" y="5" width="6" height="6" />
        <rect x="4" y="11" width="2" height="2" />
        <rect x="10" y="11" width="2" height="2" />
        <rect x="7" y="6" width="2" height="2" fill="#0a0a0f" />
        <rect x="6" y="13" width="1" height="2" />
        <rect x="9" y="13" width="1" height="2" />
      </svg>
    );
  return null;
}

// ── mini game card for preview rail ───────────────────────────────────────────
function MiniCard({ game }: { game: Game }) {
  return (
    <Link
      href={`/game/${game.id}`}
      style={{
        display: "block",
        background: "var(--surface-1)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-card)",
        overflow: "hidden",
        flex: "0 0 auto",
        width: 160,
        textDecoration: "none",
        transition: "border-color 0.2s, transform 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "var(--accent-line)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLElement).style.transform = "none";
      }}
    >
      <GameCover game={game} height={100} />
      <div style={{ padding: "10px 12px 12px" }}>
        <div
          className="mono"
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "var(--text)",
            marginBottom: 3,
          }}
        >
          {game.title}
        </div>
        <div
          className="mono"
          style={{
            fontSize: 10,
            color: "var(--text-faint)",
            letterSpacing: "0.1em",
          }}
        >
          {game.category}
        </div>
      </div>
    </Link>
  );
}

// ── section header ─────────────────────────────────────────────────────────────
function SectionHead({ num, title }: { num: string; title: string }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div
        className="mono"
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.22em",
          color: "var(--accent)",
          marginBottom: 10,
        }}
      >
        {num}
      </div>
      <h2
        className="mono"
        style={{
          margin: 0,
          fontSize: "clamp(22px, 4vw, 34px)",
          fontWeight: 800,
          color: "var(--text)",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h2>
      <div
        style={{
          marginTop: 14,
          height: 2,
          width: 48,
          background: "var(--accent)",
          borderRadius: 2,
        }}
      />
    </div>
  );
}

const TIME_MOCKS = [
  "2 min ago",
  "5 min ago",
  "8 min ago",
  "12 min ago",
  "18 min ago",
  "24 min ago",
  "31 min ago",
];

// ── main component ─────────────────────────────────────────────────────────────
export default function HomeView({ games }: { games: Game[] }) {
  useReveal();

  const { tickerRows, topPlayers } = useMemo(() => {
    const all: { player: string; score: number; gameTitle: string }[] = [];
    games.forEach((g) => {
      buildSeedScores(g).forEach((row) => {
        all.push({ player: row.player, score: row.score, gameTitle: g.title });
      });
    });
    all.sort((a, b) => b.score - a.score);

    const tickerRows = all.slice(0, 7);

    const byPlayer: Record<string, number> = {};
    all.forEach(({ player, score }) => {
      byPlayer[player] = (byPlayer[player] ?? 0) + score;
    });
    const topPlayers = Object.entries(byPlayer)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([player, total], i) => ({ rank: i + 1, player, total }));

    return { tickerRows, topPlayers };
  }, [games]);

  return (
    <div className="view-enter">
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          minHeight: "92vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          padding: "80px 24px",
        }}
      >
        <FloatingSilhouettes />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            maxWidth: 720,
          }}
        >
          <div
            className="mono"
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.28em",
              color: "var(--accent)",
              marginBottom: 20,
            }}
          >
            ▸ INSERT A COIN
            <span style={{ animation: "none", opacity: 0.7 }}>_</span>
          </div>
          <h1
            className="mono"
            style={{
              margin: 0,
              fontSize: "clamp(38px, 8vw, 88px)",
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              color: "var(--text)",
            }}
          >
            THE CLASSIC
            <br />
            <span style={{ color: "var(--accent)" }}>ARCADE</span>
            <br />
            IS BACK
          </h1>
          <p
            style={{
              margin: "28px auto 0",
              fontSize: "clamp(15px, 2vw, 18px)",
              lineHeight: 1.6,
              color: "var(--text-muted)",
              maxWidth: 520,
            }}
          >
            Play the best classics directly in your browser. No downloads. No
            cost. Just pure fun.
          </p>
          <div
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              marginTop: 36,
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/library"
              className="mono"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "var(--accent)",
                color: "var(--accent-ink)",
                borderRadius: "var(--radius-btn)",
                padding: "14px 28px",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.08em",
                animation: "pulseGlow 2.4s ease-in-out infinite",
                textDecoration: "none",
              }}
            >
              ▶ EXPLORE GAMES
            </Link>
            <Link
              href="/auth"
              className="mono"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "transparent",
                color: "var(--text)",
                border: "1px solid var(--border-2)",
                borderRadius: "var(--radius-btn)",
                padding: "14px 28px",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textDecoration: "none",
              }}
            >
              ✦ CREATE ACCOUNT
            </Link>
          </div>
          <div
            className="mono"
            style={{
              marginTop: 52,
              fontSize: 10,
              letterSpacing: "0.22em",
              color: "var(--text-faint)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>SCROLL</span>
            <span style={{ fontSize: 14 }}>▼</span>
          </div>
        </div>
      </section>

      {/* ── WHY ─────────────────────────────────────────────────────────────── */}
      <section
        className="reveal"
        style={{ maxWidth: 1240, margin: "0 auto", padding: "80px 24px" }}
      >
        <SectionHead num="// 01" title="WHY IMK'S PLAYGROUND?" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
          {[
            {
              icon: "GAMEPAD",
              title: "CLASSIC GAMES",
              desc: "Breakout, Tetris, Snake and more. The best retro arcades all in one place.",
              color: "var(--accent)",
            },
            {
              icon: "FREE",
              title: "100% FREE",
              desc: "No subscriptions, no hidden fees. Every game available at absolutely no cost.",
              color: "#00f5ff",
            },
            {
              icon: "TROPHY",
              title: "LEADERBOARDS",
              desc: "Compete with players worldwide. Climb the ranks and prove you are the best.",
              color: "#ff006e",
            },
            {
              icon: "ROCKET",
              title: "ALWAYS GROWING",
              desc: "New games added constantly. Come back often — there will always be something new to play.",
              color: "#aa00ff",
            },
          ].map((f, i) => (
            <div
              key={i}
              style={{
                background: "var(--surface-1)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-card)",
                padding: "28px 24px",
                transitionDelay: `${i * 80}ms`,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div style={{ color: f.color }}>
                <FeatureIcon kind={f.icon} />
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "var(--text)",
                }}
              >
                {f.title}
              </div>
              <div
                style={{
                  fontSize: 13.5,
                  lineHeight: 1.55,
                  color: "var(--text-muted)",
                }}
              >
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── GAMES PREVIEW ────────────────────────────────────────────────────── */}
      <section
        className="reveal"
        style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px 80px" }}
      >
        <SectionHead num="// 02" title="GAMES AVAILABLE NOW" />
        <div
          style={{
            display: "flex",
            gap: 16,
            overflowX: "auto",
            paddingBottom: 8,
          }}
        >
          {games.slice(0, 6).map((g) => (
            <MiniCard key={g.id} game={g} />
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <Link
            href="/library"
            className="mono"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: "var(--accent)",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.1em",
              border: "1px solid var(--accent-line)",
              borderRadius: "var(--radius-btn)",
              padding: "12px 24px",
              textDecoration: "none",
            }}
          >
            SEE ALL GAMES →
          </Link>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────────── */}
      <section
        className="reveal"
        style={{
          background: "var(--surface-1)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "60px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 40,
            textAlign: "center",
          }}
        >
          {[
            { n: "12+", u: "GAMES", s: "AND COUNTING" },
            { n: "1,000s", u: "GAMES PLAYED", s: "EVERY DAY" },
            { n: "GLOBAL", u: "RANKING", s: "COMPETE WITH THE WORLD" },
          ].map((st, i) => (
            <div key={i} style={{ transitionDelay: `${i * 90}ms` }}>
              <div
                className="mono"
                style={{
                  fontSize: "clamp(32px, 5vw, 52px)",
                  fontWeight: 800,
                  color: "var(--accent)",
                  lineHeight: 1,
                }}
              >
                {st.n}
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  color: "var(--text)",
                  marginTop: 8,
                }}
              >
                {st.u}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-faint)",
                  marginTop: 4,
                  letterSpacing: "0.04em",
                }}
              >
                {st.s}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LIVE ACTIVITY ────────────────────────────────────────────────────── */}
      <section
        className="reveal"
        style={{ maxWidth: 1240, margin: "0 auto", padding: "80px 24px" }}
      >
        <SectionHead num="// 03" title="LIVE ACTIVITY" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {/* ticker */}
          <div
            style={{
              background: "var(--surface-1)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-card)",
              overflow: "hidden",
            }}
          >
            <div
              className="mono"
              style={{
                padding: "16px 20px",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.16em",
                color: "var(--accent)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              ▸ LATEST SCORES
            </div>
            <div style={{ padding: "8px 0" }}>
              {tickerRows.map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 20px",
                    borderBottom:
                      i < tickerRows.length - 1
                        ? "1px solid var(--border)"
                        : "none",
                    animation: `rowIn 0.4s ease both`,
                    animationDelay: `${i * 60}ms`,
                  }}
                >
                  <span
                    className="mono"
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "var(--accent)",
                      flex: "0 0 80px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.player}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      flex: 1,
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ▸ {r.gameTitle}
                  </span>
                  <span
                    className="mono"
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "var(--text)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    +{r.score.toLocaleString("en-US")}
                  </span>
                  <span
                    className="mono"
                    style={{
                      fontSize: 10,
                      color: "var(--text-faint)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {TIME_MOCKS[i] ?? ""}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* top players */}
          <div
            style={{
              background: "var(--surface-1)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-card)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span
                className="mono"
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  color: "var(--accent)",
                }}
              >
                ▸ TOP PLAYERS TODAY
              </span>
              <Link
                href="/hall-of-fame"
                className="mono"
                style={{
                  fontSize: 10,
                  color: "var(--text-faint)",
                  letterSpacing: "0.1em",
                  textDecoration: "none",
                }}
              >
                SEE HALL →
              </Link>
            </div>
            <div style={{ padding: "8px 0" }}>
              {topPlayers.map((r, i) => {
                const rankColor =
                  i === 0
                    ? "var(--gold)"
                    : i === 1
                      ? "var(--silver)"
                      : i === 2
                        ? "var(--bronze)"
                        : "var(--text-faint)";
                const barW = 100 - i * 15;
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "12px 20px",
                      borderBottom:
                        i < topPlayers.length - 1
                          ? "1px solid var(--border)"
                          : "none",
                    }}
                  >
                    <span
                      className="mono"
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: rankColor,
                        width: 28,
                      }}
                    >
                      #{String(r.rank).padStart(2, "0")}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        className="mono"
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "var(--text)",
                          marginBottom: 4,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.player}
                      </div>
                      <div
                        style={{
                          height: 3,
                          background: "var(--border)",
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${barW}%`,
                            background: rankColor,
                            borderRadius: 2,
                            transition: "width 0.6s ease",
                          }}
                        />
                      </div>
                    </div>
                    <span
                      className="mono"
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "var(--text-muted)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {r.total.toLocaleString("en-US")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────────────── */}
      <section
        className="reveal"
        style={{
          background: "var(--surface-1)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "80px 24px",
        }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionHead num="// 04" title="PRICING" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 32,
              alignItems: "start",
            }}
          >
            {/* price card */}
            <div
              style={{
                position: "relative",
                background: "var(--surface-2)",
                border: "1px solid var(--accent-line)",
                borderRadius: "var(--radius-card)",
                padding: "36px 32px",
                overflow: "hidden",
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  color: "var(--text-faint)",
                  marginBottom: 6,
                }}
              >
                SINGLE PLAN
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "var(--text)",
                  marginBottom: 16,
                }}
              >
                VAULT PLAYER
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: 56,
                    fontWeight: 800,
                    color: "var(--accent)",
                    lineHeight: 1,
                  }}
                >
                  $0
                </span>
                <span
                  className="mono"
                  style={{ fontSize: 13, color: "var(--text-faint)" }}
                >
                  / ALWAYS
                </span>
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  color: "var(--text-faint)",
                  letterSpacing: "0.12em",
                  marginBottom: 24,
                }}
              >
                NO TRICKS · NO FINE PRINT
              </div>
              <ul
                style={{
                  margin: "0 0 28px",
                  padding: 0,
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {[
                  "Access to all games",
                  "Global ranking & hall of fame",
                  "No ads between rounds",
                  "Save your scores",
                  "New games every month",
                  "Works in any browser",
                ].map((item) => (
                  <li
                    key={item}
                    style={{
                      display: "flex",
                      gap: 10,
                      fontSize: 13.5,
                      color: "var(--text-muted)",
                    }}
                  >
                    <span style={{ color: "var(--accent)" }}>✔</span> {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth"
                className="mono"
                style={{
                  display: "block",
                  textAlign: "center",
                  background: "var(--accent)",
                  color: "var(--accent-ink)",
                  borderRadius: "var(--radius-btn)",
                  padding: "14px",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  animation: "pulseGlow 2.4s ease-in-out infinite",
                  textDecoration: "none",
                }}
              >
                START FOR FREE →
              </Link>
              <p
                style={{
                  textAlign: "center",
                  margin: "14px 0 0",
                  fontSize: 11,
                  color: "var(--text-faint)",
                }}
              >
                We don&rsquo;t ask for a card. We never will.
              </p>
              {/* FREE PLAY stamp */}
              <div
                className="mono"
                style={{
                  position: "absolute",
                  top: 24,
                  right: -20,
                  transform: "rotate(45deg)",
                  background: "var(--accent)",
                  color: "var(--accent-ink)",
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  padding: "4px 36px",
                }}
              >
                FREE PLAY
              </div>
            </div>

            {/* FAQ */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                {
                  q: "IS IT REALLY FREE?",
                  a: "Yes. imk's Playground is a passion project built out of love for the classics. There is no hidden premium tier.",
                },
                {
                  q: "DO I NEED AN ACCOUNT?",
                  a: "No. You can play as a guest. If you want to save your score and appear in the ranking, register in under 10 seconds.",
                },
                {
                  q: "HOW DO YOU SURVIVE WITHOUT CHARGING?",
                  a: "It's a community project. If you enjoy it, share it. That's the only coin we accept.",
                },
              ].map((item) => (
                <div
                  key={item.q}
                  style={{
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-card)",
                    padding: "22px 24px",
                  }}
                >
                  <div
                    className="mono"
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      color: "var(--accent)",
                      marginBottom: 10,
                    }}
                  >
                    {item.q}
                  </div>
                  <div
                    style={{
                      fontSize: 13.5,
                      lineHeight: 1.6,
                      color: "var(--text-muted)",
                    }}
                  >
                    {item.a}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────────── */}
      <section
        className="reveal"
        style={{
          textAlign: "center",
          padding: "100px 24px",
          background:
            "linear-gradient(180deg, transparent 0%, var(--accent-soft) 50%, transparent 100%)",
        }}
      >
        <h2
          className="mono"
          style={{
            margin: "0 0 28px",
            fontSize: "clamp(28px, 5vw, 52px)",
            fontWeight: 800,
            color: "var(--text)",
            letterSpacing: "-0.01em",
          }}
        >
          READY TO PLAY?
        </h2>
        <Link
          href="/library"
          className="mono"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "var(--accent)",
            color: "var(--accent-ink)",
            borderRadius: "var(--radius-btn)",
            padding: "16px 36px",
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: "0.1em",
            animation: "pulseGlow 2.4s ease-in-out infinite",
            textDecoration: "none",
          }}
        >
          INSERT COIN →
        </Link>
        <p
          style={{
            marginTop: 18,
            fontSize: 12,
            color: "var(--text-faint)",
            letterSpacing: "0.04em",
          }}
        >
          Free. No mandatory registration. Start in seconds.
        </p>
      </section>
    </div>
  );
}
