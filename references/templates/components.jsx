// ============================================================
// components.jsx — shared UI: logo, buttons, nav, icons, tables
// ============================================================
const { useState, useEffect, useRef } = React;

// ---------- inline icons (stroke = currentColor) ----------
function Ico({ name, size = 18, stroke = 1.8 }) {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (name) {
    case "search":
      return (<svg {...p}><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>);
    case "sun":
      return (<svg {...p}><circle cx="12" cy="12" r="4" /><line x1="12" y1="2" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="22" /><line x1="2" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="22" y2="12" /><line x1="4.9" y1="4.9" x2="7" y2="7" /><line x1="17" y1="17" x2="19.1" y2="19.1" /><line x1="4.9" y1="19.1" x2="7" y2="17" /><line x1="17" y1="7" x2="19.1" y2="4.9" /></svg>);
    case "moon":
      return (<svg {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>);
    case "menu":
      return (<svg {...p}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>);
    case "close":
      return (<svg {...p}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>);
    case "play":
      return (<svg {...p} fill="currentColor" stroke="none"><polygon points="6 4 20 12 6 20 6 4" /></svg>);
    case "pause":
      return (<svg {...p}><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>);
    case "exit":
      return (<svg {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>);
    case "trophy":
      return (<svg {...p}><path d="M6 4h12v4a6 6 0 0 1-12 0V4z" /><path d="M6 6H4a2 2 0 0 0 0 4h2" /><path d="M18 6h2a2 2 0 0 1 0 4h-2" /><line x1="12" y1="14" x2="12" y2="18" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="10" y1="18" x2="14" y2="18" /></svg>);
    case "grid":
      return (<svg {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>);
    case "user":
      return (<svg {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>);
    case "chevL":
      return (<svg {...p}><polyline points="15 18 9 12 15 6" /></svg>);
    case "google":
      return (<svg width={size} height={size} viewBox="0 0 24 24"><path fill="#EA4335" d="M12 10.2v3.9h5.4c-.24 1.4-1.7 4.1-5.4 4.1-3.25 0-5.9-2.7-5.9-6s2.65-6 5.9-6c1.85 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.5 14.6 2.6 12 2.6 6.9 2.6 2.8 6.7 2.8 12s4.1 9.4 9.2 9.4c5.3 0 8.8-3.7 8.8-9 0-.6-.06-1-.15-1.5z"/></svg>);
    case "github":
      return (<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49l-.01-1.9c-2.78.62-3.37-1.2-3.37-1.2-.46-1.18-1.11-1.5-1.11-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.37-2.22-.26-4.55-1.14-4.55-5.05 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.71 1.03 1.62 1.03 2.74 0 3.92-2.34 4.79-4.57 5.04.36.32.68.94.68 1.9l-.01 2.82c0 .27.18.59.69.49A10.27 10.27 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg>);
    default:
      return null;
  }
}

// ---------- logo ----------
function Logo({ size = 18, onClick }) {
  return (
    <button
      onClick={onClick}
      className="mono"
      style={{
        background: "none",
        border: "none",
        padding: 0,
        display: "inline-flex",
        alignItems: "baseline",
        gap: 1,
        fontFamily: "var(--font-mono)",
        fontWeight: 700,
        fontSize: size,
        letterSpacing: "0.04em",
        color: "var(--text)",
      }}
    >
      <span style={{ color: "var(--accent)" }}>imk&rsquo;s</span>
      <span>&nbsp;Playground</span>
    </button>
  );
}

// ---------- button ----------
function Btn({ children, variant = "line", size = "md", onClick, type, disabled, full, style, leftIcon }) {
  const [press, setPress] = useState(false);
  const sizes = {
    sm: { padding: "7px 14px", fontSize: 12 },
    md: { padding: "11px 20px", fontSize: 13 },
    lg: { padding: "15px 28px", fontSize: 15 },
  };
  const base = {
    fontFamily: "var(--font-mono)",
    fontWeight: 700,
    letterSpacing: "0.08em",
    borderRadius: "var(--radius-btn)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    width: full ? "100%" : "auto",
    transition: "transform 0.12s cubic-bezier(.34,1.56,.64,1), background 0.18s, border-color 0.18s, color 0.18s, box-shadow 0.18s",
    transform: press ? "scale(0.955)" : "scale(1)",
    opacity: disabled ? 0.45 : 1,
    pointerEvents: disabled ? "none" : "auto",
    cursor: "pointer",
    whiteSpace: "nowrap",
    ...sizes[size],
  };
  const variants = {
    solid: { background: "var(--accent)", color: "var(--accent-ink)", border: "1px solid var(--accent)" },
    line: { background: "transparent", color: "var(--text)", border: "1px solid var(--accent-line)" },
    ghost: { background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border-2)" },
    surface: { background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border)" },
  };
  const [hover, setHover] = useState(false);
  const hoverStyle =
    hover && !disabled
      ? variant === "solid"
        ? { boxShadow: "0 8px 24px -8px var(--accent-glow)", filter: "brightness(1.04)" }
        : variant === "line"
        ? { background: "var(--accent)", color: "var(--accent-ink)", borderColor: "var(--accent)" }
        : variant === "ghost"
        ? { color: "var(--text)", borderColor: "var(--text-faint)" }
        : { borderColor: "var(--accent-line)" }
      : {};
  return (
    <button
      type={type || "button"}
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      style={{ ...base, ...variants[variant], ...hoverStyle, ...style }}
    >
      {leftIcon && <Ico name={leftIcon} size={size === "lg" ? 18 : 15} />}
      {children}
    </button>
  );
}

// ---------- category pill ----------
function Pill({ active, children, onClick, tone }) {
  const [hover, setHover] = useState(false);
  const accentTone = tone === "accent";
  return (
    <button
      onClick={onClick}
      className="mono"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11.5,
        fontWeight: 700,
        letterSpacing: "0.1em",
        padding: "8px 16px",
        borderRadius: 99,
        cursor: "pointer",
        transition: "all 0.18s",
        background: active ? "var(--accent-soft)" : hover ? "var(--surface-2)" : "transparent",
        color: active ? "var(--accent)" : "var(--text-muted)",
        border: active ? "1px solid var(--accent-line)" : "1px solid var(--border)",
      }}
    >
      {children}
    </button>
  );
}

// ---------- score badge pill ----------
function ScorePill({ label, value }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <span className="mono" style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", color: "var(--text-faint)" }}>
        {label}
      </span>
      <span
        className="mono"
        style={{
          alignSelf: "flex-start",
          fontSize: 12.5,
          fontWeight: 700,
          color: "var(--accent)",
          background: "var(--accent-soft)",
          borderRadius: 6,
          padding: "3px 9px",
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ---------- rank number with metallic top-3 ----------
function Rank({ n }) {
  const metal = n === 1 ? "var(--gold)" : n === 2 ? "var(--silver)" : n === 3 ? "var(--bronze)" : null;
  return (
    <span
      className="mono"
      style={{
        fontSize: 14,
        fontWeight: 700,
        color: metal || "var(--text-faint)",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {String(n).padStart(2, "0")}
    </span>
  );
}

// ---------- leaderboard table ----------
function ScoreTable({ rows, currentUser, animateRows }) {
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
          const isMe = currentUser && r.player === currentUser && r.mine;
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
                animation: animateRows ? `rowIn 0.4s cubic-bezier(.22,1,.36,1) ${i * 0.04}s both` : "none",
              }}
            >
              <Rank n={i + 1} />
              <span style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
                <span className="mono" style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {r.player}
                </span>
                {isMe && (
                  <span className="mono" style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.1em", color: "var(--accent)", border: "1px solid var(--accent-line)", borderRadius: 4, padding: "2px 5px", flexShrink: 0 }}>
                    YOU
                  </span>
                )}
              </span>
              <span className="mono" style={{ textAlign: "right", fontSize: 14, fontWeight: 700, color: i < 3 ? "var(--text)" : "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>
                {fmt(r.score)}
              </span>
              <span className="mono" style={{ textAlign: "right", fontSize: 11.5, color: "var(--text-faint)", fontVariantNumeric: "tabular-nums" }}>
                {r.date}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- navbar ----------
function Navbar({ route, go, user, theme, toggleTheme, onAuth, onSignOut }) {
  const [open, setOpen] = useState(false);
  const links = [
    { id: "library", label: "Library", icon: "grid" },
    { id: "halloffame", label: "Hall of Fame", icon: "trophy" },
  ];
  const NavLink = ({ l }) => {
    const active = route === l.id || (l.id === "library" && (route === "detail" || route === "player"));
    return (
      <button
        onClick={() => { go(l.id); setOpen(false); }}
        style={{
          background: "none",
          border: "none",
          fontFamily: "var(--font-ui)",
          fontWeight: 500,
          fontSize: 14,
          color: active ? "var(--accent)" : "var(--text-muted)",
          padding: "6px 2px",
          borderBottom: active ? "2px solid var(--accent)" : "2px solid transparent",
          transition: "color 0.18s",
          cursor: "pointer",
        }}
      >
        {l.label}
      </button>
    );
  };
  const themeBtn = (
    <button
      onClick={toggleTheme}
      title="Toggle theme"
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 38, height: 38, borderRadius: 8, cursor: "pointer",
        background: "var(--surface-1)", border: "1px solid var(--border)", color: "var(--text-muted)",
      }}
    >
      <Ico name={theme === "dark" ? "sun" : "moon"} size={17} />
    </button>
  );
  return (
    <header
      style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "var(--nav-bg)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <nav style={{ maxWidth: 1240, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", gap: 18 }}>
        <Logo size={17} onClick={() => go("library")} />
        <div className="nav-links" style={{ display: "flex", gap: 26, marginLeft: 26 }}>
          {links.map((l) => <NavLink key={l.id} l={l} />)}
        </div>
        <div style={{ flex: 1 }} />
        <div className="nav-right" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {themeBtn}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={onSignOut}
                title="Sign out"
                style={{ display: "flex", alignItems: "center", gap: 9, background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: 99, padding: "5px 14px 5px 5px", cursor: "pointer" }}
              >
                <span style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--accent)", color: "var(--accent-ink)", display: "grid", placeItems: "center", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 12 }}>
                  {user.name.slice(0, 2).toUpperCase()}
                </span>
                <span className="mono" style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text)" }}>{user.name}</span>
              </button>
            </div>
          ) : (
            <Btn variant="line" size="sm" onClick={onAuth}>SIGN IN</Btn>
          )}
        </div>
        <button className="nav-burger" onClick={() => setOpen(true)} style={{ display: "none", background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: 8, width: 38, height: 38, color: "var(--text)", alignItems: "center", justifyContent: "center" }}>
          <Ico name="menu" size={18} />
        </button>
      </nav>

      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "var(--bg)", animation: "viewIn 0.25s ease both" }}>
          <div style={{ padding: "16px 24px", display: "flex", alignItems: "center", borderBottom: "1px solid var(--border)" }}>
            <Logo size={17} onClick={() => { go("library"); setOpen(false); }} />
            <div style={{ flex: 1 }} />
            <button onClick={() => setOpen(false)} style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: 8, width: 38, height: 38, color: "var(--text)", display: "grid", placeItems: "center" }}>
              <Ico name="close" size={18} />
            </button>
          </div>
          <div style={{ padding: "28px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
            {links.map((l) => (
              <button key={l.id} onClick={() => { go(l.id); setOpen(false); }} className="mono" style={{ textAlign: "left", background: "none", border: "none", color: "var(--text)", fontSize: 22, fontWeight: 700, padding: "14px 0", letterSpacing: "0.02em" }}>
                {l.label}
              </button>
            ))}
            <div style={{ marginTop: 16 }}>
              {user ? (
                <Btn variant="ghost" full onClick={() => { onSignOut(); setOpen(false); }}>SIGN OUT — {user.name}</Btn>
              ) : (
                <Btn variant="solid" full onClick={() => { onAuth(); setOpen(false); }}>SIGN IN</Btn>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// ---------- typewriter hook ----------
function useTypewriter(text, active, speed = 55) {
  const [out, setOut] = useState("");
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
  return out;
}

Object.assign(window, { Ico, Logo, Btn, Pill, ScorePill, Rank, ScoreTable, Navbar, useTypewriter });
