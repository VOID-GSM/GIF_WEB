"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import type { CatChaseQuestion } from "@/entities/assessment";
import {
  CAT_CHASE_TIMING,
  CAT_COLORS,
  CAT_COLOR_LABELS,
  getCatColor,
  useFinishCatChaseRound,
  useGetCatChaseSession,
  useRecoverCatChaseSession,
  useSubmitCatChaseJudgments,
  type CatChaseAnswer,
  type CatChaseConfidence,
  type CatChaseJudgmentItem,
  type CatChaseRoundResult,
  type CatChaseSession,
  type SubmitCatChaseJudgmentsResponse,
} from "@/entities/cat-chase";
import {
  CatChaseBoard,
  JudgmentCard,
  type BoardCell,
} from "@/widgets/cat-chase";

import CatChaseResult from "./CatChaseResult";

type Phase =
  | { name: "ready" }
  | { name: "mice" }
  | { name: "blank" }
  // 빨간 고양이와 파란 고양이가 함께 나타난다.
  | { name: "cats" }
  // 빨간 고양이(0) → 파란 고양이(1) 순서로 하나씩 묻는다.
  | { name: "question"; catIndex: number }
  | { name: "submitting" }
  // 제출 응답을 못 받았고 서버에도 저장되지 않은 상태. 같은 판단을 다시 보낸다.
  | { name: "submit-error"; items: CatChaseJudgmentItem[] };

const PHASE_GUIDE: Partial<Record<Phase["name"], string>> = {
  mice: "쥐가 숨은 자리를 기억하세요",
  blank: "쥐가 숨었어요",
  cats: "빨간 고양이와 파란 고양이의 위치를 기억하세요",
};

const parseRoundId = (raw: string | null) => {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
};

export default function CatChaseGameView() {
  const roundId = parseRoundId(useSearchParams().get("roundId"));

  return (
    <PageShell>
      {roundId ? (
        // 다시 하기로 roundId 가 바뀌면 진행 상태를 처음부터 새로 잡는다.
        <CatChaseGame key={roundId} roundId={roundId} />
      ) : (
        <NoticeCard message="잘못된 검사 요청이에요. 역량검사에서 다시 시작해주세요." />
      )}
    </PageShell>
  );
}

function CatChaseGame({ roundId }: { roundId: number }) {
  const { data: session, isPending, isError } = useGetCatChaseSession(roundId);
  const [result, setResult] = useState<CatChaseRoundResult | null>(null);

  if (isPending) {
    return (
      <div className="h-[420px] w-full max-w-[640px] animate-pulse rounded-[20px] bg-gray-100" />
    );
  }

  if (isError || !session) {
    return <NoticeCard message="검사 정보를 불러오지 못했어요." />;
  }

  const finalResult = result ?? session.result;
  if (finalResult) return <CatChaseResult result={finalResult} />;

  return <CatChasePlay session={session} onFinished={setResult} />;
}

