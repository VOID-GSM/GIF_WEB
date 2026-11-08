import { notFound } from "next/navigation";

import CatChaseRecordDetailView from "@/views/cat-chase/ui/CatChaseRecordDetailView";

export default async function CatChaseRecordDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ roundId: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const [{ roundId }, { q }] = await Promise.all([params, searchParams]);
  const id = Number(roundId);
  if (!Number.isInteger(id)) notFound();

  // ?q= 는 처음 펼쳐 볼 문항 번호 (결과 화면에서 문항을 눌러 들어온 경우)
  const sequence = Number(q);

  return (
    <CatChaseRecordDetailView
      roundId={id}
      initialSequence={Number.isInteger(sequence) && sequence > 0 ? sequence : undefined}
    />
  );
}
