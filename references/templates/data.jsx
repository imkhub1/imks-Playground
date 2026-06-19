// ============================================================
// data.jsx — game catalog, leaderboards, persistence helpers
// ============================================================
//
// BACKEND NOTE: All scores below are seeded demo data + localStorage.
// In production, GAMES would come from a content API and SCORES from a
// REST endpoint / Supabase table (see api stubs at bottom of this file).

const GAMES = [
  {
    id: "block-buster",
    title: "BLOCK BUSTER",
    category: "ARCADE",
    icon: "block",
    blurb: "Bounce the ball and shatter walls of neon brick.",
    about:
      "A paddle, a ball, and a wall that will not break itself. Angle every bounce, chain your combos, and clear the board before the ball slips past you. Power-ups drop from shattered bricks — grab the wide paddle and the multiball while you can.",
    controls: ["← / →  move paddle", "SPACE  launch ball", "P  pause"],
    seed: 28450,
  },
  {
    id: "cascade",
    title: "CASCADE",
    category: "PUZZLE",
    icon: "cascade",
    blurb: "Lock the falling pieces before the ceiling crushes you.",
    about:
      "Seven shapes, one shrinking gap. Rotate and slot each piece into a clean line and watch it vanish. The drop speed never stops climbing — survival is a negotiation with gravity you are destined to lose, beautifully.",
    controls: ["← / →  shift piece", "↑  rotate", "↓  soft drop", "SPACE  hard drop"],
    seed: 184220,
  },
  {
    id: "serpent",
    title: "SERPENT",
    category: "ARCADE",
    icon: "serpent",
    blurb: "Grow long without biting your own tail.",
    about:
      "Eat, grow, repeat — until your own body becomes the maze. Every pellet makes you longer and the board smaller. Pure nerve and spatial planning, distilled to a single moving line.",
    controls: ["Arrow keys  steer", "P  pause"],
    seed: 7820,
  },
  {
    id: "glutton",
    title: "GLUTTON",
    category: "ARCADE",
    icon: "glutton",
    blurb: "Devour the dots and outrun the ghosts.",
    about:
      "Clear the maze one dot at a time while four relentless hunters close in. Bank a power pellet to flip the chase and eat them back. Greed and timing, in equal measure.",
    controls: ["Arrow keys  move", "P  pause"],
    seed: 96400,
  },
  {
    id: "invaders",
    title: "INVADERS",
    category: "SHOOTER",
    icon: "invaders",
    blurb: "Defend the planet from descending alien rows.",
    about:
      "Rows of invaders march left, right, and ever downward. Thin them out before they reach the ground, duck behind crumbling bunkers, and watch for the mothership streaking overhead for bonus points.",
    controls: ["← / →  move cannon", "SPACE  fire", "P  pause"],
    seed: 54190,
  },
  {
    id: "rocks",
    title: "ROCKS",
    category: "SHOOTER",
    icon: "rocks",
    blurb: "Pulverize asteroids in zero gravity.",
    about:
      "Drift through a field of tumbling rock. Every shot splits an asteroid into faster, smaller pieces — clear them all without flying into one. Momentum is your only friend and your worst enemy.",
    controls: ["← / →  rotate", "↑  thrust", "SPACE  fire"],
    seed: 41200,
  },
  {
    id: "crosshop",
    title: "CROSSHOP",
    category: "ARCADE",
    icon: "crosshop",
    blurb: "Cross the pixel freeway without getting flattened.",
    about:
      "Five lanes of traffic, a river of logs, and a very small window of time. Hop forward one square at a time and read the gaps. One mistimed leap and it is back to the curb.",
    controls: ["Arrow keys  hop", "P  pause"],
    seed: 18900,
  },
  {
    id: "pixel-duel",
    title: "PIXEL DUEL",
    category: "VERSUS",
    icon: "duel",
    blurb: "Two paddles. One ball. Maximum reflexes.",
    about:
      "The original showdown. Keep the ball alive, sharpen your angles, and grind your opponent into a faceplant. Play the house AI or pass the keyboard for a local grudge match.",
    controls: ["W / S  left paddle", "↑ / ↓  right paddle"],
    seed: 21,
  },
];

const CATEGORIES = ["ALL", "ARCADE", "PUZZLE", "SHOOTER", "VERSUS"];

const HANDLES = [
  "NOVA_X", "byteWraith", "QUASAR", "kilo.ton", "ECHO_77", "vex", "ASTRA",
  "n0ctis", "PIXEL_GHOST", "ORB1T", "static.k", "ZENITH", "drift", "HALON",
  "m4 verick", "lumen", "RAZOR", "cobalt", "FLUX", "tenebr",
];

// Deterministic pseudo-random so seeded boards are stable across reloads.
function seededRand(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function dateNDaysAgo(n) {
  const d = new Date(2026, 5, 18);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function buildSeedScores(game) {
  const rnd = seededRand(game.seed + game.title.length * 13);
  const rows = [];
  let top = game.seed;
  for (let i = 0; i < 10; i++) {
    const handle = HANDLES[Math.floor(rnd() * HANDLES.length)];
    rows.push({
      player: handle,
      score: top,
      date: dateNDaysAgo(Math.floor(rnd() * 90) + 1),
      seeded: true,
    });
    // each step down loses 6–22%
    top = Math.round(top * (0.78 + rnd() * 0.16));
    if (top < 5) top = 5;
  }
  return rows;
}

const SEED_SCORES = {};
GAMES.forEach((g) => (SEED_SCORES[g.id] = buildSeedScores(g)));

// ---- persistence (localStorage) ----
const LS_KEY = "arcadeVault_v1";

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch (e) {
    return {};
  }
}
function saveState(patch) {
  try {
    const cur = loadState();
    const next = { ...cur, ...patch };
    localStorage.setItem(LS_KEY, JSON.stringify(next));
    return next;
  } catch (e) {
    return patch;
  }
}

// Returns merged + sorted leaderboard for a game (seed + user submissions).
function getLeaderboard(gameId, userScores) {
  const submitted = (userScores && userScores[gameId]) || [];
  const all = [...SEED_SCORES[gameId], ...submitted];
  all.sort((a, b) => b.score - a.score);
  return all;
}

// Best score for a game (across everyone).
function bestScore(gameId, userScores) {
  const lb = getLeaderboard(gameId, userScores);
  return lb.length ? lb[0].score : 0;
}

function fmt(n) {
  return n.toLocaleString("en-US");
}

// ---- BACKEND STUBS (where a real API would connect) ----
// async function apiFetchLeaderboard(gameId) {
//   const r = await fetch(`/api/games/${gameId}/scores?limit=10`);
//   return r.json();
// }
// async function apiSubmitScore(gameId, { player, score }) {
//   return fetch(`/api/games/${gameId}/scores`, {
//     method: "POST", headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ player, score }),
//   });
// }
// async function apiLogin({ username, password }) { /* Supabase auth */ }

Object.assign(window, {
  GAMES,
  CATEGORIES,
  SEED_SCORES,
  loadState,
  saveState,
  getLeaderboard,
  bestScore,
  fmt,
  dateNDaysAgo,
});
