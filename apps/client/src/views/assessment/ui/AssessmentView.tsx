"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  ASSESSMENTS,
  BASE_REWARD_COIN,
  DEFAULT_QUESTION_COUNT,
  REWARD_PER_CORRECT,
  getMaxReward,
  useStartAssessmentRound,
  type AssessmentType,
} from "@/entities/assessment";
import {
  AssessmentRankingCard,
  AssessmentTypeCard,
  CoinBalanceBadge,
  GithubCoinCard,
  QuestionCountSelector,
} from "@/widgets/assessment";

export default function AssessmentView() {
  const router = useRouter();
  const [type, setType] = useState<AssessmentType | null>(null);
  const [count, setCount] = useState(DEFAULT_QUESTION_COUNT);

  const { mutate: startRound, isPending: isStarting } =
    useStartAssessmentRound();

  const selected = ASSESSMENTS.find((a) => a.type === type);
  // 진행 페이지가 없는 검사는 라운드를 만들지 않는다 (만들면 404 + 버려진 라운드가 남음).
  const canStart = !!selected?.playable && !isStarting;

  const handleStart = () => {
    if (!type || !canStart) return;
    startRound(
      { type, questionCount: count },
      {
        onSuccess: ({ roundId }) =>
          router.push(`/assessment/${type}?roundId=${roundId}`),
      },
    );
  };

  return (
    <div className="flex min-h-dvh w-full items-center bg-background px-4 py-8 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-[1120px]">
        {/* 헤더 */}
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-semibold tracking-[-0.6px] text-gray-900 md:text-[26px]">
              역량검사
            </h1>
            <p className="mt-1 text-[14px] text-gray-600">
              짧은 게임을 풀며 작업 기억·공간 지각 같은 문제 해결 역량을
              확인하는 검사예요.
            </p>
          </div>
          <CoinBalanceBadge />
        </header>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* 검사 설정 */}
          <section className="flex flex-col gap-6 rounded-[20px] bg-white p-5 shadow md:p-7">
            {/* 사이드가 더 길 때 남는 높이를 유형 카드가 채운다 */}
            <div className="flex flex-1 flex-col">
              <StepTitle step={1} title="검사 유형 선택" />
              <div className="mt-3 grid flex-1 gap-3 sm:grid-cols-2">
                {ASSESSMENTS.map((a) => (
                  <AssessmentTypeCard
                    key={a.type}
                    assessment={a}
                    selected={type === a.type}
                    onSelect={() => setType(a.type)}
                  />
                ))}
              </div>
            </div>

            <div>
              <StepTitle step={2} title="문항 수" />
              <div className="mt-3">
                <QuestionCountSelector value={count} onChange={setCount} />
              </div>
              <p className="mt-2.5 flex flex-wrap gap-x-2 gap-y-1 text-[12px] text-gray-500">
                <span>1문항 이상 맞히면 기본 {BASE_REWARD_COIN}코인</span>
                <span aria-hidden>·</span>
                <span>맞힐 때마다 +{REWARD_PER_CORRECT}코인</span>
                <span aria-hidden>·</span>
                <span className="font-semibold text-orange-800">
                  최대 {getMaxReward(count)}코인
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={handleStart}
              disabled={!canStart}
              className="h-12 w-full rounded-[12px] bg-yellow-600 text-[16px] font-semibold tracking-[-0.5px] text-white transition-colors hover:bg-yellow-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {!type
                ? "검사 유형을 선택해주세요"
                : !selected?.playable
                  ? "곧 열릴 예정이에요"
                  : isStarting
                    ? "검사 준비 중…"
                    : "시작하기"}
            </button>
          </section>

          {/* 사이드 */}
          <aside className="flex flex-col gap-5">
            <GithubCoinCard />
            <AssessmentRankingCard questionCount={count} selectedType={type} />
          </aside>
        </div>
      </div>
    </div>
  );
}

function StepTitle({ step, title }: { step: number; title: string }) {
  return (
    <h2 className="flex items-center gap-2 text-[16px] font-semibold tracking-[-0.4px] text-gray-800">
      <span className="flex size-5 items-center justify-center rounded-full bg-gray-900 text-[11px] text-white dark:bg-white dark:text-gray-900">
        {step}
      </span>
      {title}
    </h2>
  );
}
