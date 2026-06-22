import { type Game } from "./games";

export interface ScoreRow {
  player: string;
  score: number;
  date: string;
  seeded?: boolean;
  mine?: boolean;
}

export type UserScores = Record<string, ScoreRow[]>;

const HANDLES = [
  "NOVA_X",
  "byteWraith",
  "QUASAR",
  "kilo.ton",
  "ECHO_77",
  "vex",
  "ASTRA",
  "n0ctis",
  "PIXEL_GHOST",
  "ORB1T",
  "static.k",
  "ZENITH",
  "drift",
  "HALON",
  "m4 verick",
  "lumen",
  "RAZOR",
  "cobalt",
  "FLUX",
  "tenebr",
];

function seededRand(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function dateNDaysAgo(n: number): string {
  const d = new Date(2026, 5, 18);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export function buildSeedScores(game: Game): ScoreRow[] {
  const rnd = seededRand(game.seed + game.title.length * 13);
  const rows: ScoreRow[] = [];
  let top = game.seed;
  for (let i = 0; i < 10; i++) {
    const handle = HANDLES[Math.floor(rnd() * HANDLES.length)];
    rows.push({
      player: handle,
      score: top,
      date: dateNDaysAgo(Math.floor(rnd() * 90) + 1),
      seeded: true,
    });
    top = Math.round(top * (0.78 + rnd() * 0.16));
    if (top < 5) top = 5;
  }
  return rows;
}

export function getLeaderboard(game: Game, userScores: UserScores): ScoreRow[] {
  const submitted = userScores[game.id] ?? [];
  const all = [...buildSeedScores(game), ...submitted];
  all.sort((a, b) => b.score - a.score);
  return all;
}

export function bestScore(game: Game, userScores: UserScores): number {
  const lb = getLeaderboard(game, userScores);
  return lb.length ? lb[0].score : 0;
}

export function fmt(n: number): string {
  return n.toLocaleString("en-US");
}
