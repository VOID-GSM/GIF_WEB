import { notFound } from "next/navigation";

import CatChaseRecordDetailView from "@/views/cat-chase/ui/CatChaseRecordDetailView";

export default async function CatChaseRecordDetailPage({
  params,
}: {
  params: Promise<{ roundId: string }>;
}) {
  const { roundId } = await params;
  const id = Number(roundId);
  if (!Number.isInteger(id)) notFound();

  return <CatChaseRecordDetailView roundId={id} />;
}
