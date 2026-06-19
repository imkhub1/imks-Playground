// ============================================================
// views.jsx — Library, Detail, Player, Auth, Hall of Fame
// ============================================================
const V = React;

// ---------------- LIBRARY ----------------
function GameCard({ game, userScores, onOpen }) {
  const [hover, setHover] = V.useState(false);
  const best = bestScore(game.id, userScores);
  return (
    <div
      onClick={() => onOpen(game.id)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "var(--surface-1)",
        border: `1px solid ${hover ? "var(--accent-line)" : "var(--border)"}`,
        borderRadius: "var(--radius-card)",
        padding: 14,
        cursor: "pointer",
        transition: "transform 0.22s cubic-bezier(.22,1,.36,1), border-color 0.22s, box-shadow 0.22s",
        transform: hover ? "translateY(var(--card-lift)) scale(var(--card-scale))" : "none",
        boxShadow: hover ? "var(--shadow-hover)" : "var(--shadow-card)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <GameCover game={game} height={150} />
      <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "0 2px" }}>
        <h3 className="mono" style={{ margin: 0, fontSize: 16, fontWeight: 700, letterSpacing: "0.02em", color: "var(--text)" }}>
          {game.title}
        </h3>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.45, color: "var(--text-muted)", minHeight: 38 }}>
          {game.blurb}
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "2px 2px 0", marginTop: "auto" }}>
        <ScorePill label="BEST SCORE" value={fmt(best)} />
        <Btn variant="line" size="sm" onClick={(e) => { e.stopPropagation(); onOpen(game.id); }}>PLAY</Btn>
      </div>
    </div>
  );
}

