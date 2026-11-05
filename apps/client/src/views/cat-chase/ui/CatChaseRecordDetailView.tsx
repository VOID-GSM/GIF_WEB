"use client";

import Link from "next/link";

import {
  CONFIDENCE_LABELS,
  inferGridSize,
  isCorrectJudgment,
  isRoundCorrect,
  useGetCatChaseRound,
} from "@/entities/cat-chase";
import { formatTimestamp } from "@/entities/form";
import { CatChaseBoard, buildResultCells } from "@/widgets/cat-chase";

import { ResultBadge } from "./CatChaseResult";

const JUDGMENT_LABELS = { FOUND: "잡다 (O)", MISSED: "놓치다 (X)" } as const;

export default function CatChaseRecordDetailView({ roundId }: { roundId: number }) {
  const { data, isPending, isError } = useGetCatChaseRound(roundId);

  return (
    <div className="min-h-dvh w-full bg-background px-4 py-8 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-[960px]">
        <Link
          href="/assessment/cat-chase/records"
          className="text-[14px] text-gray-500 underline-offset-2 hover:underline"
        >
          ← 기록 목록
        </Link>

        {isPending ? (
          <div className="mt-4 h-[600px] animate-pulse rounded-[20px] bg-gray-100" />
        ) : isError || !data ? (
          <p className="mt-4 rounded-[20px] bg-white py-16 text-center text-[15px] text-gray-600 shadow">
            기록을 불러오지 못했어요.
          </p>
        ) : (
          <>
            <header className="mb-6 mt-3 flex flex-wrap items-center gap-3">
              <h1 className="text-[24px] font-semibold tracking-[-0.6px] text-gray-900 md:text-[26px]">
                {formatTimestamp(data.createdAt)} 기록
              </h1>
              {data.responses.length > 0 ? (
                <ResultBadge correct={isRoundCorrect(data)} />
              ) : (
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[12px] font-semibold text-gray-500">
                  미제출
                </span>
              )}
            </header>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
              <section className="flex flex-col items-center gap-4 rounded-[20px] bg-white p-5 shadow md:p-7">
                <CatChaseBoard
                  gridSize={inferGridSize([...data.mousePositions, ...data.catPositions])}
                  cells={buildResultCells(data)}
                />
                <p className="text-[13px] text-gray-500">
                  고양이 칸의 작은 쥐는 실제로 쥐가 있던 자리예요.
                </p>
              </section>

              <section className="h-fit rounded-[20px] bg-white p-5 shadow">
                <h2 className="text-[16px] font-semibold tracking-[-0.4px] text-gray-800">
                  내 판단
                </h2>
                {data.responses.length === 0 ? (
                  <p className="mt-3 text-[14px] text-gray-500">
                    제출하지 않은 문항이에요.
                  </p>
                ) : (
                  <ol className="mt-3 flex flex-col gap-2">
                    {data.responses.map((response, i) => (
                      <li
                        key={response.position}
                        className="flex items-center justify-between gap-2 rounded-[12px] border border-gray-200 px-3 py-2.5"
                      >
                        <div className="flex flex-col">
                          <span className="text-[14px] font-medium text-gray-800">
                            {i + 1}번 고양이 · {JUDGMENT_LABELS[response.judgment]}
                          </span>
                          <span className="text-[12px] text-gray-500">
                            {CONFIDENCE_LABELS[response.confidence]} · 실제{" "}
                            {response.hadMouse ? "쥐 있음" : "쥐 없음"}
                          </span>
                        </div>
                        <ResultBadge correct={isCorrectJudgment(response)} />
                      </li>
                    ))}
                  </ol>
                )}
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
