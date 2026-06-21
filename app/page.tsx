import { getGames } from "@/app/lib/gamesSupabase";
import HomeView from "./HomeView";

export default async function HomePage() {
  const games = await getGames();
  return <HomeView games={games} />;
}
