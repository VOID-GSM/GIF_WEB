"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
  CAT_CHASE_TIMING,
  DEFAULT_QUESTION_COUNT,
  MAX_QUESTION_COUNT,
  MIN_QUESTION_COUNT,
  useStartCatChaseRound,
  useSubmitCatChaseJudgments,
  type CatChaseConfidence,
  type CatChaseJudgment,
  type CatChaseJudgmentItem,
  type StartCatChaseRoundResponse,
} from "@/entities/cat-chase";
import { CatChaseBoard, JudgmentCard, type BoardCell } from "@/widgets/cat-chase";

import CatChaseResult from "./CatChaseResult";

type Phase =
  | { name: "ready" }
  | { name: "starting" }
  | { name: "mice" }
  | { name: "blank" }
  | { name: "target"; catIndex: number }
  | { name: "question"; catIndex: number }
  | { name: "submitting" }
  | { name: "finished" };

const PHASE_GUIDE: Partial<Record<Phase["name"], string>> = {
  mice: "쥐가 숨은 자리를 기억하세요",
  blank: "쥐가 숨었어요",
  target: "빨간 고양이가 쥐를 잡았을지 생각해보세요",
};

// 한 문항에서 판단하는 고양이 수
const QUESTIONS_PER_ROUND = 2;

// 나온 고양이 중 판단할 고양이를 무작위로 고른다. 서버가 준 순서는 유지한다.
const pickTargets = (catPositions: number[]) => {
  const picked = new Set(
    [...catPositions]
      .sort(() => Math.random() - 0.5)
      .slice(0, QUESTIONS_PER_ROUND),
  );
  return catPositions.filter((p) => picked.has(p));
};

const parseCount = (raw: string | null) => {
  const count = Number(raw);
  if (!Number.isInteger(count)) return DEFAULT_QUESTION_COUNT;
  return Math.min(MAX_QUESTION_COUNT, Math.max(MIN_QUESTION_COUNT, count));
};

export default function CatChaseGameView() {
  const searchParams = useSearchParams();
  const questionCount = parseCount(searchParams.get("count"));

  const [phase, setPhase] = useState<Phase>({ name: "ready" });
  const [round, setRound] = useState<StartCatChaseRoundResponse | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [judgments, setJudgments] = useState<CatChaseJudgmentItem[]>([]);
  // 이번 문항에서 판단할 고양이 위치 (나온 고양이 중 최대 QUESTIONS_PER_ROUND 마리)
  const [targets, setTargets] = useState<number[]>([]);
  const [completedRoundIds, setCompletedRoundIds] = useState<number[]>([]);

  const { mutateAsync: startRound } = useStartCatChaseRound();
  const { mutateAsync: submitJudgments } = useSubmitCatChaseJudgments();

  const beginRound = async () => {
    setPhase({ name: "starting" });
    try {
      const next = await startRound();
      setRound(next);
      setJudgments([]);
      setTargets(pickTargets(next.catPositions));
      setPhase({ name: "mice" });
    } catch {
      setPhase({ name: "ready" });
    }
  };

  const finishRound = async (
    current: StartCatChaseRoundResponse,
    items: CatChaseJudgmentItem[],
  ) => {
    if (items.length > 0) {
      setPhase({ name: "submitting" });
      try {
        await submitJudgments({
          roundId: current.roundId,
          body: { judgments: items },
        });
      } catch {
        // 제출에 실패하면 마지막 고양이 판단을 다시 받는다.
        setJudgments(items.slice(0, -1));
        setPhase({ name: "question", catIndex: items.length - 1 });
        return;
      }
      setCompletedRoundIds((ids) => [...ids, current.roundId]);
    }

    if (questionIndex + 1 >= questionCount) {
      setPhase({ name: "finished" });
      return;
    }
    setQuestionIndex((i) => i + 1);
    await beginRound();
  };

  const handleJudge = (
    judgment: CatChaseJudgment,
    confidence: CatChaseConfidence,
  ) => {
    if (!round || phase.name !== "question") return;
    const items = [
      ...judgments,
      { position: targets[phase.catIndex], judgment, confidence },
    ];
    setJudgments(items);

    const nextIndex = phase.catIndex + 1;
    if (nextIndex < targets.length) {
      setPhase({ name: "target", catIndex: nextIndex });
      return;
    }
    void finishRound(round, items);
  };

  // 쥐 → 빈 보드 → 고양이(판단할 고양이는 빨강, 판단을 마친 고양이는 파랑) 순서로 자동 진행한다.
  useEffect(() => {
    if (!round) return;
    const advance: Partial<Record<Phase["name"], [number, Phase]>> = {
      mice: [CAT_CHASE_TIMING.mice, { name: "blank" }],
      blank: [CAT_CHASE_TIMING.blank, { name: "target", catIndex: 0 }],
    };

    if (phase.name === "blank" && targets.length === 0) {
      // 판단할 고양이가 없으면 바로 다음 문항으로 넘어간다.
      const timer = setTimeout(() => finishRound(round, []), CAT_CHASE_TIMING.blank);
      return () => clearTimeout(timer);
    }

    if (phase.name === "target") {
      const { catIndex } = phase;
      // 고양이가 처음 나타날 때는 위치를 볼 시간을 조금 더 준다.
      const timer = setTimeout(
        () => setPhase({ name: "question", catIndex }),
        catIndex === 0 ? CAT_CHASE_TIMING.cats : CAT_CHASE_TIMING.target,
      );
      return () => clearTimeout(timer);
    }

    const step = advance[phase.name];
    if (!step) return;
    const timer = setTimeout(() => setPhase(step[1]), step[0]);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, round, targets]);

  const restart = () => {
    setQuestionIndex(0);
    setCompletedRoundIds([]);
    setRound(null);
    void beginRound();
  };

  const cells = useMemo(() => {
    const map = new Map<number, BoardCell>();
    if (!round) return map;

    if (phase.name === "mice") {
      round.mousePositions.forEach((p) => map.set(p, { content: "mouse" }));
    }
    if (phase.name === "target") {
      const targetIndex = phase.catIndex;
      // 판단할 고양이는 빨강, 이미 판단한 고양이는 파랑, 나머지는 노랑
      round.catPositions.forEach((p) => {
        const i = targets.indexOf(p);
        map.set(p, {
          content:
            i === -1 || i > targetIndex
              ? "cat"
              : i === targetIndex
                ? "cat-red"
                : "cat-blue",
        });
      });
    }
    return map;
  }, [phase, round, targets]);

  if (phase.name === "finished") {
    return (
      <PageShell>
        <CatChaseResult roundIds={completedRoundIds} onRestart={restart} />
      </PageShell>
    );
  }

  if (phase.name === "ready" || (phase.name === "starting" && !round)) {
    return (
      <PageShell>
        <ReadyCard
          questionCount={questionCount}
          isStarting={phase.name === "starting"}
          onStart={beginRound}
        />
      </PageShell>
    );
  }

  const catCount = targets.length;
  const showQuestion = phase.name === "question" || phase.name === "submitting";
  const questionCatIndex =
    phase.name === "question" ? phase.catIndex : Math.max(0, catCount - 1);

  return (
    <PageShell>
      <div className="flex w-full flex-col items-center gap-4 md:gap-6">
        <header className="flex w-full max-w-[960px] flex-wrap items-center justify-between gap-2">
          <p className="text-[15px] font-medium tracking-[-0.4px] text-gray-700">
            문항{" "}
            <span className="font-semibold text-gray-900">
              {questionIndex + 1}
            </span>{" "}
            / {questionCount}
            {showQuestion && catCount > 1 && (
              <span className="ml-2 text-gray-500">
                · 고양이 {questionCatIndex + 1} / {catCount}
              </span>
            )}
          </p>
          <p
            aria-live="polite"
            className="text-[15px] font-medium tracking-[-0.4px] text-gray-600"
          >
            {PHASE_GUIDE[phase.name] ?? ""}
          </p>
        </header>

        {showQuestion ? (
          <JudgmentCard
            key={`${round?.roundId}-${questionCatIndex}`}
            isLast={questionCatIndex + 1 >= catCount}
            disabled={phase.name === "submitting"}
            onSubmit={handleJudge}
          />
        ) : (
          <CatChaseBoard
            gridSize={round?.gridSize ?? 6}
            cells={cells}
            fitViewport
            key={phase.name === "target" ? `target-${phase.catIndex}` : phase.name}
          />
        )}
      </div>
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-background px-4 py-6 md:px-8">
      {children}
    </div>
  );
}

