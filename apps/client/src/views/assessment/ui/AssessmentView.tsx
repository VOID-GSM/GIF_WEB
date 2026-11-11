"use client";

import { useTranslations } from "next-intl";
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
import { useAuthSession } from "@/entities/auth";
import {
  AssessmentRankingCard,
  AssessmentTypeCard,
  CoinBalanceBadge,
  GithubCoinCard,
  QuestionCountSelector,
} from "@/widgets/assessment";

export default function AssessmentView() {
  const t = useTranslations("assessment.setup");
  const router = useRouter();
  const { isExternal } = useAuthSession();
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
              {t("title")}
            </h1>
            <p className="mt-1 text-[14px] text-gray-600">
              {t("description")}
            </p>
          </div>
          <CoinBalanceBadge />
        </header>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* 검사 설정 */}
          <section className="flex flex-col gap-6 rounded-[20px] bg-white p-5 shadow md:p-7">
            {/* 사이드가 더 길 때 남는 높이를 유형 카드가 채운다 */}
            <div className="flex flex-1 flex-col">
              <StepTitle step={1} title={t("selectType")} />
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
              <StepTitle step={2} title={t("questionCount")} />
              <div className="mt-3">
                <QuestionCountSelector value={count} onChange={setCount} />
              </div>
              <p className="mt-2.5 flex flex-wrap gap-x-2 gap-y-1 text-[12px] text-gray-500">
                <span>{t("baseReward", { coin: BASE_REWARD_COIN })}</span>
                <span aria-hidden>·</span>
                <span>{t("perCorrect", { coin: REWARD_PER_CORRECT })}</span>
                <span aria-hidden>·</span>
                <span className="font-semibold text-orange-800">
                  {t("maxReward", { coin: getMaxReward(count) })}
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
                ? t("selectTypeFirst")
                : !selected?.playable
                  ? t("comingSoon")
                  : isStarting
                    ? t("preparing")
                    : t("start")}
            </button>
          </section>

          {/* 사이드 */}
          <aside className="flex flex-col gap-5">
            {/* GitHub 연동은 재학생 전용 — 외부 사용자는 역량검사로만 코인을 얻는다 */}
            {!isExternal && <GithubCoinCard />}
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
