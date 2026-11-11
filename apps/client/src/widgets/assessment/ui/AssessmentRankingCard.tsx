"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Coin, Crown } from "@repo/ui";

import {
  ASSESSMENTS,
  useGetAssessmentRanking,
  type AssessmentRankingEntry,
  type AssessmentType,
} from "@/entities/assessment";

// 등수 페이지(PodiumCard)와 같은 금·은·동 그라데이션을 쓴다.
const TOP_RANK_BADGES: Record<number, string> = {
  1: "bg-gradient-to-b from-yellow-500 to-yellow-800",
  2: "bg-gradient-to-b from-gray-400 to-gray-600",
  3: "bg-gradient-to-b from-orange-400 to-orange-700",
};

function RankBadge({ rank }: { rank: number }) {
  const t = useTranslations("assessment.ranking");
  const badge = TOP_RANK_BADGES[rank];
  if (!badge) {
    return <span className="text-[14px] font-semibold text-gray-700">{rank}</span>;
  }
  return (
    <span className="relative inline-flex">
      {rank === 1 && (
        <Crown
          aria-hidden
          className="absolute -top-2.5 left-1/2 size-3.5 -translate-x-1/2 text-yellow-600"
        />
      )}
      <span
        className={`flex size-6 items-center justify-center rounded-full text-[12px] font-bold text-white shadow-sm ${badge}`}
        aria-label={t("rankLabel", { rank })}
      >
        {rank}
      </span>
    </span>
  );
}

const GRID = "grid grid-cols-[44px_1fr_60px_60px]";

function RankingRow({
  entry,
  isMe,
}: {
  entry: AssessmentRankingEntry;
  isMe: boolean;
}) {
  const t = useTranslations("assessment.ranking");
  return (
    <li
      className={`${GRID} items-center border-t border-gray-200 px-2 py-2 text-[14px] ${
        isMe ? "bg-yellow-50" : ""
      }`}
    >
      <span className="flex justify-center font-semibold text-gray-900">
        <RankBadge rank={entry.rank} />
      </span>
      <span className="flex min-w-0 items-baseline gap-1.5 pl-2">
        <span className="truncate font-semibold text-gray-900">
          {isMe ? t("me") : entry.name}
        </span>
        {entry.grade != null && (
          <span className="shrink-0 text-[12px] text-gray-500">
            {t("grade", { grade: entry.grade })}
          </span>
        )}
      </span>
      <span className="text-center text-gray-600 tabular-nums">
        {entry.correctCount}/{entry.totalCount}
      </span>
      <span className="flex items-center justify-center gap-1 text-gray-900 tabular-nums">
        <Coin width={16} height={16} aria-hidden />
        {entry.earnedCoin}
      </span>
    </li>
  );
}

interface AssessmentRankingCardProps {
  // 같은 문항 수로 푼 기록끼리만 순위를 매긴다.
  questionCount: number;
  // 왼쪽에서 고른 검사 유형. 바뀌면 탭도 따라가고, 탭은 사용자가 따로 바꿀 수도 있다.
  selectedType: AssessmentType | null;
}

export default function AssessmentRankingCard({
  questionCount,
  selectedType,
}: AssessmentRankingCardProps) {
  const t = useTranslations("assessment.ranking");
  const tt = useTranslations("assessment.types");
  const [tab, setTab] = useState<AssessmentType>(selectedType ?? "cat-chase");
  const [prevSelectedType, setPrevSelectedType] = useState(selectedType);
  // effect 대신 렌더 중에 prop 변화를 감지해 탭을 맞춘다 (추가 렌더·깜빡임 없음).
  if (selectedType !== prevSelectedType) {
    setPrevSelectedType(selectedType);
    if (selectedType) setTab(selectedType);
  }
  const { data, isPending, isError, isPlaceholderData } =
    useGetAssessmentRanking(tab, questionCount);
  const entries = data?.rankings ?? [];
  const me = data?.me ?? null;
  // rank는 사용자마다 고유하므로(서버에서 동점 재정렬) rank로 내 행을 찾는다.
  // 상위 목록에 내가 없으면 맨 아래에 내 순위를 따로 보여준다.
  const isMeInTop = !!me && entries.some((e) => e.rank === me.rank);

  return (
    <section className="rounded-[20px] bg-white p-5 shadow">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[16px] font-semibold tracking-[-0.4px] text-gray-900">
          {t("title")}
        </h2>
        <div className="flex rounded-[12px] bg-gray-100 p-1" role="tablist">
          {ASSESSMENTS.map((a) => {
            const active = a.type === tab;
            return (
              <button
                key={a.type}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(a.type)}
                className={`rounded-[8px] px-2.5 py-1 text-[12px] font-medium transition-colors ${
                  active
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tt(`${a.type}.title`)}
              </button>
            );
          })}
        </div>
      </div>
      <p className="mt-0.5 text-[12px] text-gray-500">
        {t("description", { count: questionCount })}
      </p>

      <div className="mt-3 overflow-hidden rounded-[14px] border border-gray-200">
        <div className={`${GRID} bg-yellow-100 px-2 py-2.5 text-[12px] font-medium text-gray-600`}>
          <span className="text-center">{t("rank")}</span>
          <span className="pl-2">{t("name")}</span>
          <span className="text-center">{t("correct")}</span>
          <span className="text-center">{t("coin")}</span>
        </div>

        {isPending ? (
          <ul aria-busy>
            {Array.from({ length: 3 }, (_, i) => (
              <li key={i} className="border-t border-gray-200 px-3 py-2.5">
                <div className="h-5 animate-pulse rounded bg-gray-100" />
              </li>
            ))}
          </ul>
        ) : isError ? (
          <p className="px-4 py-9 text-center text-[13px] text-gray-500">
            {t("error")}
          </p>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center gap-1 px-4 py-9 text-center">
            <p className="text-[14px] font-medium text-gray-700">
              {t("emptyTitle")}
            </p>
            <p className="text-[13px] text-gray-500">
              {t("emptyDesc")}
            </p>
          </div>
        ) : (
          <ul
            aria-busy={isPlaceholderData}
            className={`transition-opacity ${isPlaceholderData ? "opacity-50" : ""}`}
          >
            {entries.map((entry) => (
              <RankingRow
                key={entry.rank}
                entry={entry}
                isMe={entry.rank === me?.rank}
              />
            ))}
            {me && !isMeInTop && <RankingRow entry={me} isMe />}
          </ul>
        )}
      </div>
    </section>
  );
}
