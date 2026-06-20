import { notFound } from "next/navigation";
import { GAMES } from "@/app/lib/games";
import DetailView from "./DetailView";

export default async function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = GAMES.find((g) => g.id === id);
  if (!game) notFound();
  return <DetailView game={game} />;
}
