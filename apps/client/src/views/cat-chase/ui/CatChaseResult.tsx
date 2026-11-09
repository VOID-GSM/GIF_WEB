"use client";

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
          {completed ? "검사를 마쳤어요!" : "검사를 중단했어요"}
        </h1>
        <p className="mt-1 text-[14px] text-gray-600">
          {completed
            ? "고양이 판단을 모두 맞힌 문항만 정답으로 계산해요."
            : "끝까지 풀지 않아 코인이 지급되지 않았어요."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stat label="맞힌 문항">
          {correctCount}
          <span className="text-[18px] text-gray-500"> / {questionCount}</span>
        </Stat>
        <Stat label="받은 코인">
          {earnedCoin}
          <span className="text-[18px] text-gray-500">코인</span>
        </Stat>
      </div>

      {isPending ? (
        <div className="h-[180px] animate-pulse rounded-[16px] bg-gray-100" />
      ) : isError ? (
        <p className="rounded-[16px] bg-gray-100 py-10 text-center text-[15px] text-gray-600">
          문항별 결과를 불러오지 못했어요. 내 기록에서 다시 확인해주세요.
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
                  {question.sequence}번 문항
                </span>
                <span className="flex items-center gap-3 text-[14px] text-gray-600">
                  고양이 {question.responses.filter((r) => r.correct).length} /{" "}
                  {question.responses.length} 맞힘
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
          역량검사로
        </Link>
        <Link
          href="/assessment/cat-chase/records"
          className="flex h-12 flex-1 items-center justify-center rounded-[12px] border border-gray-300 text-[16px] font-medium text-gray-700 transition-colors hover:bg-gray-100"
        >
          내 기록 보기
        </Link>
        <button
          type="button"
          onClick={restart}
          disabled={isRestarting}
          className="h-12 flex-1 rounded-[12px] bg-yellow-600 text-[16px] font-semibold tracking-[-0.5px] text-white transition-colors hover:bg-yellow-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {isRestarting ? "준비 중…" : "다시 하기"}
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
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${
        correct ? "bg-green-50 text-green-dark" : "bg-orange-50 text-orange-900"
      }`}
    >
      {correct ? "정답" : "오답"}
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
  const [label, className] = !finished
    ? ["진행 중", "bg-yellow-100 text-yellow-900"]
    : completed
      ? ["완료", "bg-green-50 text-green-dark"]
      : ["중단", "bg-gray-100 text-gray-500"];

  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${className}`}>
      {label}
    </span>
  );
}
