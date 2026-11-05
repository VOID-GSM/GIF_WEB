"use client";

import Link from "next/link";

import { useGetCatChaseRounds } from "@/entities/cat-chase";
import { formatTimestamp } from "@/entities/form";

export default function CatChaseRecordListView() {
  const { data, isPending, isError } = useGetCatChaseRounds();

  const rounds = [...(data ?? [])].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <div className="min-h-dvh w-full bg-background px-4 py-8 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-[960px]">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-semibold tracking-[-0.6px] text-gray-900 md:text-[26px]">
              고양이 술래잡기 기록
            </h1>
            <p className="mt-1 text-[14px] text-gray-600">
              문항을 눌러 정답과 내 판단을 확인해보세요.
            </p>
          </div>
          <Link
            href="/assessment/cat-chase"
            className="flex h-10 items-center rounded-[10px] bg-yellow-600 px-4 text-[15px] font-semibold text-white transition-colors hover:bg-yellow-700"
          >
            검사 하러 가기
          </Link>
        </header>

        <section className="overflow-hidden rounded-[20px] bg-white shadow">
          <div className="hidden grid-cols-[1fr_100px_100px_100px] gap-4 border-b border-gray-200 px-6 py-3 text-[13px] font-medium text-gray-500 sm:grid">
            <span>진행 일시</span>
            <span className="text-center">쥐</span>
            <span className="text-center">고양이</span>
            <span className="text-center">상태</span>
          </div>

          {isPending ? (
            <ul className="flex flex-col gap-2 p-4">
              {Array.from({ length: 4 }, (_, i) => (
                <li key={i} className="h-12 animate-pulse rounded-[10px] bg-gray-100" />
              ))}
            </ul>
          ) : isError ? (
            <p className="py-16 text-center text-[15px] text-gray-600">
              기록을 불러오지 못했어요.
            </p>
          ) : rounds.length === 0 ? (
            <p className="py-16 text-center text-[15px] text-gray-600">
              아직 진행한 기록이 없어요.
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {rounds.map((round) => (
                <li key={round.roundId}>
                  <Link
                    href={`/assessment/cat-chase/records/${round.roundId}`}
                    className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-6 py-4 transition-colors hover:bg-gray-100 sm:grid-cols-[1fr_100px_100px_100px]"
                  >
                    <span className="text-[15px] font-medium text-gray-800 tabular-nums">
                      {formatTimestamp(round.createdAt)}
                    </span>
                    <span className="hidden text-center text-[15px] text-gray-700 sm:block">
                      {round.mouseCount}마리
                    </span>
                    <span className="hidden text-center text-[15px] text-gray-700 sm:block">
                      {round.catCount}마리
                    </span>
                    <span className="flex justify-center">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${
                          round.answered
                            ? "bg-yellow-100 text-yellow-900"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {round.answered ? "제출 완료" : "미제출"}
                      </span>
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
