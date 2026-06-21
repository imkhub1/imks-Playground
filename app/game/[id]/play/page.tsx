import { notFound } from "next/navigation";
import { getGame } from "@/app/lib/gamesSupabase";
import PlayerView from "./PlayerView";

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = await getGame(id);
  if (!game) notFound();
  return <PlayerView game={game} />;
}
