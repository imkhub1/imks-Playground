import { createClient } from "@/utils/supabase/client";
import type { ScoreRow } from "./scores";

export async function saveScore(
  gameId: string,
  player: string,
  score: number,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("scores")
    .insert({ game_id: gameId, player, score });
  if (error) throw error;
}

export async function fetchLeaderboard(
  gameId: string,
  limit = 10,
): Promise<ScoreRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("scores")
    .select("player, score, created_at")
    .eq("game_id", gameId)
    .order("score", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map((row) => ({
    player: row.player as string,
    score: row.score as number,
    date: (row.created_at as string).slice(0, 10),
  }));
}
