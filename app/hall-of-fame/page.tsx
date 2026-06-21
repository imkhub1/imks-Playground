import { getGames } from "@/app/lib/gamesSupabase";
import HallOfFameView from "./HallOfFameView";

export default async function HallOfFamePage() {
  const games = await getGames();
  return <HallOfFameView games={games} />;
}
