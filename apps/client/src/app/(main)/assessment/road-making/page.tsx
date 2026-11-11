import { redirect } from "next/navigation";

import RoadMakingView from "@/views/road-making/ui/RoadMakingView";

export default async function RoadMakingPage({
  searchParams,
}: {
  searchParams: Promise<{ roundId?: string | string[] }>;
}) {
  const { roundId } = await searchParams;
  const id = Array.isArray(roundId) ? roundId[0] : roundId;

  // 라운드는 역량검사 홈에서 시작한다.
  if (!id) redirect("/assessment");

  // 다시 도전으로 roundId 가 바뀌면 진행 상태를 처음부터 다시 잡는다.
  return <RoadMakingView key={id} roundId={id} />;
}
