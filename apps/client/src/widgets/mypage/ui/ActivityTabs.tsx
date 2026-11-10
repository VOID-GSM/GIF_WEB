"use client";

import Link from "next/link";
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

const TABS: { key: ActivityTab; label: string }[] = [
  { key: "retrospective", label: "내 회고록" },
  { key: "bookmark", label: "북마크" },
  { key: "assessment", label: "역량검사" },
  { key: "thyn", label: "Thyn 꾸미기" },
  { key: "comment", label: "작성한 댓글" },
  { key: "like", label: "좋아요" },
];

export default function ActivityTabs() {
  const [tab, setTab] = useState<ActivityTab>("retrospective");

  return (
    <section className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-[0_2px_6px_rgba(0,0,0,0.15)]">
      <div className="flex gap-1 overflow-x-auto border-b border-gray-100" role="tablist">
        {TABS.map(({ key, label }) => (
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
            {label}
          </button>
        ))}
      </div>

      {tab === "retrospective" && <RetrospectiveList mine />}
      {tab === "bookmark" && <RetrospectiveList bookmarkedOnly />}
      {tab === "assessment" && <AssessmentHistory />}
      {tab === "thyn" && <ThynHistory />}
      {/* 서버 API 준비 중: GIF_SERVER #248(댓글·좋아요) */}
      {tab === "comment" && <Message text="작성한 댓글 목록은 준비 중이에요." />}
      {tab === "like" && <Message text="좋아요한 프로젝트 목록은 준비 중이에요." />}
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
  const { data, isLoading, isError } = useGetRetrospectives({ mine, bookmarkedOnly });

  if (isLoading) return <Message text="불러오는 중..." />;
  if (isError) return <Message text="회고록을 불러오지 못했어요." tone="error" />;
  if (data.length === 0)
    return (
      <Message
        text={mine ? "아직 작성한 회고록이 없어요." : "북마크한 회고록이 없어요."}
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
  const { data: rounds = [], isLoading, isError } = useGetCatChaseRounds();

  if (isLoading) return <Message text="불러오는 중..." />;
  if (isError) return <Message text="역량검사 기록을 불러오지 못했어요." tone="error" />;
  if (rounds.length === 0) return <Message text="아직 응시한 역량검사가 없어요." />;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-gray-400">고양이 술래잡기</span>
        <Link
          href="/assessment/cat-chase/records"
          className="text-[13px] font-medium text-gray-500 hover:text-gray-800"
        >
          전체 기록 보기
        </Link>
      </div>
      <ul className="flex flex-col gap-2">
        {rounds.map((round) => {
          const status = !round.finished
            ? "진행 중"
            : round.completed
              ? `+${round.earnedCoin}코인`
              : "중단";
          return (
            <li key={round.roundId}>
              <Link
                href={`/assessment/cat-chase/records/${round.roundId}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 px-4 py-3 transition-colors hover:bg-gray-100"
              >
                <div className="flex flex-col">
                  <span className="text-[14px] font-medium text-gray-800">
                    {round.correctCount} / {round.questionCount} 정답
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
  const { data: items = [], isLoading, isError } = useGetThynItems();

  if (isLoading) return <Message text="불러오는 중..." />;
  if (isError) return <Message text="Thyn 아이템을 불러오지 못했어요." tone="error" />;

  const equippedItems = items.filter((item) => item.equipped);
  // 기본 아이템은 누구나 가지고 있어 구매 내역에서 뺀다
  const ownedItems = items.filter((item) => item.owned && !item.isDefault);

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <div className="flex shrink-0 flex-col items-center gap-4 rounded-2xl bg-gradient-to-b from-yellow-50 to-yellow-100 px-8 pt-6 pb-5 md:w-[220px]">
        <div className="relative flex flex-col items-center">
          <ThynAvatar items={equippedItems} width={128} fitHeadroom className="z-10" />
          {/* 바닥 그림자 */}
          <div className="-mt-3 h-4 w-24 rounded-[50%] bg-yellow-300/50 blur-[2px]" />
        </div>
        <Link
          href="/thyn"
          className="rounded-full bg-white px-4 py-1.5 text-[13px] font-medium text-gray-700 shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-colors hover:bg-yellow-50"
        >
          꾸미러 가기
        </Link>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <span className="text-[13px] font-medium text-gray-400">
          구매한 아이템 {ownedItems.length}개
        </span>
        {ownedItems.length === 0 ? (
          <Message text="아직 구매한 아이템이 없어요." />
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