function LibraryView({ userScores, onOpen }) {
  const [q, setQ] = V.useState("");
  const [cat, setCat] = V.useState("ALL");
  const [focus, setFocus] = V.useState(false);
  const [loading, setLoading] = V.useState(true);
  V.useEffect(() => { const t = setTimeout(() => setLoading(false), 480); return () => clearTimeout(t); }, []);

  const filtered = GAMES.filter((g) => {
    const okCat = cat === "ALL" || g.category === cat;
    const okQ = !q || (g.title + " " + g.blurb + " " + g.category).toLowerCase().includes(q.toLowerCase());
    return okCat && okQ;
  });

  return (
    <div className="view-enter" style={{ maxWidth: 1240, margin: "0 auto", padding: "56px 24px 80px" }}>
      <div style={{ textAlign: "center", marginBottom: 44 }}>
        <h1 className="mono" style={{ margin: 0, fontSize: "clamp(34px, 6vw, 58px)", fontWeight: 800, letterSpacing: "-0.01em", lineHeight: 1 }}>
          <span style={{ color: "var(--accent)" }}>imk&rsquo;s</span> Playground
        </h1>
        <p className="mono" style={{ margin: "18px 0 0", fontSize: 12, fontWeight: 600, letterSpacing: "0.28em", color: "var(--text-faint)", textTransform: "uppercase" }}>
          Insert a coin to play
        </p>
      </div>

      {/* search + filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", justifyContent: "space-between", marginBottom: 30 }}>
        <div
          style={{
            display: "flex", alignItems: "center", gap: 10, flex: "1 1 280px", maxWidth: 420,
            background: "var(--surface-1)", borderRadius: "var(--radius-btn)",
            border: `1px solid ${focus ? "var(--accent-line)" : "var(--border)"}`,
            boxShadow: focus ? "0 0 0 3px var(--accent-soft)" : "none",
            padding: "0 14px", height: 44, transition: "border-color 0.18s, box-shadow 0.18s",
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
            style={{ flex: 1, background: "none", border: "none", outline: "none", color: "var(--text)", fontSize: 14 }}
          />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CATEGORIES.map((c) => (
            <Pill key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Pill>
          ))}
        </div>
      </div>

      {/* grid */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min), 1fr))", gap: 20 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ height: 308, borderRadius: "var(--radius-card)", background: "var(--surface-2)", border: "1px solid var(--border)", animation: "skeletonPulse 1.3s ease-in-out infinite" }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mono" style={{ textAlign: "center", padding: "80px 0", color: "var(--text-faint)", fontSize: 14 }}>
          NO GAMES MATCH "{q}"
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min), 1fr))", gap: 20 }}>
          {filtered.map((g) => (
            <GameCard key={g.id} game={g} userScores={userScores} onOpen={onOpen} />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------- DETAIL ----------------
function DetailView({ game, userScores, onPlay, onBack }) {
  const lb = getLeaderboard(game.id, userScores).slice(0, 10);
  return (
    <div className="view-enter" style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>
      <button onClick={onBack} className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "none", border: "none", color: "var(--text-faint)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 28, cursor: "pointer" }}>
        <Ico name="chevL" size={15} /> BACK TO PLAYGROUND
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 28, alignItems: "start" }} className="detail-grid">
        {/* left: hero */}
        <div>
          <GameCover game={game} height={300} radius={16} big />
          <div style={{ marginTop: 26 }}>
            <span className="mono" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: "var(--text-faint)" }}>{game.category}</span>
            <h1 className="mono" style={{ margin: "10px 0 0", fontSize: "clamp(34px, 5vw, 52px)", fontWeight: 800, color: "var(--accent)", letterSpacing: "-0.01em", lineHeight: 1 }}>
              {game.title}
            </h1>
            <p style={{ margin: "20px 0 0", fontSize: 15.5, lineHeight: 1.6, color: "var(--text-muted)", maxWidth: 560, textWrap: "pretty" }}>
              {game.about}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 26 }}>
              <Btn variant="solid" size="lg" leftIcon="play" onClick={() => onPlay(game.id)} style={{ animation: "pulseGlow 2.4s ease-in-out infinite" }}>
                PLAY NOW
              </Btn>
              <Btn variant="ghost" size="lg" onClick={onBack}>BACK TO PLAYGROUND</Btn>
            </div>
            {/* controls */}
            <div style={{ marginTop: 30 }}>
              <div className="mono" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", color: "var(--text-faint)", marginBottom: 12 }}>CONTROLS</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {game.controls.map((c, i) => (
                  <span key={i} className="mono" style={{ fontSize: 12, color: "var(--text-muted)", background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: 6, padding: "7px 11px" }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* right: leaderboard */}
        <aside style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: "var(--radius-card)", padding: "20px 8px 8px", position: "sticky", top: 92 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 14px 16px" }}>
            <Ico name="trophy" size={15} />
            <span className="mono" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "var(--accent)" }}>TOP SCORES</span>
          </div>
          <ScoreTable rows={lb} />
        </aside>
      </div>
    </div>
  );
}

