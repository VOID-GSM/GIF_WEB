"use client";

import Link from "next/link";

import {
  BASE_REWARD_COIN,
  REWARD_PER_CORRECT,
  isCorrectJudgment,
  isRoundCorrect,
  useGetCatChaseRoundResults,
} from "@/entities/cat-chase";

interface CatChaseResultProps {
  roundIds: number[];
  onRestart: () => void;
}

export default function CatChaseResult({
  roundIds,
  onRestart,
}: CatChaseResultProps) {
  const { data, isPending, isError } = useGetCatChaseRoundResults(roundIds);

  const correctRounds = data.filter(isRoundCorrect).length;
  const reward = BASE_REWARD_COIN + REWARD_PER_CORRECT * correctRounds;

  return (
    <section className="animate-pop-in flex h-fit w-full max-w-[720px] flex-col gap-6 rounded-[20px] border border-gray-300 bg-white p-6 md:p-10">
      <div className="text-center">
        <h1 className="text-[24px] font-semibold tracking-[-0.6px] text-gray-900 md:text-[32px]">
          검사를 마쳤어요!
        </h1>
        <p className="mt-1 text-[14px] text-gray-600">
          고양이 판단을 모두 맞힌 문항만 정답으로 계산해요.
        </p>
      </div>

      {isPending ? (
        <div className="h-[180px] animate-pulse rounded-[16px] bg-gray-100" />
      ) : isError ? (
        <p className="rounded-[16px] bg-gray-100 py-10 text-center text-[15px] text-gray-600">
          결과를 불러오지 못했어요. 내 기록에서 다시 확인해주세요.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="맞힌 문항">
              {correctRounds}
              <span className="text-[18px] text-gray-500"> / {data.length}</span>
            </Stat>
            <Stat label="획득 예정 코인">
              <span className="inline-flex items-center gap-1.5">
                {reward}
                <span className="text-[18px] text-gray-500">코인</span>
              </span>
            </Stat>
          </div>

          <ul className="flex flex-col divide-y divide-gray-200 rounded-[16px] border border-gray-200">
            {data.map((detail, i) => {
              const correctCount = detail.responses.filter(isCorrectJudgment).length;
              const correct = isRoundCorrect(detail);
              return (
                <li key={detail.roundId}>
                  <Link
                    href={`/assessment/cat-chase/records/${detail.roundId}`}
                    className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-gray-100"
                  >
                    <span className="text-[15px] font-medium text-gray-800">
                      {i + 1}번 문항
                    </span>
                    <span className="flex items-center gap-3 text-[14px] text-gray-600">
                      고양이 {correctCount} / {detail.responses.length} 맞힘
                      <ResultBadge correct={correct} />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Link
          href="/"
          className="flex h-12 flex-1 items-center justify-center rounded-[12px] border border-gray-300 text-[16px] font-medium text-gray-700 transition-colors hover:bg-gray-100"
        >
          메인으로
        </Link>
        <Link
          href="/assessment/cat-chase/records"
          className="flex h-12 flex-1 items-center justify-center rounded-[12px] border border-gray-300 text-[16px] font-medium text-gray-700 transition-colors hover:bg-gray-100"
        >
          내 기록 보기
        </Link>
        <button
          type="button"
          onClick={onRestart}
          className="h-12 flex-1 rounded-[12px] bg-yellow-600 text-[16px] font-semibold tracking-[-0.5px] text-white transition-colors hover:bg-yellow-700"
        >
          다시 하기
        </button>
      </div>
    </section>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-[16px] bg-yellow-50 py-5">
      <span className="text-[13px] text-gray-600">{label}</span>
      <span className="text-[28px] font-bold tracking-[-0.6px] text-gray-900 tabular-nums">
        {children}
      </span>
    </div>
  );
}

export function ResultBadge({ correct }: { correct: boolean }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${
        correct ? "bg-green-50 text-green-dark" : "bg-orange-50 text-orange-900"
      }`}
    >
      {correct ? "정답" : "오답"}
    </span>
  );
}
