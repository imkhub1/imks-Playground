import type { UserScores } from "./scores";

export interface PersistedState {
  theme: "dark" | "light";
  user: { name: string } | null;
  userScores: UserScores;
}

const LS_KEY = "imkPlayground_v1";

const DEFAULTS: PersistedState = {
  theme: "dark",
  user: null,
  userScores: {},
};

export function loadState(): PersistedState {
  if (typeof window === "undefined") return { ...DEFAULTS };
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveState(patch: Partial<PersistedState>): PersistedState {
  if (typeof window === "undefined") return { ...DEFAULTS, ...patch };
  try {
    const cur = loadState();
    const next = { ...cur, ...patch };
    localStorage.setItem(LS_KEY, JSON.stringify(next));
    return next;
  } catch {
    return { ...DEFAULTS, ...patch };
  }
}
