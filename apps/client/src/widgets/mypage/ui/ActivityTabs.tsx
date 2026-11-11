"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useGetCatChaseRounds } from "@/entities/cat-chase";
import { formatTimestamp } from "@/entities/form";
import { useGetRetrospectives } from "@/entities/retrospective";
import { ThynAvatar, ThynItemCard, useGetThynItems } from "@/entities/thyn";
import RetrospectiveCard from "@/widgets/retrospective/ui/RetrospectiveCard";

type ActivityTab =
  | "retrospective"
  | "bookmark"
  | "assessment"
  | "thyn"
  | "comment"
  | "like";

const TABS: ActivityTab[] = [
  "retrospective",
  "bookmark",
  "assessment",
  "thyn",
  "comment",
  "like",
];

export default function ActivityTabs() {
  const t = useTranslations("mypage.activity");
  const [tab, setTab] = useState<ActivityTab>("retrospective");

  return (
    <section className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-[0_2px_6px_rgba(0,0,0,0.15)]">
      <div className="flex gap-1 overflow-x-auto border-b border-gray-100" role="tablist">
        {TABS.map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`shrink-0 cursor-pointer border-b-2 px-3 pb-3 text-[14px] font-medium transition-colors ${
              tab === key
                ? "border-yellow-600 text-gray-900"
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            {t(`tabs.${key}`)}
          </button>
        ))}
      </div>

      {tab === "retrospective" && <RetrospectiveList mine />}
      {tab === "bookmark" && <RetrospectiveList bookmarkedOnly />}
      {tab === "assessment" && <AssessmentHistory />}
      {tab === "thyn" && <ThynHistory />}
      {/* 서버 API 준비 중: GIF_SERVER #248(댓글·좋아요) */}
      {tab === "comment" && <Message text={t("commentComingSoon")} />}
      {tab === "like" && <Message text={t("likeComingSoon")} />}
    </section>
  );
}

function Message({ text, tone = "default" }: { text: string; tone?: "default" | "error" }) {
  return (
    <p
      className={`py-10 text-center text-[14px] ${
        tone === "error" ? "text-red-500" : "text-gray-500"
      }`}
    >
      {text}
    </p>
  );
}

function RetrospectiveList({
  mine,
  bookmarkedOnly,
}: {
  mine?: boolean;
  bookmarkedOnly?: boolean;
}) {
  const t = useTranslations("mypage.activity");
  const { data, isLoading, isError } = useGetRetrospectives({ mine, bookmarkedOnly });

  if (isLoading) return <Message text={t("loading")} />;
  if (isError) return <Message text={t("retrospectiveError")} tone="error" />;
  if (data.length === 0)
    return (
      <Message
        text={mine ? t("noMine") : t("noBookmark")}
      />
    );

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {data.map((retrospective, index) => (
        <RetrospectiveCard
          key={retrospective.id}
          retrospective={retrospective}
          animationDelayMs={index * 40}
        />
      ))}
    </div>
  );
}

function AssessmentHistory() {
  const t = useTranslations("mypage.activity");
  const { data: rounds = [], isLoading, isError } = useGetCatChaseRounds();

  if (isLoading) return <Message text={t("loading")} />;
  if (isError) return <Message text={t("assessmentError")} tone="error" />;
  if (rounds.length === 0) return <Message text={t("noAssessment")} />;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-gray-400">{t("catChase")}</span>
        <Link
          href="/assessment/cat-chase/records"
          className="text-[13px] font-medium text-gray-500 hover:text-gray-800"
        >
          {t("viewAllRecords")}
        </Link>
      </div>
      <ul className="flex flex-col gap-2">
        {rounds.map((round) => {
          const status = !round.finished
            ? t("inProgress")
            : round.completed
              ? t("earnedCoin", { coin: round.earnedCoin })
              : t("stopped");
          return (
            <li key={round.roundId}>
              <Link
                href={`/assessment/cat-chase/records/${round.roundId}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 px-4 py-3 transition-colors hover:bg-gray-100"
              >
                <div className="flex flex-col">
                  <span className="text-[14px] font-medium text-gray-800">
                    {t("correctCount", {
                      correct: round.correctCount,
                      total: round.questionCount,
                    })}
                  </span>
                  <span className="text-[12px] text-gray-400">
                    {formatTimestamp(round.createdAt)}
                  </span>
                </div>
                <span className="shrink-0 text-[13px] font-medium text-gray-900">
                  {status}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ThynHistory() {
  const t = useTranslations("mypage.activity");
  const { data: items = [], isLoading, isError } = useGetThynItems();

  if (isLoading) return <Message text={t("loading")} />;
  if (isError) return <Message text={t("thynError")} tone="error" />;

  const equippedItems = items.filter((item) => item.equipped);
  // 기본 아이템은 누구나 가지고 있어 구매 내역에서 뺀다
  const ownedItems = items.filter((item) => item.owned && !item.isDefault);

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <div className="flex shrink-0 flex-col items-center gap-4 rounded-2xl bg-gradient-to-b from-yellow-50 to-yellow-100 px-8 dark:from-yellow-950/40 dark:to-yellow-900/30 pt-6 pb-5 md:w-[220px]">
        <div className="relative flex flex-col items-center">
          <ThynAvatar items={equippedItems} width={128} fitHeadroom className="z-10" />
          {/* 바닥 그림자 */}
          <div className="-mt-3 h-4 w-24 rounded-[50%] bg-yellow-300/50 blur-[2px]" />
        </div>
        <Link
          href="/thyn"
          className="rounded-full bg-white px-4 py-1.5 text-[13px] font-medium text-gray-700 shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-colors hover:bg-yellow-50"
        >
          {t("goDecorate")}
        </Link>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <span className="text-[13px] font-medium text-gray-400">
          {t("ownedCount", { count: ownedItems.length })}
        </span>
        {ownedItems.length === 0 ? (
          <Message text={t("noOwned")} />
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            {ownedItems.map((item) => (
              <ThynItemCard
                key={item.id}
                item={item}
                mode="closet"
                hideStatus
                selected={item.equipped}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
