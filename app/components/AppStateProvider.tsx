"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { loadState, saveState } from "@/app/lib/storage";
import type { UserScores } from "@/app/lib/scores";

interface AppState {
  theme: "dark" | "light";
  user: { name: string } | null;
  userScores: UserScores;
  toggleTheme: () => void;
  signIn: (name: string) => void;
  signOut: () => void;
  submitScore: (gameId: string, score: number, player: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function useAppState(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppState must be used inside AppStateProvider");
  return ctx;
}

export default function AppStateProvider({ children }: { children: ReactNode }) {
  // Start with defaults; hydrate from localStorage in useEffect to avoid SSR mismatch.
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [userScores, setUserScores] = useState<UserScores>({});

  // Hydrate once on mount — SSR starts with defaults; this syncs to localStorage on client.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const s = loadState();
    setTheme(s.theme);
    setUser(s.user);
    setUserScores(s.userScores);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Sync theme to DOM and persist
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    saveState({ theme });
  }, [theme]);

  // Persist user changes
  useEffect(() => {
    saveState({ user });
  }, [user]);

  // Persist score changes
  useEffect(() => {
    saveState({ userScores });
  }, [userScores]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  const signIn = useCallback((name: string) => {
    setUser({ name: name.toUpperCase() });
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
  }, []);

  const submitScore = useCallback(
    (gameId: string, score: number, player: string) => {
      const today = new Date().toISOString().slice(0, 10);
      setUserScores((prev) => {
        const arr = prev[gameId] ?? [];
        return {
          ...prev,
          [gameId]: [...arr, { player, score, date: today, mine: true }],
        };
      });
    },
    []
  );

  return (
    <AppContext.Provider
      value={{ theme, user, userScores, toggleTheme, signIn, signOut, submitScore }}
    >
      {children}
    </AppContext.Provider>
  );
}
