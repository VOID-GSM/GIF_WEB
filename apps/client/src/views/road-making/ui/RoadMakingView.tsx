"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import {
  DEFAULT_QUESTION_COUNT,
  ROAD_MAKING_TIME_LIMIT_SECONDS,
  RoadMakingRoundEndedError,
  useFinishRoadMakingRound,
  useRecoverRoadMakingProblem,
  useRoadMakingRound,
  useStartAssessmentRound,
  useSubmitRoadMakingAnswer,
  type RoadMakingProblem,
  type RoadMakingRoundResult,
  type RoadMakingVehicleResult,
} from "@/entities/assessment";
import {
  RoadMakingBoard,
  RoadMakingResult,
  RoadMakingRules,
  RoadMakingTimer,
  cellKey,
} from "@/widgets/road-making";

// 제출 후 차가 지나간 길을 잠깐 보여준 뒤 다음 문제로 넘어간다. 틀렸을 때는 길을 읽을 시간을 조금 더 준다.
const REVEAL_MS = { correct: 1200, wrong: 2000 } as const;
// 클라이언트 마감 시각은 응답 지연만큼 서버보다 이르다. 서버가 만료로 판단하기 전에 종료를 부르면
// 이탈(코인 0)로 처리되므로 조금 기다렸다가 종료한다.
const TIME_OVER_SETTLE_MS = 2500;

type Feedback = "correct" | "wrong" | "timeover" | null;

