"use client";

import { useState } from "react";
import { Coin, Crown } from "@repo/ui";

import {
  ASSESSMENTS,
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
        aria-label={`${rank}위`}
      >
        {rank}
      </span>
    </span>
  );
}

interface AssessmentRankingCardProps {
  // 유형별 랭킹. 서버 API 가 생기기 전에는 비어 있다.
  rankings?: Partial<Record<AssessmentType, AssessmentRankingEntry[]>>;
}

export default function AssessmentRankingCard({
  rankings = {},
}: AssessmentRankingCardProps) {
  const [tab, setTab] = useState<AssessmentType>("cat-chase");
  const entries = rankings[tab] ?? [];

  return (
    <section className="rounded-[20px] bg-white p-5 shadow">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[16px] font-semibold tracking-[-0.4px] text-gray-900">
          GSM 랭킹
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
                {a.title}
              </button>
            );
          })}
        </div>
      </div>
      <p className="mt-0.5 text-[12px] text-gray-500">
        푼 문항 중 맞힌 문항으로 순위를 매겨요.
      </p>

      <div className="mt-3 overflow-hidden rounded-[14px] border border-gray-200">
        <div className="grid grid-cols-[44px_1fr_60px_60px] bg-yellow-100 px-2 py-2.5 text-[12px] font-medium text-gray-600">
          <span className="text-center">순위</span>
          <span className="pl-2">이름</span>
          <span className="text-center">맞힌 수</span>
          <span className="text-center">코인</span>
        </div>

        {entries.length === 0 ? (
          <div className="flex flex-col items-center gap-1 px-4 py-9 text-center">
            <p className="text-[14px] font-medium text-gray-700">
              아직 기록이 없어요
            </p>
            <p className="text-[13px] text-gray-500">
              첫 번째 랭커가 되어보세요!
            </p>
          </div>
        ) : (
          <ul>
            {entries.map((entry) => (
              <li
                key={`${entry.rank}-${entry.name}`}
                className={`grid grid-cols-[44px_1fr_60px_60px] items-center border-t border-gray-200 px-2 py-2 text-[14px] ${
                  entry.isMe ? "bg-yellow-50" : ""
                }`}
              >
                <span className="flex justify-center font-semibold text-gray-900">
                  <RankBadge rank={entry.rank} />
                </span>
                <span className="flex min-w-0 items-baseline gap-1.5 pl-2">
                  <span className="truncate font-semibold text-gray-900">
                    {entry.isMe ? "나" : entry.name}
                  </span>
                  {entry.grade && (
                    <span className="shrink-0 text-[12px] text-gray-500">
                      {entry.grade}학년
                    </span>
                  )}
                </span>
                <span className="text-center text-gray-600 tabular-nums">
                  {entry.correctCount}/{entry.totalCount}
                </span>
                <span className="flex items-center justify-center gap-1 text-gray-900 tabular-nums">
                  <Coin width={16} height={16} aria-hidden />
                  {entry.coin}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
