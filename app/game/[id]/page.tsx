import { notFound } from "next/navigation";
import { getGame } from "@/app/lib/gamesSupabase";
import DetailView from "./DetailView";

export default async function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = await getGame(id);
  if (!game) notFound();
  return <DetailView game={game} />;
}
