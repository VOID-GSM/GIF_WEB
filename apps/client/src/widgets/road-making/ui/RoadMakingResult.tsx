import Link from "next/link";
import { Coin } from "@repo/ui";

import type { RoadMakingRoundResult } from "@/entities/assessment";

const formatElapsed = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}분 ${s}초` : `${s}초`;
};

interface RoadMakingResultProps {
  result: RoadMakingRoundResult;
  onRetry: () => void;
  isRetrying: boolean;
}

export default function RoadMakingResult({
  result,
  onRetry,
  isRetrying,
}: RoadMakingResultProps) {
  const stats = [
    {
      label: "맞힌 문제",
      value: `${result.solvedCount} / ${result.questionCount}`,
    },
    { label: "틀린 문제", value: `${result.wrongCount}개` },
    { label: "정답률", value: `${result.accuracy}%` },
    { label: "걸린 시간", value: formatElapsed(result.elapsedSeconds) },
  ];

  return (
    <section className="mx-auto w-full max-w-[520px] rounded-[24px] bg-white p-6 text-center shadow md:p-8">
      <p className="text-[14px] font-medium text-orange-800">길 만들기</p>
      <h1 className="mt-1 text-[26px] font-semibold tracking-[-0.6px] text-gray-900">
        {result.completed ? "검사를 마쳤어요" : "검사를 중간에 그만뒀어요"}
      </h1>
      {!result.completed && (
        <p className="mt-1.5 text-[13px] text-gray-600">
          끝까지 풀지 않으면 코인을 받을 수 없어요.
        </p>
      )}
      {result.completed && result.solvedCount === 0 && (
        <p className="mt-1.5 text-[13px] text-gray-600">
          1문제 이상 맞혀야 코인을 받을 수 있어요.
        </p>
      )}

      <div className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-full bg-yellow-50 px-5 py-2.5 ring-1 ring-yellow-200">
        <Coin width={26} height={26} aria-hidden />
        <span className="text-[22px] font-bold tabular-nums tracking-[-0.5px] text-gray-900">
          +{result.earnedCoin.toLocaleString()}
        </span>
        <span className="text-[14px] text-gray-600">코인 획득</span>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-2.5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[14px] bg-gray-100 px-4 py-3"
          >
            <dt className="text-[13px] text-gray-600">{stat.label}</dt>
            <dd className="mt-0.5 text-[20px] font-semibold tabular-nums tracking-[-0.5px] text-gray-900">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-7 flex gap-2.5">
        <Link
          href="/assessment"
          className="flex h-12 flex-1 items-center justify-center rounded-[12px] border border-gray-300 text-[16px] font-semibold tracking-[-0.4px] text-gray-800 transition-colors hover:bg-gray-100"
        >
          역량검사 홈
        </Link>
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="h-12 flex-1 rounded-[12px] bg-yellow-600 text-[16px] font-semibold tracking-[-0.4px] text-white transition-colors hover:bg-yellow-700 disabled:bg-gray-300"
        >
          {isRetrying ? "준비 중…" : "다시 도전"}
        </button>
      </div>
    </section>
  );
}
