import type { ScoreRow } from "@/app/lib/scores";
import { fmt } from "@/app/lib/scores";
import Rank from "./Rank";

interface ScoreTableProps {
  rows: ScoreRow[];
  currentUser?: string | null;
  animateRows?: boolean;
}

export default function ScoreTable({
  rows,
  currentUser,
  animateRows,
}: ScoreTableProps) {
  return (
    <div style={{ width: "100%" }}>
      <div
        className="mono"
        style={{
          display: "grid",
          gridTemplateColumns: "48px 1fr auto 96px",
          gap: 12,
          padding: "0 14px 10px",
          fontSize: 9.5,
          fontWeight: 600,
          letterSpacing: "0.14em",
          color: "var(--text-faint)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <span>RANK</span>
        <span>PLAYER</span>
        <span style={{ textAlign: "right" }}>SCORE</span>
        <span style={{ textAlign: "right" }}>DATE</span>
      </div>
      <div>
        {rows.map((r, i) => {
          const isMe = !!(currentUser && r.player === currentUser && r.mine);
          return (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "48px 1fr auto 96px",
                gap: 12,
                alignItems: "center",
                padding: "13px 14px",
                borderBottom: "1px solid var(--border)",
                borderRadius: isMe ? 8 : 0,
                background: isMe ? "var(--accent-soft)" : "transparent",
                boxShadow: isMe ? "inset 0 0 0 1px var(--accent-line)" : "none",
                animation: animateRows
                  ? `rowIn 0.4s cubic-bezier(.22,1,.36,1) ${i * 0.04}s both`
                  : "none",
              }}
            >
              <Rank n={i + 1} />
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  minWidth: 0,
                }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "var(--text)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {r.player}
                </span>
                {isMe && (
                  <span
                    className="mono"
                    style={{
                      fontSize: 8.5,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      color: "var(--accent)",
                      border: "1px solid var(--accent-line)",
                      borderRadius: 4,
                      padding: "2px 5px",
                      flexShrink: 0,
                    }}
                  >
                    YOU
                  </span>
                )}
              </span>
              <span
                className="mono"
                style={{
                  textAlign: "right",
                  fontSize: 14,
                  fontWeight: 700,
                  color: i < 3 ? "var(--text)" : "var(--text-muted)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {fmt(r.score)}
              </span>
              <span
                className="mono"
                style={{
                  textAlign: "right",
                  fontSize: 11.5,
                  color: "var(--text-faint)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {r.date}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
