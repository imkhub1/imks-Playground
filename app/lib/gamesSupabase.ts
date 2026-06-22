import { createClient } from "@/utils/supabase/server";
import type { Game } from "./games";

export async function getGames(): Promise<Game[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("games")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data ?? []).map((row) => ({
    ...row,
    controls: row.controls as string[],
  }));
}

export async function getGame(id: string): Promise<Game | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("games")
    .select("*")
    .eq("id", id)
    .limit(1)
    .single();
  if (!data) return null;
  return { ...data, controls: data.controls as string[] };
}
