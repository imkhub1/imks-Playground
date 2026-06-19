// ============================================================
// icons.jsx — flat geometric cover art for each game.
// Single lime accent + muted grays on dark, per brand system.
// Simple shapes only (rect / circle / line / polygon).
// ============================================================

const AC = "var(--accent)";
const DIM = "var(--border-2)";
const MUT = "var(--text-faint)";

function Block() {
  // brick rows + paddle + ball
  const bricks = [];
  const cols = 6;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < cols; c++) {
      const lit = (r === 0 && (c === 1 || c === 4)) || (r === 1 && c === 2);
      bricks.push(
        <rect
          key={r + "-" + c}
          x={14 + c * 22}
          y={16 + r * 13}
          width="19"
          height="9"
          rx="2"
          fill={lit ? AC : DIM}
          opacity={lit ? 1 : 0.7}
        />
      );
    }
  }
  return (
    <g>
      {bricks}
      <rect x="58" y="92" width="44" height="7" rx="3.5" fill={MUT} />
      <circle cx="96" cy="74" r="6" fill={AC} className="cover-ball" />
    </g>
  );
}

function Cascade() {
  return (
    <g>
      {/* S-piece */}
      <rect x="34" y="14" width="18" height="18" rx="2" fill={DIM} />
      <rect x="52" y="14" width="18" height="18" rx="2" fill={DIM} />
      <rect x="52" y="32" width="18" height="18" rx="2" fill={MUT} opacity="0.85" />
      <rect x="70" y="32" width="18" height="18" rx="2" fill={MUT} opacity="0.85" />
      {/* landed lime row */}
      <rect x="34" y="74" width="18" height="18" rx="2" fill={AC} />
      <rect x="52" y="74" width="18" height="18" rx="2" fill={AC} />
      <rect x="70" y="74" width="18" height="18" rx="2" fill={AC} />
      <rect x="88" y="74" width="18" height="18" rx="2" fill={DIM} />
      <rect x="88" y="56" width="18" height="18" rx="2" fill={DIM} />
    </g>
  );
}

function Serpent() {
  const seg = [
    [24, 80], [42, 80], [60, 80], [60, 62], [60, 44], [78, 44], [96, 44],
  ];
  return (
    <g>
      {seg.map((p, i) => (
        <rect
          key={i}
          x={p[0]}
          y={p[1]}
          width="15"
          height="15"
          rx="3"
          fill={AC}
          opacity={0.45 + (i / seg.length) * 0.55}
        />
      ))}
      {/* head accent */}
      <rect x="96" y="44" width="15" height="15" rx="3" fill={AC} />
      <circle cx="120" cy="26" r="6" fill={MUT} />
    </g>
  );
}

function Glutton() {
  return (
    <g>
      <path
        d="M44 57 L70 44 A29 29 0 1 0 70 70 Z"
        fill={AC}
      />
      <circle cx="92" cy="57" r="5" fill={MUT} />
      <circle cx="110" cy="57" r="5" fill={MUT} />
      <circle cx="128" cy="57" r="5" fill={MUT} opacity="0.6" />
    </g>
  );
}

function Invaders() {
  const aliens = [];
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 4; c++) {
      const x = 26 + c * 26;
      const y = 18 + r * 22;
      const fill = r === 0 ? AC : MUT;
      aliens.push(
        <g key={r + "-" + c} fill={fill} opacity={r === 0 ? 1 : 0.8}>
          <rect x={x} y={y} width="16" height="10" rx="2" />
          <rect x={x - 4} y={y + 4} width="4" height="6" rx="1" />
          <rect x={x + 16} y={y + 4} width="4" height="6" rx="1" />
        </g>
      );
    }
  }
  return (
    <g>
      {aliens}
      <rect x="98" y="74" width="4" height="12" fill={AC} />
      <polygon points="86,98 114,98 104,86 96,86" fill={MUT} />
    </g>
  );
}

function Rocks() {
  return (
    <g>
      <circle cx="44" cy="34" r="16" fill={DIM} />
      <circle cx="108" cy="44" r="11" fill={DIM} opacity="0.8" />
      <circle cx="118" cy="84" r="8" fill={MUT} opacity="0.6" />
      <polygon points="70,86 80,58 90,86 80,79" fill={AC} />
      <circle cx="80" cy="46" r="3" fill={AC} />
      <circle cx="80" cy="34" r="2.4" fill={AC} opacity="0.7" />
    </g>
  );
}

function Crosshop() {
  const lanes = [30, 46, 62, 78];
  return (
    <g>
      {lanes.map((y, i) => (
        <line
          key={i}
          x1="14"
          y1={y}
          x2="146"
          y2={y}
          stroke={DIM}
          strokeWidth="2"
          strokeDasharray="10 8"
          opacity="0.8"
        />
      ))}
      {/* traffic blocks */}
      <rect x="36" y="22" width="20" height="9" rx="2" fill={MUT} opacity="0.7" />
      <rect x="100" y="54" width="20" height="9" rx="2" fill={MUT} opacity="0.7" />
      {/* hopper */}
      <rect x="74" y="84" width="14" height="14" rx="3" fill={AC} className="cover-ball" />
    </g>
  );
}

function Duel() {
  return (
    <g>
      <line x1="80" y1="14" x2="80" y2="98" stroke={DIM} strokeWidth="3" strokeDasharray="6 8" />
      <rect x="20" y="36" width="7" height="34" rx="3.5" fill={MUT} />
      <rect x="133" y="48" width="7" height="34" rx="3.5" fill={AC} />
      <circle cx="98" cy="58" r="6" fill={AC} className="cover-ball" />
    </g>
  );
}

const ICON_MAP = {
  block: Block,
  cascade: Cascade,
  serpent: Serpent,
  glutton: Glutton,
  invaders: Invaders,
  rocks: Rocks,
  crosshop: Crosshop,
  duel: Duel,
};

// GameCover: dark surface + radial lime bloom + geometric SVG.
function GameCover({ game, height = 150, radius = 12, big = false }) {
  const Glyph = ICON_MAP[game.icon] || Block;
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
        <Glyph />
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

function GameGlyph({ icon }) {
  const G = ICON_MAP[icon] || Block;
  return <G />;
}

Object.assign(window, { GameCover, GameGlyph });