function ReadyCard({
  questionCount,
  isStarting,
  onStart,
}: {
  questionCount: number;
  isStarting: boolean;
  onStart: () => void;
}) {
  const steps = [
    "보드에 잠깐 나타나는 쥐의 위치를 기억하세요.",
    "쥐가 숨은 뒤 고양이들이 나타나요.",
    "빨간 고양이가 쥐를 잡았는지(O) 놓쳤는지(X) 고르고, 얼마나 확신하는지 선택하세요.",
  ];

  return (
    <section className="flex h-fit w-full max-w-[640px] flex-col gap-6 rounded-[20px] border border-gray-300 bg-white p-6 md:p-10">
      <div>
        <h1 className="text-[24px] font-semibold tracking-[-0.6px] text-gray-900 md:text-[28px]">
          고양이 술래잡기
        </h1>
        <p className="mt-1 text-[14px] text-gray-600">
          총 {questionCount}문항 · 작업 기억
        </p>
      </div>

      <ol className="flex flex-col gap-3">
        {steps.map((step, i) => (
          <li key={step} className="flex gap-3 text-[15px] text-gray-800">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-yellow-200 text-[13px] font-semibold text-yellow-900">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Link
          href="/"
          className="flex h-12 items-center justify-center rounded-[12px] border border-gray-300 px-5 text-[16px] font-medium text-gray-700 transition-colors hover:bg-gray-100"
        >
          돌아가기
        </Link>
        <button
          type="button"
          onClick={onStart}
          disabled={isStarting}
          className="h-12 flex-1 rounded-[12px] bg-yellow-600 text-[16px] font-semibold tracking-[-0.5px] text-white transition-colors hover:bg-yellow-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {isStarting ? "준비 중..." : "시작하기"}
        </button>
      </div>
      <Link
        href="/assessment/cat-chase/records"
        className="self-center text-[14px] text-gray-500 underline-offset-2 hover:underline"
      >
        내 기록 보기
      </Link>
    </section>
  );
}
