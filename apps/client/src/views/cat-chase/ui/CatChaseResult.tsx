"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useStartAssessmentRound } from "@/entities/assessment";
import {
  useGetCatChaseRound,
  type CatChaseRoundResult,
} from "@/entities/cat-chase";

interface CatChaseResultProps {
  result: CatChaseRoundResult;
}

export default function CatChaseResult({ result }: CatChaseResultProps) {
  const t = useTranslations("catChase.result");
  const router = useRouter();
  const { roundId, questionCount, correctCount, completed, earnedCoin } = result;
  const { data: detail, isPending, isError } = useGetCatChaseRound(roundId);
  const { mutate: startRound, isPending: isRestarting } =
    useStartAssessmentRound();

  const restart = () => {
    startRound(
      { type: "cat-chase", questionCount },
      {
        onSuccess: (next) =>
          router.replace(`/assessment/cat-chase?roundId=${next.roundId}`),
      },
    );
  };

  const answered = detail?.questions.filter((q) => q.answered) ?? [];

  return (
    <section className="animate-pop-in flex h-fit w-full max-w-[720px] flex-col gap-6 rounded-[20px] border border-gray-300 bg-white p-6 md:p-10">
      <div className="text-center">
        <h1 className="text-[24px] font-semibold tracking-[-0.6px] text-gray-900 md:text-[32px]">
          {completed ? t("completedTitle") : t("stoppedTitle")}
        </h1>
        <p className="mt-1 text-[14px] text-gray-600">
          {completed ? t("completedDesc") : t("stoppedDesc")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stat label={t("correctCount")}>
          {correctCount}
          <span className="text-[18px] text-gray-500"> / {questionCount}</span>
        </Stat>
        <Stat label={t("earnedCoin")}>
          {earnedCoin}
          <span className="text-[18px] text-gray-500">{t("coinUnit")}</span>
        </Stat>
      </div>

      {isPending ? (
        <div className="h-[180px] animate-pulse rounded-[16px] bg-gray-100" />
      ) : isError ? (
        <p className="rounded-[16px] bg-gray-100 py-10 text-center text-[15px] text-gray-600">
          {t("loadError")}
        </p>
      ) : answered.length > 0 ? (
        <ul className="flex flex-col divide-y divide-gray-200 rounded-[16px] border border-gray-200">
          {answered.map((question) => (
            <li key={question.questionId}>
              <Link
                href={`/assessment/cat-chase/records/${roundId}?q=${question.sequence}`}
                className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-gray-100"
              >
                <span className="text-[15px] font-medium text-gray-800">
                  {t("questionLabel", { sequence: question.sequence })}
                </span>
                <span className="flex items-center gap-3 text-[14px] text-gray-600">
                  {t("catsCorrect", {
                    correct: question.responses.filter((r) => r.correct).length,
                    total: question.responses.length,
                  })}
                  <ResultBadge correct={question.correct} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Link
          href="/assessment"
          className="flex h-12 flex-1 items-center justify-center rounded-[12px] border border-gray-300 text-[16px] font-medium text-gray-700 transition-colors hover:bg-gray-100"
        >
          {t("toAssessment")}
        </Link>
        <Link
          href="/assessment/cat-chase/records"
          className="flex h-12 flex-1 items-center justify-center rounded-[12px] border border-gray-300 text-[16px] font-medium text-gray-700 transition-colors hover:bg-gray-100"
        >
          {t("myRecords")}
        </Link>
        <button
          type="button"
          onClick={restart}
          disabled={isRestarting}
          className="h-12 flex-1 rounded-[12px] bg-yellow-600 text-[16px] font-semibold tracking-[-0.5px] text-white transition-colors hover:bg-yellow-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {isRestarting ? t("preparing") : t("retry")}
        </button>
      </div>
    </section>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-[16px] bg-yellow-50 py-5">
      <span className="text-[13px] text-gray-600">{label}</span>
      <span className="text-[28px] font-bold tracking-[-0.6px] text-gray-900 tabular-nums">
        {children}
      </span>
    </div>
  );
}

export function ResultBadge({ correct }: { correct: boolean }) {
  const t = useTranslations("catChase.result");
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${
        correct ? "bg-green-50 text-green-dark" : "bg-orange-50 text-orange-900"
      }`}
    >
      {correct ? t("correct") : t("wrong")}
    </span>
  );
}

export function RoundStatusBadge({
  finished,
  completed,
}: {
  finished: boolean;
  completed: boolean;
}) {
  const t = useTranslations("catChase.result");
  const [label, className] = !finished
    ? [t("inProgress"), "bg-yellow-100 text-yellow-900"]
    : completed
      ? [t("done"), "bg-green-50 text-green-dark"]
      : [t("stopped"), "bg-gray-100 text-gray-500"];

  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${className}`}>
      {label}
    </span>
  );
}
