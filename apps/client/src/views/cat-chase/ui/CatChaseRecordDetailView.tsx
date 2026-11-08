"use client";

import { useState } from "react";
import Link from "next/link";

import {
  CONFIDENCE_LABELS,
  DEFAULT_CAT_CHASE_BOARD_SIDE,
  useGetCatChaseRound,
  type CatChaseQuestionResult,
} from "@/entities/cat-chase";
import { formatTimestamp } from "@/entities/form";
import { CatChaseBoard, buildResultCells } from "@/widgets/cat-chase";

import { ResultBadge, RoundStatusBadge } from "./CatChaseResult";

const JUDGMENT_LABELS = { FOUND: "잡다 (O)", MISSED: "놓치다 (X)" } as const;

interface CatChaseRecordDetailViewProps {
  roundId: number;
  // 처음 펼쳐 볼 문항 번호 (결과 화면에서 문항을 눌러 들어온 경우)
  initialSequence?: number;
}

export default function CatChaseRecordDetailView({
  roundId,
  initialSequence,
}: CatChaseRecordDetailViewProps) {
  const { data, isPending, isError } = useGetCatChaseRound(roundId);
  const [selectedSequence, setSelectedSequence] = useState(initialSequence ?? 1);

  const questions = data?.questions ?? [];
  const selected =
    questions.find((q) => q.sequence === selectedSequence) ?? questions[0];

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
            <header className="mb-5 mt-3 flex flex-wrap items-center gap-3">
              <h1 className="text-[24px] font-semibold tracking-[-0.6px] text-gray-900 md:text-[26px]">
                {formatTimestamp(data.createdAt)} 기록
              </h1>
              <RoundStatusBadge
                finished={!!data.finishedAt}
                completed={data.completed}
              />
              <p className="text-[14px] text-gray-600 tabular-nums">
                {data.correctCount} / {data.questionCount}문항 정답 ·{" "}
                {data.earnedCoin}코인
              </p>
            </header>

            {questions.length === 0 ? (
              <p className="rounded-[20px] bg-white py-16 text-center text-[15px] text-gray-600 shadow">
                푼 문항이 없어요.
              </p>
            ) : (
              <>
                <nav
                  aria-label="문항 선택"
                  className="mb-4 flex flex-wrap gap-2"
                >
                  {questions.map((q) => (
                    <QuestionTab
                      key={q.questionId}
                      question={q}
                      selected={q.questionId === selected?.questionId}
                      onSelect={() => setSelectedSequence(q.sequence)}
                    />
                  ))}
                </nav>

                {selected && <QuestionDetail question={selected} />}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function QuestionTab({
  question,
  selected,
  onSelect,
}: {
  question: CatChaseQuestionResult;
  selected: boolean;
  onSelect: () => void;
}) {
  const tone = !question.answered
    ? "text-gray-400"
    : question.correct
      ? "text-green-dark"
      : "text-orange-900";

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[14px] font-medium transition-colors ${
        selected
          ? "border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900"
          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
      }`}
    >
      {question.sequence}번
      <span className={selected ? "" : tone} aria-hidden>
        {!question.answered ? "–" : question.correct ? "O" : "X"}
      </span>
    </button>
  );
}

function QuestionDetail({ question }: { question: CatChaseQuestionResult }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      <section className="flex flex-col items-center gap-4 rounded-[20px] bg-white p-5 shadow md:p-7">
        <CatChaseBoard
          gridSize={DEFAULT_CAT_CHASE_BOARD_SIDE}
          cells={buildResultCells(question)}
        />
        <p className="text-[13px] text-gray-500">
          고양이 칸의 작은 쥐는 실제로 쥐가 있던 자리예요.
        </p>
      </section>

      <section className="h-fit rounded-[20px] bg-white p-5 shadow">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-semibold tracking-[-0.4px] text-gray-800">
            내 판단
          </h2>
          {question.answered && <ResultBadge correct={question.correct} />}
        </div>
        {question.responses.length === 0 ? (
          <p className="mt-3 text-[14px] text-gray-500">
            제출하지 않은 문항이에요.
          </p>
        ) : (
          <ol className="mt-3 flex flex-col gap-2">
            {question.responses.map((response, i) => (
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
                <ResultBadge correct={response.correct} />
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