export default function RoadMakingView({ roundId }: { roundId: string }) {
  const router = useRouter();
  const {
    data: round,
    dataUpdatedAt,
    isPending,
    error,
  } = useRoadMakingRound(roundId);
  const { mutate: submit, isPending: isSubmitting } =
    useSubmitRoadMakingAnswer();
  const { mutate: recover } = useRecoverRoadMakingProblem();
  const { mutate: finish, isPending: isFinishing } = useFinishRoadMakingRound();
  const { mutate: restart, isPending: isRestarting } =
    useStartAssessmentRound();

  // 답할 때마다 서버가 준 다음 문제로 바꿔 끼운다. 처음에는 라운드 시작 응답의 문제를 쓴다.
  const [currentProblem, setCurrentProblem] =
    useState<RoadMakingProblem | null>(null);
  const [fences, setFences] = useState<Set<string>>(() => new Set());
  const [results, setResults] = useState<RoadMakingVehicleResult[] | null>(
    null,
  );
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [score, setScore] = useState<{ solved: number; wrong: number } | null>(
    null,
  );
  const [result, setResult] = useState<RoadMakingRoundResult | null>(null);
  const [confirmQuit, setConfirmQuit] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishRequested = useRef(false);

  const problem = currentProblem ?? round?.problem ?? null;
  const isStaleRound = !!round && String(round.roundId) !== roundId;
  const questionCount = round?.questionCount ?? DEFAULT_QUESTION_COUNT;

  // 응답을 받은 시각 + 남은 초로 마감 시각을 잡아 서버·클라이언트 시계 차이를 피한다.
  const deadline = round ? dataUpdatedAt + round.remainingSeconds * 1000 : null;
  const remaining = deadline
    ? Math.max(0, (deadline - now) / 1000)
    : ROAD_MAKING_TIME_LIMIT_SECONDS;
  const isTimeUp = !!deadline && remaining <= 0;

  useEffect(() => {
    if (!deadline || result) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [deadline, result]);

  useEffect(
    () => () => {
      if (revealTimer.current) clearTimeout(revealTimer.current);
    },
    [],
  );

  const requestResult = () => {
    if (!round || finishRequested.current) return;
    finishRequested.current = true;
    finish(round.roundId, {
      onSuccess: setResult,
      onError: () => {
        finishRequested.current = false;
      },
    });
  };

  // 시간이 다 되면 서버가 만료로 판단할 때까지 잠깐 기다린 뒤 결과를 받는다.
  useEffect(() => {
    if (!isTimeUp || result || isStaleRound) return;
    const id = setTimeout(requestResult, TIME_OVER_SETTLE_MS);
    return () => clearTimeout(id);
    // requestResult 는 매 렌더 새로 만들어지지만 중복 호출은 finishRequested 로 막는다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimeUp, result, isStaleRound]);

  // 이미 끝난 라운드 주소로 들어오면 그 라운드의 결과를 보여준다.
  const rawResult =
    result ??
    (error instanceof RoadMakingRoundEndedError ? error.result : null);
  // 서버 결과에 questionCount 가 빠져 올 때가 있어("7 / undefined"),
  // 이번 라운드의 문항 수로, 그것도 없으면 답한 문항 수로 채운다.
  const shownResult = rawResult && {
    ...rawResult,
    questionCount:
      rawResult.questionCount ||
      round?.questionCount ||
      rawResult.solvedCount + rawResult.wrongCount,
  };

  if (shownResult) {
    return (
      <PageShell>
        <div className="flex min-h-[70dvh] items-center">
          <RoadMakingResult
            result={shownResult}
            isRetrying={isRestarting}
            onRetry={() =>
              restart(
                {
                  type: "road-making",
                  // 문항 수를 모르면(도입 전 라운드는 0, 응답에 빠진 경우 등) 기본값으로 다시 시작한다.
                  // 답한 문항 수로 채운 표시용 값은 고를 수 없는 문항 수일 수 있어 쓰지 않는다.
                  questionCount:
                    rawResult?.questionCount ||
                    round?.questionCount ||
                    DEFAULT_QUESTION_COUNT,
                },
                {
                  onSuccess: ({ roundId: next }) =>
                    router.replace(`/assessment/road-making?roundId=${next}`),
                },
              )
            }
          />
        </div>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell>
        <Notice
          title="검사를 불러오지 못했어요"
          body="잠시 후 다시 시도해주세요."
        />
      </PageShell>
    );
  }

  if (isStaleRound && round) {
    // 이 라운드는 이미 끝났고, 서버가 진행 중인 다른 라운드를 돌려준 경우
    return (
      <PageShell>
        <Notice
          title="이 검사는 이미 끝났어요"
          body="진행 중인 검사가 있어요. 이어서 풀어볼까요?"
          action={
            <button
              type="button"
              onClick={() =>
                router.replace(
                  `/assessment/road-making?roundId=${round.roundId}`,
                )
              }
              className="h-11 rounded-[12px] bg-yellow-600 px-5 text-[15px] font-semibold text-white hover:bg-yellow-700"
            >
              이어서 풀기
            </button>
          }
        />
      </PageShell>
    );
  }

  const required = problem?.minFenceCount ?? 0;
  const placed = fences.size;
  const isRevealing = feedback === "correct" || feedback === "wrong";
  const locked =
    !problem ||
    isSubmitting ||
    isRevealing ||
    isFinishing ||
    isTimeUp ||
    confirmQuit;
  const sequence = problem?.sequence ?? 1;
  // 새로고침 직후에는 맞힘/틀림 내역을 모른다. 첫 문항이면 둘 다 0 이다.
  const solved = score?.solved ?? (sequence === 1 ? 0 : null);
  const wrong = score?.wrong ?? (sequence === 1 ? 0 : null);

  const resetBoard = () => {
    setFences(new Set());
    setResults(null);
    setFeedback(null);
  };

  const showProblem = (next: RoadMakingProblem) => {
    setCurrentProblem(next);
    resetBoard();
  };

  const handleToggle = (row: number, col: number) => {
    if (locked) return;
    const key = cellKey(row, col);
    if (!fences.has(key) && placed >= required) {
      toast(
        `울타리는 ${required}개만 놓을 수 있어요. 다른 울타리를 치운 뒤 놓아주세요.`,
        { id: "road-making-fence-limit" },
      );
      return;
    }
    const next = new Set(fences);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setFences(next);
  };

  // 서버와 화면이 어긋났을 때: 지금 풀 문항을 다시 받고, 라운드가 이미 끝났으면 결과를 받는다.
  const resync = () => {
    if (!round) return;
    recover(round.roundId, {
      onSuccess: (current) => {
        toast("이미 답한 문제라 다음 문제로 넘어갈게요.");
        showProblem(current);
      },
      onError: requestResult,
    });
  };

  const handleSubmit = () => {
    if (!round || !problem || locked || placed !== required) return;
    submit(
      {
        roundId: round.roundId,
        problemId: problem.problemId,
        fences: [...fences].map((key) => {
          const [row, col] = key.split("-").map(Number);
          return { row, col };
        }),
      },
      {
        onSuccess: (res) => {
          if (res.timeOver) {
            finishRequested.current = true;
            setFeedback("timeover");
            if (res.result) setResult(res.result);
            else {
              finishRequested.current = false;
              requestResult();
            }
            return;
          }
          setScore({ solved: res.solvedCount, wrong: res.wrongCount });
          setResults(res.vehicleResults);
          const outcome = res.correct ? "correct" : "wrong";
          setFeedback(outcome);
          if (res.result) finishRequested.current = true;
          revealTimer.current = setTimeout(() => {
            if (res.result) setResult(res.result);
            else if (res.nextProblem) showProblem(res.nextProblem);
            else resync();
          }, REVEAL_MS[outcome]);
        },
        onError: (error) => {
          if (isAxiosError(error) && error.response?.status === 409) resync();
        },
      },
    );
  };

  const handleQuit = () => {
    setConfirmQuit(false);
    requestResult();
  };

  return (
    <PageShell>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href="/assessment"
            className="inline-flex items-center gap-1 text-[13px] font-medium text-gray-600 hover:text-gray-900"
          >
            <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden>
              <path
                d="M10 3 5 8l5 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            역량검사
          </Link>
          <h1 className="mt-1 flex items-center gap-2 text-[24px] font-semibold tracking-[-0.6px] text-gray-900 md:text-[26px]">
            길 만들기
            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[12px] font-medium tracking-normal text-orange-900">
              공간 지각
            </span>
          </h1>
        </div>
        <RoadMakingTimer remaining={remaining} />
      </header>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-[20px] bg-white p-4 shadow sm:p-6 md:p-7">
          {/* 현황 */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <ProblemProgress sequence={sequence} total={questionCount} />
            <FenceCounter placed={placed} required={required} />
            <div className="flex gap-1.5 text-[13px] font-medium">
              <span className="rounded-full bg-[#e6f6e8] px-2.5 py-1 text-[#2f7d3a]">
                맞힘 <b className="tabular-nums">{solved ?? "-"}</b>
              </span>
              <span className="rounded-full bg-[#ffecec] px-2.5 py-1 text-[#c62f32]">
                틀림 <b className="tabular-nums">{wrong ?? "-"}</b>
              </span>
            </div>
          </div>

          <FeedbackBanner
            feedback={isTimeUp ? "timeover" : feedback}
            required={required}
            isLast={sequence >= questionCount}
          />

          <div className="mt-4">
            {isPending || !problem ? (
              <div className="mx-auto aspect-square w-full max-w-[520px] animate-pulse rounded-[20px] bg-gray-100" />
            ) : (
              <RoadMakingBoard
                key={problem.problemId}
                rows={problem.rows}
                cols={problem.cols}
                vehicles={problem.vehicles}
                people={problem.people}
                fences={fences}
                canPlaceMore={placed < required}
                disabled={locked}
                results={results}
                onToggle={handleToggle}
              />
            )}
          </div>

          <div className="mx-auto mt-5 flex max-w-[520px] gap-2.5">
            <button
              type="button"
              onClick={() => !locked && resetBoard()}
              disabled={locked || placed === 0}
              className="h-12 rounded-[12px] border border-gray-300 px-5 text-[15px] font-semibold tracking-[-0.4px] text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              초기화
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={locked || placed !== required}
              className="h-12 flex-1 rounded-[12px] bg-yellow-600 text-[16px] font-semibold tracking-[-0.4px] text-white transition-colors hover:bg-yellow-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {isSubmitting
                ? "확인 중…"
                : isRevealing
                  ? "다음 문제 준비 중…"
                  : placed < required
                    ? `울타리 ${required - placed}개 더 놓기`
                    : "제출하기"}
            </button>
          </div>
          <p className="mt-2.5 text-center text-[12px] text-gray-500">
            문제마다 제출은 한 번뿐이에요. 틀려도 다음 문제로 넘어가요.
          </p>
        </section>

        <aside className="flex flex-col gap-5">
          <RoadMakingRules questionCount={questionCount} />
          {confirmQuit ? (
            <div className="rounded-[16px] border border-[#ffc9c9] bg-[#fff5f5] p-4">
              <p className="text-[14px] font-semibold text-[#c62f32]">
                정말 그만둘까요?
              </p>
              <p className="mt-1 text-[13px] text-gray-700">
                끝까지 풀지 않고 그만두면 이탈로 처리돼 코인을 받을 수 없어요.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmQuit(false)}
                  className="h-10 flex-1 rounded-[10px] bg-gray-900 text-[14px] font-semibold text-white hover:bg-gray-800"
                >
                  계속 풀기
                </button>
                <button
                  type="button"
                  onClick={handleQuit}
                  className="h-10 flex-1 rounded-[10px] border border-[#ffb3b3] bg-white text-[14px] font-semibold text-[#c62f32] hover:bg-[#ffecec]"
                >
                  그만두기
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmQuit(true)}
              disabled={!round || isFinishing || isTimeUp}
              className="h-11 rounded-[12px] border border-gray-300 bg-white text-[14px] font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-50"
            >
              {isFinishing ? "종료하는 중…" : "그만두기"}
            </button>
          )}
        </aside>
      </div>
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh w-full bg-background px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-[1040px]">{children}</div>
    </div>
  );
}

function ProblemProgress({
  sequence,
  total,
}: {
  sequence: number;
  total: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-baseline gap-1.5">
        <span className="text-[13px] font-medium text-gray-500">문제</span>
        <span className="text-[24px] font-semibold tabular-nums tracking-[-0.6px] text-gray-900">
          {sequence}
        </span>
        <span className="text-[15px] font-medium tabular-nums text-gray-400">
          / {total}
        </span>
      </div>
      <div className="hidden gap-1 sm:flex" aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`size-2 rounded-full transition-colors ${
              i < sequence - 1
                ? "bg-gray-800"
                : i === sequence - 1
                  ? "bg-yellow-600 ring-2 ring-yellow-200"
                  : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function FenceCounter({
  placed,
  required,
}: {
  placed: number;
  required: number;
}) {
  return (
    <div
      className="flex items-center gap-2"
      aria-label={`울타리 ${required}개 중 ${placed}개 놓음`}
    >
      <span className="text-[13px] font-medium text-gray-500">울타리</span>
      <div className="flex gap-1" aria-hidden>
        {Array.from({ length: required }, (_, i) => (
          <span
            key={i}
            className={`h-2.5 w-5 rounded-full transition-colors ${
              i < placed ? "bg-[#c98a3c]" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <span className="text-[14px] font-semibold tabular-nums text-gray-800">
        {placed}/{required}
      </span>
    </div>
  );
}

function FeedbackBanner({
  feedback,
  required,
  isLast,
}: {
  feedback: Feedback;
  required: number;
  isLast: boolean;
}) {
  const after = isLast ? "결과를 정리하고 있어요." : "다음 문제로 넘어가요.";
  const { style, message } =
    feedback === "correct"
      ? {
          style: "bg-[#e6f6e8] text-[#2f7d3a]",
          message: `정답이에요! ${after}`,
        }
      : feedback === "wrong"
        ? {
            style: "bg-[#ffecec] text-[#c62f32]",
            message: `아쉬워요. 차가 지나간 길을 확인해보세요. ${after}`,
          }
        : feedback === "timeover"
          ? {
              style: "bg-[#ffecec] text-[#c62f32]",
              message: "시간이 끝났어요. 결과를 정리하고 있어요.",
            }
          : {
              style: "bg-gray-100 text-gray-700",
              message: `울타리 ${required}개로 모든 차를 같은 색 사람에게 데려다주세요.`,
            };

  return (
    <p
      role="status"
      className={`rounded-[12px] px-4 py-2.5 text-center text-[14px] font-medium tracking-[-0.3px] transition-colors ${style}`}
    >
      {message}
    </p>
  );
}

function Notice({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mx-auto mt-[15dvh] flex max-w-[420px] flex-col items-center gap-2 rounded-[20px] bg-white p-8 text-center shadow">
      <h1 className="text-[20px] font-semibold tracking-[-0.5px] text-gray-900">
        {title}
      </h1>
      <p className="text-[14px] text-gray-600">{body}</p>
      <div className="mt-4 flex gap-2">
        <Link
          href="/assessment"
          className="flex h-11 items-center rounded-[12px] border border-gray-300 px-5 text-[15px] font-semibold text-gray-700 hover:bg-gray-100"
        >
          역량검사 홈
        </Link>
        {action}
      </div>
    </div>
  );
}
