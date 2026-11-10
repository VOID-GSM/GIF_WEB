"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import Link from "next/link";

import {
  DEFAULT_CAT_CHASE_BOARD_SIDE,
  useGetCatChaseRound,
  type CatChaseQuestionResult,
} from "@/entities/cat-chase";
import { formatTimestamp } from "@/entities/form";
import { CatChaseBoard, buildResultCells } from "@/widgets/cat-chase";

import { ResultBadge, RoundStatusBadge } from "./CatChaseResult";

interface CatChaseRecordDetailViewProps {
  roundId: number;
  // 처음 펼쳐 볼 문항 번호 (결과 화면에서 문항을 눌러 들어온 경우)
  initialSequence?: number;
}

export default function CatChaseRecordDetailView({
  roundId,
  initialSequence,
}: CatChaseRecordDetailViewProps) {
  const t = useTranslations("catChase.record");
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
          {t("backToList")}
        </Link>

        {isPending ? (
          <div className="mt-4 h-[600px] animate-pulse rounded-[20px] bg-gray-100" />
        ) : isError || !data ? (
          <p className="mt-4 rounded-[20px] bg-white py-16 text-center text-[15px] text-gray-600 shadow">
            {t("loadError")}
          </p>
        ) : (
          <>
            <header className="mb-5 mt-3 flex flex-wrap items-center gap-3">
              <h1 className="text-[24px] font-semibold tracking-[-0.6px] text-gray-900 md:text-[26px]">
                {t("detailTitle", { date: formatTimestamp(data.createdAt) })}
              </h1>
              <RoundStatusBadge
                finished={!!data.finishedAt}
                completed={data.completed}
              />
              <p className="text-[14px] text-gray-600 tabular-nums">
                {t("detailSummary", {
                  correct: data.correctCount,
                  total: data.questionCount,
                  coin: data.earnedCoin,
                })}
              </p>
            </header>

            {questions.length === 0 ? (
              <p className="rounded-[20px] bg-white py-16 text-center text-[15px] text-gray-600 shadow">
                {t("noQuestions")}
              </p>
            ) : (
              <>
                <nav
                  aria-label={t("selectQuestion")}
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
  const t = useTranslations("catChase.record");
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
      {t("questionTab", { sequence: question.sequence })}
      <span className={selected ? "" : tone} aria-hidden>
        {!question.answered ? "–" : question.correct ? "O" : "X"}
      </span>
    </button>
  );
}

function QuestionDetail({ question }: { question: CatChaseQuestionResult }) {
  const t = useTranslations("catChase.record");
  const tc = useTranslations("catChase.confidence");
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      <section className="flex flex-col items-center gap-4 rounded-[20px] bg-white p-5 shadow md:p-7">
        <CatChaseBoard
          gridSize={DEFAULT_CAT_CHASE_BOARD_SIDE}
          cells={buildResultCells(question)}
        />
        <p className="text-[13px] text-gray-500">
          {t("boardHint")}
        </p>
      </section>

      <section className="h-fit rounded-[20px] bg-white p-5 shadow">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-semibold tracking-[-0.4px] text-gray-800">
            {t("myJudgment")}
          </h2>
          {question.answered && <ResultBadge correct={question.correct} />}
        </div>
        {question.responses.length === 0 ? (
          <p className="mt-3 text-[14px] text-gray-500">
            {t("notSubmitted")}
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
                    {t("catJudgment", { index: i + 1 })} · {t(`judgment.${response.judgment}`)}
                  </span>
                  <span className="text-[12px] text-gray-500">
                    {tc(response.confidence)} ·{" "}
                    {response.hadMouse ? t("actualMouse") : t("actualNoMouse")}
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
