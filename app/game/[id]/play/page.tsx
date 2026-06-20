import { notFound } from "next/navigation";
import { GAMES } from "@/app/lib/games";
import PlayerView from "./PlayerView";

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = GAMES.find((g) => g.id === id);
  if (!game) notFound();
  return <PlayerView game={game} />;
}