function CatChasePlay({
  session,
  onFinished,
}: {
  session: CatChaseSession;
  onFinished: (result: CatChaseRoundResult) => void;
}) {
  const { roundId, questionCount, boardSide } = session;

  // session.result 가 없으면 서버가 현재 문항을 함께 내려준다.
  const [question, setQuestion] = useState<CatChaseQuestion>(
    session.question as CatChaseQuestion,
  );
  const [phase, setPhase] = useState<Phase>({ name: "ready" });
  const [judgments, setJudgments] = useState<CatChaseJudgmentItem[]>([]);
  const [isConfirmingQuit, setIsConfirmingQuit] = useState(false);

  const { mutateAsync: submitJudgments } = useSubmitCatChaseJudgments();
  const { mutateAsync: recoverSession } = useRecoverCatChaseSession();
  const { mutate: finishRound, isPending: isFinishing } =
    useFinishCatChaseRound();

  // 서버가 준 순서대로 빨간 고양이, 파란 고양이를 판단한다 (GIF_SERVER#240 반영 전에는 앞의 2마리만 묻는다).
  const targets = question.catPositions.slice(0, CAT_COLORS.length);

  const moveTo = (next: CatChaseQuestion) => {
    setQuestion(next);
    setJudgments([]);
    setPhase({ name: "mice" });
  };

  const handleResponse = ({
    result,
    nextQuestion,
  }: SubmitCatChaseJudgmentsResponse) => {
    if (result) onFinished(result);
    else if (nextQuestion) moveTo(nextQuestion);
  };

  // 응답만 못 받고 서버에는 저장됐을 수 있어서, 다시 보내기 전에 서버 상태를 확인한다.
  const recover = async (items: CatChaseJudgmentItem[]) => {
    try {
      const latest = await recoverSession(roundId);
      if (latest.result) return onFinished(latest.result);
      if (
        latest.question &&
        latest.question.questionId !== question.questionId
      ) {
        return moveTo(latest.question);
      }
    } catch {
      // 확인도 실패하면 아래에서 다시 제출할 수 있게 둔다.
    }
    setPhase({ name: "submit-error", items });
  };

  const submit = async (items: CatChaseJudgmentItem[]) => {
    setPhase({ name: "submitting" });
    try {
      handleResponse(
        await submitJudgments({
          roundId,
          questionId: question.questionId,
          body: { judgments: items },
        }),
      );
    } catch {
      await recover(items);
    }
  };

  const recordJudgment = (item: Omit<CatChaseJudgmentItem, "position">) => {
    if (phase.name !== "question") return;
    const items = [
      ...judgments,
      { position: targets[phase.catIndex], ...item },
    ];
    setJudgments(items);

    const nextIndex = phase.catIndex + 1;
    if (nextIndex < targets.length) {
      setPhase({ name: "question", catIndex: nextIndex });
      return;
    }
    void submit(items);
  };

  const handleJudge = (
    judgment: CatChaseAnswer,
    confidence: CatChaseConfidence,
  ) => recordJudgment({ judgment, confidence });

  // 제한 시간 안에 답하지 않으면 오답(TIMEOUT)으로 기록하고 다음 질문으로 넘어간다.
  const handleTimeout = () =>
    recordJudgment({ judgment: "TIMEOUT", confidence: null });

  const handleQuit = () => {
    finishRound(roundId, { onSuccess: onFinished });
  };

  // 쥐 → 빈 보드 → 빨강·파랑 고양이 순서로 자동 진행한다.
  useEffect(() => {
    if (phase.name === "mice") {
      const timer = setTimeout(
        () => setPhase({ name: "blank" }),
        CAT_CHASE_TIMING.mice,
      );
      return () => clearTimeout(timer);
    }
    if (phase.name === "blank") {
      const timer = setTimeout(
        () => setPhase({ name: "cats" }),
        CAT_CHASE_TIMING.blank,
      );
      return () => clearTimeout(timer);
    }
    if (phase.name === "cats") {
      const timer = setTimeout(
        () => setPhase({ name: "question", catIndex: 0 }),
        CAT_CHASE_TIMING.cats,
      );
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const cells = useMemo(() => {
    const map = new Map<number, BoardCell>();
    if (phase.name === "mice") {
      question.mousePositions.forEach((p) => map.set(p, { content: "mouse" }));
    }
    if (phase.name === "cats") {
      targets.forEach((p, i) =>
        map.set(p, {
          content: getCatColor(i) === "red" ? "cat-red" : "cat-blue",
        }),
      );
    }
    return map;
  }, [phase, question, targets]);

  if (phase.name === "ready") {
    return (
      <ReadyCard
        questionCount={questionCount}
        resumeFrom={question.sequence > 1 ? question.sequence : null}
        onStart={() => setPhase({ name: "mice" })}
      />
    );
  }

  if (phase.name === "submit-error") {
    const { items } = phase;
    return (
      <NoticeCard message="판단을 제출하지 못했어요. 네트워크를 확인하고 다시 시도해주세요.">
        <button
          type="button"
          onClick={() => void submit(items)}
          className="h-12 w-full rounded-[12px] bg-yellow-600 text-[16px] font-semibold tracking-[-0.5px] text-white transition-colors hover:bg-yellow-700"
        >
          다시 제출하기
        </button>
      </NoticeCard>
    );
  }

  const catCount = targets.length;
  const showQuestion = phase.name === "question" || phase.name === "submitting";
  const questionCatIndex =
    phase.name === "question" ? phase.catIndex : catCount - 1;

  return (
    <div className="flex w-full flex-col items-center gap-4 md:gap-6">
      <header className="flex w-full max-w-[960px] flex-wrap items-center justify-between gap-2">
        <p className="text-[15px] font-medium tracking-[-0.4px] text-gray-700">
          문항{" "}
          <span className="font-semibold text-gray-900">
            {question.sequence}
          </span>{" "}
          / {questionCount}
          {showQuestion && catCount > 1 && (
            <span className="ml-2 text-gray-500">
              · {CAT_COLOR_LABELS[CAT_COLORS[questionCatIndex]]} (
              {questionCatIndex + 1}/{catCount})
            </span>
          )}
        </p>
        <div className="flex items-center gap-3">
          <p
            aria-live="polite"
            className="text-[15px] font-medium tracking-[-0.4px] text-gray-600"
          >
            {PHASE_GUIDE[phase.name] ?? ""}
          </p>
          <QuitControl
            isConfirming={isConfirmingQuit}
            isFinishing={isFinishing}
            disabled={phase.name === "submitting"}
            onAsk={() => setIsConfirmingQuit(true)}
            onCancel={() => setIsConfirmingQuit(false)}
            onConfirm={handleQuit}
          />
        </div>
      </header>

      {showQuestion ? (
        <JudgmentCard
          // 고양이마다 선택과 제한 시간을 새로 시작한다.
          key={`${question.questionId}-${questionCatIndex}`}
          cat={CAT_COLORS[questionCatIndex]}
          timeLimitMs={CAT_CHASE_TIMING.answer}
          isLast={questionCatIndex + 1 >= catCount}
          disabled={phase.name === "submitting"}
          onSubmit={handleJudge}
          onTimeout={handleTimeout}
        />
      ) : (
        <CatChaseBoard
          gridSize={boardSide}
          cells={cells}
          fitViewport
          key={phase.name}
        />
      )}
    </div>
  );
}

// 끝까지 풀기 전에 그만두면 중단으로 기록되고 코인을 받지 않아서 한 번 더 확인한다.
function QuitControl({
  isConfirming,
  isFinishing,
  disabled,
  onAsk,
  onCancel,
  onConfirm,
}: {
  isConfirming: boolean;
  isFinishing: boolean;
  disabled: boolean;
  onAsk: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!isConfirming) {
    return (
      <button
        type="button"
        onClick={onAsk}
        disabled={disabled}
        className="text-[13px] text-gray-500 underline-offset-2 hover:text-gray-700 hover:underline disabled:opacity-50"
      >
        그만두기
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-[13px]">
      <span className="text-gray-600">그만두면 코인을 받을 수 없어요.</span>
      <button
        type="button"
        onClick={onConfirm}
        disabled={isFinishing || disabled}
        className="font-semibold text-red-500 hover:text-red-600 disabled:opacity-50"
      >
        {isFinishing ? "종료 중…" : "그만두기"}
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={isFinishing}
        className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
      >
        계속하기
      </button>
    </div>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-background px-4 py-6 md:px-8">
      {children}
    </div>
  );
}

function NoticeCard({
  message,
  children,
}: {
  message: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="flex h-fit w-full max-w-[480px] flex-col items-center gap-4 rounded-[20px] border border-gray-300 bg-white p-6 text-center md:p-10">
      <p className="text-[16px] font-medium text-gray-800">{message}</p>
      {children}
      <Link
        href="/assessment"
        className="text-[14px] text-gray-500 underline-offset-2 hover:underline"
      >
        역량검사로 돌아가기
      </Link>
    </section>
  );
}

function ReadyCard({
  questionCount,
  resumeFrom,
  onStart,
}: {
  questionCount: number;
  // 새로고침 등으로 다시 들어왔을 때 이어서 풀 문항 번호
  resumeFrom: number | null;
  onStart: () => void;
}) {
  const steps = [
    "보드에 잠깐 나타나는 쥐의 위치를 기억하세요.",
    "쥐가 숨은 뒤 빨간 고양이와 파란 고양이가 나타나요.",
    "빨간 고양이, 파란 고양이 순서로 쥐를 잡았는지(O) 놓쳤는지(X) 고르고, 얼마나 확신하는지 선택하세요.",
    `고양이마다 ${CAT_CHASE_TIMING.answer / 1000}초 안에 답해야 해요. 시간이 지나면 오답으로 처리돼요.`,
    "두 고양이를 모두 맞혀야 그 문항을 맞힌 것으로 계산해요.",
  ];

  return (
    <section className="flex h-fit w-full max-w-[640px] flex-col gap-6 rounded-[20px] border border-gray-300 bg-white p-6 md:p-10">
      <div>
        <h1 className="text-[24px] font-semibold tracking-[-0.6px] text-gray-900 md:text-[28px]">
          고양이 술래잡기
        </h1>
        <p className="mt-1 text-[14px] text-gray-600">
          총 {questionCount}문항 · 작업 기억
          {resumeFrom && (
            <span className="ml-1 font-medium text-orange-800">
              · {resumeFrom}번 문항부터 이어서 풀어요
            </span>
          )}
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
          href="/assessment"
          className="flex h-12 items-center justify-center rounded-[12px] border border-gray-300 px-5 text-[16px] font-medium text-gray-700 transition-colors hover:bg-gray-100"
        >
          돌아가기
        </Link>
        <button
          type="button"
          onClick={onStart}
          className="h-12 flex-1 rounded-[12px] bg-yellow-600 text-[16px] font-semibold tracking-[-0.5px] text-white transition-colors hover:bg-yellow-700"
        >
          {resumeFrom ? "이어하기" : "시작하기"}
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
