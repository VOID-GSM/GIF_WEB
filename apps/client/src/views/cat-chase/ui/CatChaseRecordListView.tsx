"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

import { useGetCatChaseRounds } from "@/entities/cat-chase";
import { formatTimestamp } from "@/entities/form";

import { RoundStatusBadge } from "./CatChaseResult";

export default function CatChaseRecordListView() {
  const t = useTranslations("catChase.record");
  // 서버가 최신순으로 내려준다.
  const { data: rounds = [], isPending, isError } = useGetCatChaseRounds();

  return (
    <div className="min-h-dvh w-full bg-background px-4 py-8 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-[960px]">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-semibold tracking-[-0.6px] text-gray-900 md:text-[26px]">
              {t("listTitle")}
            </h1>
            <p className="mt-1 text-[14px] text-gray-600">
              {t("listDesc")}
            </p>
          </div>
          <Link
            href="/assessment"
            className="flex h-10 items-center rounded-[10px] bg-yellow-600 px-4 text-[15px] font-semibold text-white transition-colors hover:bg-yellow-700"
          >
            {t("goToAssessment")}
          </Link>
        </header>

        <section className="overflow-hidden rounded-[20px] bg-white shadow">
          <div className="hidden grid-cols-[1fr_100px_100px_100px] gap-4 border-b border-gray-200 px-6 py-3 text-[13px] font-medium text-gray-500 sm:grid">
            <span>{t("date")}</span>
            <span className="text-center">{t("correctCount")}</span>
            <span className="text-center">{t("earnedCoin")}</span>
            <span className="text-center">{t("status")}</span>
          </div>

          {isPending ? (
            <ul className="flex flex-col gap-2 p-4">
              {Array.from({ length: 4 }, (_, i) => (
                <li key={i} className="h-12 animate-pulse rounded-[10px] bg-gray-100" />
              ))}
            </ul>
          ) : isError ? (
            <p className="py-16 text-center text-[15px] text-gray-600">
              {t("loadError")}
            </p>
          ) : rounds.length === 0 ? (
            <p className="py-16 text-center text-[15px] text-gray-600">
              {t("empty")}
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {rounds.map((round) => (
                <li key={round.roundId}>
                  <Link
                    // 진행 중인 검사는 이어서 풀 수 있게 검사 화면으로 보낸다.
                    href={
                      round.finished
                        ? `/assessment/cat-chase/records/${round.roundId}`
                        : `/assessment/cat-chase?roundId=${round.roundId}`
                    }
                    className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-6 py-4 transition-colors hover:bg-gray-100 sm:grid-cols-[1fr_100px_100px_100px]"
                  >
                    <span className="text-[15px] font-medium text-gray-800 tabular-nums">
                      {formatTimestamp(round.createdAt)}
                    </span>
                    <span className="hidden text-center text-[15px] text-gray-700 tabular-nums sm:block">
                      {round.correctCount} / {round.questionCount}
                    </span>
                    <span className="hidden text-center text-[15px] text-gray-700 tabular-nums sm:block">
                      {t("coin", { coin: round.earnedCoin })}
                    </span>
                    <span className="flex justify-center">
                      <RoundStatusBadge
                        finished={round.finished}
                        completed={round.completed}
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
