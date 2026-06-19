// ============================================================
// app.jsx — root: routing, auth, theme, persistence, transitions
// ============================================================
const { useState: useS, useEffect: useE } = React;
const TODAY = "2026-06-18";

// ---- Tweaks ----
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#bef264",
  "radius": 12,
  "bloom": 100,
  "hover": "standard",
  "cardSize": "standard"
}/*EDITMODE-END*/;

const HOVER_MAP = { subtle: ["-2px", "1.01"], standard: ["-4px", "1.02"], bold: ["-8px", "1.035"] };
const SIZE_MAP = { compact: 218, standard: 258, large: 300 };

function hexToRgb(hex) {
  const h = String(hex).replace("#", "");
  const x = h.length === 3 ? h.replace(/./g, (c) => c + c) : h;
  const n = parseInt(x, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function accentInk(hex) {
  const [r, g, b] = hexToRgb(hex);
  return r * 299 + g * 587 + b * 114 > 148000 ? "#0b0c10" : "#f7fee7";
}

function applyTweaks(t) {
  const root = document.documentElement;
  const [r, g, b] = hexToRgb(t.accent);
  const rgb = `${r}, ${g}, ${b}`;
  root.style.setProperty("--accent", t.accent);
  root.style.setProperty("--accent-ink", accentInk(t.accent));
  root.style.setProperty("--accent-soft", `rgba(${rgb}, 0.14)`);
  root.style.setProperty("--accent-line", `rgba(${rgb}, 0.55)`);
  root.style.setProperty("--accent-glow", `rgba(${rgb}, 0.25)`);
  root.style.setProperty("--bloom", `rgba(${rgb}, ${(0.1 * t.bloom) / 100})`);
  root.style.setProperty("--radius-card", t.radius + "px");
  root.style.setProperty("--radius-btn", Math.round(t.radius * 0.66) + "px");
  const [lift, scale] = HOVER_MAP[t.hover] || HOVER_MAP.standard;
  root.style.setProperty("--card-lift", lift);
  root.style.setProperty("--card-scale", scale);
  root.style.setProperty("--card-min", (SIZE_MAP[t.cardSize] || 258) + "px");
}

function App() {
  const boot = loadState();
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useE(() => { applyTweaks(tweaks); }, [tweaks]);

  const [theme, setTheme] = useS(boot.theme || "dark");
  const [user, setUser] = useS(boot.user || null);
  const [userScores, setUserScores] = useS(boot.userScores || {});
  const [route, setRoute] = useS("library");
  const [gameId, setGameId] = useS(null);

  useE(() => { document.documentElement.setAttribute("data-theme", theme); saveState({ theme }); }, [theme]);
  useE(() => { saveState({ user }); }, [user]);
  useE(() => { saveState({ userScores }); }, [userScores]);
  useE(() => { window.scrollTo(0, 0); }, [route, gameId]);

  const go = (r, id) => { if (id !== undefined) setGameId(id); setRoute(r); };
  const openGame = (id) => go("detail", id);

  // Export hook: lets the PPTX capture drive the SPA between screens.
  useE(() => { window.__pgGo = go; return () => { delete window.__pgGo; }; }, []);

  const submitScore = (gid, score, player) => {
    setUserScores((prev) => {
      const arr = prev[gid] || [];
      return { ...prev, [gid]: [...arr, { player, score, date: TODAY, mine: true }] };
    });
  };

  const game = GAMES.find((g) => g.id === gameId) || GAMES[0];

  let screen;
  if (route === "library") {
    screen = <LibraryView userScores={userScores} onOpen={openGame} />;
  } else if (route === "detail") {
    screen = <DetailView game={game} userScores={userScores} onPlay={(id) => go("player", id)} onBack={() => go("library")} />;
  } else if (route === "player") {
    screen = <PlayerView game={game} user={user} onExit={() => go("library")} onSubmit={submitScore} />;
  } else if (route === "auth") {
    screen = <AuthView onLogin={(name) => { setUser({ name: name.toUpperCase() }); go("library"); }} onGuest={() => { setUser(null); go("library"); }} onBack={() => go("library")} />;
  } else if (route === "halloffame") {
    screen = <HallOfFameView userScores={userScores} user={user} />;
  }

  return (
    <React.Fragment>
      <Navbar
        route={route}
        go={go}
        user={user}
        theme={theme}
        toggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        onAuth={() => go("auth")}
        onSignOut={() => { setUser(null); go("library"); }}
      />
      <main key={route + ":" + gameId}>{screen}</main>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Brand" />
        <TweakColor
          label="Accent"
          value={tweaks.accent}
          options={["#bef264", "#22d3ee", "#a78bfa", "#fb923c", "#f472b6"]}
          onChange={(v) => setTweak("accent", v)}
        />
        <TweakSlider label="Lime bloom" value={tweaks.bloom} min={0} max={220} step={10} unit="%" onChange={(v) => setTweak("bloom", v)} />
        <TweakSection label="Surfaces" />
        <TweakSlider label="Corner radius" value={tweaks.radius} min={0} max={22} step={1} unit="px" onChange={(v) => setTweak("radius", v)} />
        <TweakSection label="Library grid" />
        <TweakRadio label="Card size" value={tweaks.cardSize} options={["compact", "standard", "large"]} onChange={(v) => setTweak("cardSize", v)} />
        <TweakRadio label="Hover lift" value={tweaks.hover} options={["subtle", "standard", "bold"]} onChange={(v) => setTweak("hover", v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