// ---------------- PLAYER ----------------
function PlayerView({ game, user, onExit, onSubmit }) {
  const [score, setScore] = V.useState(0);
  const [lives, setLives] = V.useState(3);
  const [level, setLevel] = V.useState(1);
  const [paused, setPaused] = V.useState(false);
  const [over, setOver] = V.useState(false);
  const tick = V.useRef(null);

  const startRun = () => { setScore(0); setLives(3); setLevel(1); setPaused(false); setOver(false); };

  V.useEffect(() => {
    if (over || paused) return;
    tick.current = setInterval(() => {
      setScore((s) => s + Math.floor(Math.random() * 35) + 5);
    }, 240);
    return () => clearInterval(tick.current);
  }, [over, paused]);

  V.useEffect(() => { setLevel(Math.floor(score / 2000) + 1); }, [score]);

  const playerName = user ? user.name : "GUEST";

  return (
    <div className="view-enter" style={{ maxWidth: 980, margin: "0 auto", padding: "28px 24px 60px" }}>
      {/* HUD */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 26, flexWrap: "wrap" }}>
          {[["SCORE", fmt(score)], ["LIVES", "★".repeat(lives) || "—"], ["LEVEL", String(level).padStart(2, "0")], ["PLAYER", playerName]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span className="mono" style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: "0.14em", color: "var(--text-faint)" }}>{k}</span>
              <span className="mono" style={{ fontSize: 16, fontWeight: 700, color: "var(--accent)", fontVariantNumeric: "tabular-nums" }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="surface" size="sm" leftIcon={paused ? "play" : "pause"} onClick={() => setPaused((p) => !p)}>{paused ? "RESUME" : "PAUSE"}</Btn>
          <Btn variant="surface" size="sm" leftIcon="exit" onClick={onExit}>EXIT</Btn>
        </div>
      </div>

      {/* bezel */}
      <div style={{ position: "relative", borderRadius: 16, border: "2px solid var(--border-2)", background: "#06070a", boxShadow: "0 30px 70px -30px rgba(0,0,0,0.9)", overflow: "hidden", aspectRatio: "16 / 9" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(60% 70% at 50% 50%, var(--accent-soft), transparent 72%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22 }}>
          <div style={{ animation: paused || over ? "none" : "float 2.6s ease-in-out infinite" }}>
            <svg viewBox="0 0 160 112" width="200"><GameGlyph icon={game.icon} /></svg>
          </div>
          <span className="mono" style={{ fontSize: 11, letterSpacing: "0.22em", color: "var(--text-faint)" }}>
            {paused ? "— PAUSED —" : "DEMO BUILD · LIVE GAMEPLAY NOT INCLUDED"}
          </span>
          {!over && (
            <Btn variant="line" size="sm" onClick={() => { clearInterval(tick.current); setOver(true); }}>END RUN</Btn>
          )}
        </div>
      </div>

      <p className="mono" style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: "var(--text-faint)", letterSpacing: "0.04em" }}>
        {game.title} · score accrues automatically in this mock — press END RUN to see the game-over flow.
      </p>

      {over && (
        <GameOverModal
          game={game}
          score={score}
          user={user}
          onSubmit={onSubmit}
          onReplay={startRun}
          onExit={onExit}
        />
      )}
    </div>
  );
}

