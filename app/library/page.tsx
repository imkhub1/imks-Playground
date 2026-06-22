import { getGames } from "@/app/lib/gamesSupabase";
import LibraryView from "./LibraryView";

export default async function LibraryPage() {
  const games = await getGames();
  return <LibraryView games={games} />;
}