// ---------------- GAME OVER MODAL ----------------
function GameOverModal({ game, score, user, onSubmit, onReplay, onExit }) {
  const [name, setName] = V.useState(user ? user.name : "");
  const [saved, setSaved] = V.useState(false);
  const typed = useTypewriter("SCORE SAVED", saved, 60);
  const [shown, setShown] = V.useState(0);

  V.useEffect(() => {
    const dur = 700, steps = 26; let i = 0;
    const t = setInterval(() => { i++; setShown(Math.round((score * i) / steps)); if (i >= steps) { setShown(score); clearInterval(t); } }, dur / steps);
    return () => clearInterval(t);
  }, [score]);

  const save = () => {
    const player = (name || "GUEST").trim().slice(0, 14).toUpperCase() || "GUEST";
    onSubmit(game.id, score, player);
    setSaved(true);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(6,7,10,0.82)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", display: "grid", placeItems: "center", padding: 20, animation: "viewIn 0.25s ease both" }}>
      <div style={{ width: "min(440px, 100%)", background: "var(--surface-1)", border: "1px solid var(--border-2)", borderRadius: 16, padding: "36px 32px", textAlign: "center", boxShadow: "0 40px 100px -30px rgba(0,0,0,0.9)" }}>
        <h2 className="mono" style={{ margin: 0, fontSize: 32, fontWeight: 800, color: "var(--accent)", letterSpacing: "0.02em" }}>GAME OVER</h2>
        <p className="mono" style={{ margin: "6px 0 0", fontSize: 11, letterSpacing: "0.16em", color: "var(--text-faint)" }}>{game.title}</p>

        <div style={{ margin: "28px 0", padding: "22px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
          <div className="mono" style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", color: "var(--text-faint)" }}>FINAL SCORE</div>
          <div className="mono" style={{ fontSize: 48, fontWeight: 800, color: "var(--text)", fontVariantNumeric: "tabular-nums", lineHeight: 1.1, marginTop: 6 }}>{fmt(shown)}</div>
        </div>

        {saved ? (
          <div style={{ marginBottom: 22 }}>
            <span className="mono" style={{ fontSize: 15, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.1em" }}>
              {typed}<span style={{ opacity: typed.length < 11 ? 1 : 0 }}>▌</span>
            </span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={14}
              placeholder="Enter name to save score"
              className="mono"
              style={{ width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 14px", color: "var(--text)", fontSize: 13, textAlign: "center", outline: "none", letterSpacing: "0.06em" }}
            />
            <Btn variant="solid" full onClick={save}>SAVE SCORE</Btn>
            {!user && <span className="mono" style={{ fontSize: 10, color: "var(--text-faint)" }}>Playing as guest — score saved locally only</span>}
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="line" full onClick={onReplay}>PLAY AGAIN</Btn>
          <Btn variant="ghost" full onClick={onExit}>BACK TO PLAYGROUND</Btn>
        </div>
      </div>
    </div>
  );
}

// ---------------- AUTH ----------------
function AuthView({ onLogin, onGuest, onBack }) {
  const [tab, setTab] = V.useState("signin");
  const [form, setForm] = V.useState({ user: "", pass: "", email: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const valid = form.user.trim() && form.pass.trim() && (tab === "signin" || form.email.trim());

  const Field = ({ label, k, type, ph }) => {
    const [foc, setFoc] = V.useState(false);
    return (
      <label style={{ display: "block" }}>
        <span className="mono" style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: "var(--text-faint)", display: "block", marginBottom: 7 }}>{label}</span>
        <input
          type={type || "text"}
          value={form[k]}
          onChange={set(k)}
          onFocus={() => setFoc(true)}
          onBlur={() => setFoc(false)}
          placeholder={ph}
          style={{
            width: "100%", background: "var(--surface-2)", borderRadius: 8, padding: "12px 14px", color: "var(--text)", fontSize: 14, outline: "none",
            border: `1px solid ${foc ? "var(--accent-line)" : "var(--border)"}`,
            boxShadow: foc ? "0 0 0 3px var(--accent-soft)" : "none",
            transition: "border-color 0.18s, box-shadow 0.18s",
          }}
        />
      </label>
    );
  };

  const TabBtn = ({ id, children }) => (
    <button onClick={() => setTab(id)} className="mono" style={{ flex: 1, background: "none", border: "none", padding: "12px 0", fontSize: 12.5, fontWeight: 700, letterSpacing: "0.08em", color: tab === id ? "var(--text)" : "var(--text-faint)", borderBottom: `2px solid ${tab === id ? "var(--accent)" : "transparent"}`, cursor: "pointer", transition: "color 0.18s, border-color 0.18s" }}>
      {children}
    </button>
  );

  const Social = ({ icon, label }) => (
    <Btn variant="ghost" full leftIcon={null} onClick={() => onLogin("Player")} style={{ justifyContent: "center" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}><Ico name={icon} size={16} /> {label}</span>
    </Btn>
  );

  return (
    <div className="view-enter" style={{ minHeight: "calc(100vh - 70px)", display: "grid", placeItems: "center", padding: "40px 20px" }}>
      <div style={{ width: "min(420px, 100%)", background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: "var(--radius-card)", padding: "30px 28px", boxShadow: "var(--shadow-card)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Logo size={18} onClick={onBack} />
          <p className="mono" style={{ margin: "10px 0 0", fontSize: 10.5, letterSpacing: "0.16em", color: "var(--text-faint)" }}>SIGN IN TO SAVE YOUR SCORES</p>
        </div>

        <div style={{ display: "flex", borderBottom: "1px solid var(--border)", marginBottom: 22 }}>
          <TabBtn id="signin">SIGN IN</TabBtn>
          <TabBtn id="register">CREATE ACCOUNT</TabBtn>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); if (valid) onLogin(form.user.trim().slice(0, 14)); }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="USERNAME" k="user" ph="player_one" />
          {tab === "register" && <Field label="EMAIL" k="email" type="email" ph="you@example.com" />}
          <Field label="PASSWORD" k="pass" type="password" ph="••••••••" />
          <Btn variant="solid" full type="submit" disabled={!valid} style={{ marginTop: 2 }}>
            {tab === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
          </Btn>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span className="mono" style={{ fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.1em" }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Social icon="google" label="CONTINUE WITH GOOGLE" />
          <Social icon="github" label="CONTINUE WITH GITHUB" />
          <Btn variant="line" full leftIcon="user" onClick={onGuest}>PLAY AS GUEST</Btn>
        </div>

        <p className="mono" style={{ textAlign: "center", margin: "18px 0 0", fontSize: 9.5, color: "var(--text-faint)", letterSpacing: "0.04em", lineHeight: 1.6 }}>
          DEMO AUTH — NO BACKEND. CONNECTS TO REST / SUPABASE IN PRODUCTION.
        </p>
      </div>
    </div>
  );
}

// ---------------- HALL OF FAME ----------------
function HallOfFameView({ userScores, user }) {
  const [tab, setTab] = V.useState("global");

  let rows;
  if (tab === "global") {
    const all = [];
    GAMES.forEach((g) => getLeaderboard(g.id, userScores).forEach((r) => all.push({ ...r, game: g.title })));
    all.sort((a, b) => b.score - a.score);
    rows = all.slice(0, 10);
  } else {
    rows = getLeaderboard(tab, userScores).slice(0, 10);
  }

  // user's best in current scope
  let myBest = null;
  if (user) {
    const mine = rows.filter((r) => r.mine && r.player === user.name);
    if (mine.length) myBest = mine.reduce((a, b) => (b.score > a.score ? b : a));
  }

  return (
    <div className="view-enter" style={{ maxWidth: 920, margin: "0 auto", padding: "48px 24px 80px" }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <Ico name="trophy" size={26} />
      </div>
      <h1 className="mono" style={{ textAlign: "center", margin: "8px 0 0", fontSize: "clamp(32px, 5vw, 50px)", fontWeight: 800, color: "var(--accent)", letterSpacing: "-0.01em" }}>
        HALL OF FAME
      </h1>
      <p className="mono" style={{ textAlign: "center", margin: "14px 0 36px", fontSize: 11, letterSpacing: "0.2em", color: "var(--text-faint)" }}>
        THE TEN BEST RUNS EVER RECORDED
      </p>

      {/* tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 28 }}>
        <Pill active={tab === "global"} onClick={() => setTab("global")}>GLOBAL</Pill>
        {GAMES.map((g) => (
          <Pill key={g.id} active={tab === g.id} onClick={() => setTab(g.id)}>{g.title}</Pill>
        ))}
      </div>

      {myBest && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: "var(--accent-soft)", border: "1px solid var(--accent-line)", borderRadius: "var(--radius-card)", padding: "16px 20px", marginBottom: 22 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span className="mono" style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.14em", color: "var(--accent)" }}>YOUR BEST</span>
            <span className="mono" style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{user.name}</span>
          </div>
          <span className="mono" style={{ fontSize: 26, fontWeight: 800, color: "var(--accent)", fontVariantNumeric: "tabular-nums" }}>{fmt(myBest.score)}</span>
        </div>
      )}

      <div key={tab} style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: "var(--radius-card)", padding: "20px 8px 8px" }}>
        {tab === "global" && (
          <div style={{ padding: "0 14px 14px" }}>
            <span className="mono" style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: "0.14em", color: "var(--text-faint)" }}>ACROSS ALL GAMES</span>
          </div>
        )}
        <ScoreTable rows={rows} currentUser={user ? user.name : null} animateRows />
      </div>
    </div>
  );
}

Object.assign(window, { LibraryView, DetailView, PlayerView, AuthView, HallOfFameView });
