"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import type { CatChaseQuestion } from "@/entities/assessment";
import {
  CAT_CHASE_TIMING,
  useFinishCatChaseRound,
  useGetCatChaseSession,
  useRecoverCatChaseSession,
  useSubmitCatChaseJudgments,
  type CatChaseConfidence,
  type CatChaseJudgment,
  type CatChaseJudgmentItem,
  type CatChaseRoundResult,
  type CatChaseSession,
  type SubmitCatChaseJudgmentsResponse,
} from "@/entities/cat-chase";
import { CatChaseBoard, JudgmentCard, type BoardCell } from "@/widgets/cat-chase";

import CatChaseResult from "./CatChaseResult";

type Phase =
  | { name: "ready" }
  | { name: "mice" }
  | { name: "blank" }
  | { name: "target"; catIndex: number }
  | { name: "question"; catIndex: number }
  | { name: "submitting" }
  // 제출 응답을 못 받았고 서버에도 저장되지 않은 상태. 같은 판단을 다시 보낸다.
  | { name: "submit-error"; items: CatChaseJudgmentItem[] };

// 단계별 안내 문구 키 (catChase.game.guide.*)
const PHASE_GUIDE: Partial<Record<Phase["name"], string>> = {
  mice: "mice",
  blank: "blank",
  target: "target",
};

const parseRoundId = (raw: string | null) => {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
};

export default function CatChaseGameView() {
  const roundId = parseRoundId(useSearchParams().get("roundId"));
  const t = useTranslations("catChase.game");

  return (
    <PageShell>
      {roundId ? (
        // 다시 하기로 roundId 가 바뀌면 진행 상태를 처음부터 새로 잡는다.
        <CatChaseGame key={roundId} roundId={roundId} />
      ) : (
        <NoticeCard message={t("invalidRequest")} />
      )}
    </PageShell>
  );
}

function CatChaseGame({ roundId }: { roundId: number }) {
  const { data: session, isPending, isError } = useGetCatChaseSession(roundId);
  const [result, setResult] = useState<CatChaseRoundResult | null>(null);
  const t = useTranslations("catChase.game");

  if (isPending) {
    return (
      <div className="h-[420px] w-full max-w-[640px] animate-pulse rounded-[20px] bg-gray-100" />
    );
  }

  if (isError || !session) {
    return <NoticeCard message={t("loadError")} />;
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
  const t = useTranslations("catChase.game");

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

  // 문항에 나온 고양이를 서버가 준 순서대로 모두 판단한다.
  const targets = question.catPositions;

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
      if (latest.question && latest.question.questionId !== question.questionId) {
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

  const handleJudge = (
    judgment: CatChaseJudgment,
    confidence: CatChaseConfidence,
  ) => {
    if (phase.name !== "question") return;
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
    void submit(items);
  };

  const handleQuit = () => {
    finishRound(roundId, { onSuccess: onFinished });
  };

  // 쥐 → 빈 보드 → 고양이(판단할 고양이는 빨강, 판단을 마친 고양이는 파랑) 순서로 자동 진행한다.
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
        () => setPhase({ name: "target", catIndex: 0 }),
        CAT_CHASE_TIMING.blank,
      );
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
  }, [phase]);

  const cells = useMemo(() => {
    const map = new Map<number, BoardCell>();
    if (phase.name === "mice") {
      question.mousePositions.forEach((p) => map.set(p, { content: "mouse" }));
    }
    if (phase.name === "target") {
      const targetIndex = phase.catIndex;
      // 판단할 고양이는 빨강, 이미 판단한 고양이는 파랑, 아직 차례가 아닌 고양이는 노랑
      question.catPositions.forEach((p, i) => {
        map.set(p, {
          content:
            i === targetIndex ? "cat-red" : i < targetIndex ? "cat-blue" : "cat",
        });
      });
    }
    return map;
  }, [phase, question]);

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
      <NoticeCard message={t("submitError")}>
        <button
          type="button"
          onClick={() => void submit(items)}
          className="h-12 w-full rounded-[12px] bg-yellow-600 text-[16px] font-semibold tracking-[-0.5px] text-white transition-colors hover:bg-yellow-700"
        >
          {t("resubmit")}
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
          {t.rich("progress", {
            current: question.sequence,
            total: questionCount,
            b: (chunks) => (
              <span className="font-semibold text-gray-900">{chunks}</span>
            ),
          })}
          {showQuestion && catCount > 1 && (
            <span className="ml-2 text-gray-500">
              · {t("catProgress", { current: questionCatIndex + 1, total: catCount })}
            </span>
          )}
        </p>
        <div className="flex items-center gap-3">
          <p
            aria-live="polite"
            className="text-[15px] font-medium tracking-[-0.4px] text-gray-600"
          >
            {PHASE_GUIDE[phase.name] ? t(`guide.${PHASE_GUIDE[phase.name]}`) : ""}
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
          key={`${question.questionId}-${questionCatIndex}`}
          isLast={questionCatIndex + 1 >= catCount}
          disabled={phase.name === "submitting"}
          onSubmit={handleJudge}
        />
      ) : (
        <CatChaseBoard
          gridSize={boardSide}
          cells={cells}
          fitViewport
          key={phase.name === "target" ? `target-${phase.catIndex}` : phase.name}
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
  const t = useTranslations("catChase.game");
  if (!isConfirming) {
    return (
      <button
        type="button"
        onClick={onAsk}
        disabled={disabled}
        className="text-[13px] text-gray-500 underline-offset-2 hover:text-gray-700 hover:underline disabled:opacity-50"
      >
        {t("quit")}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-[13px]">
      <span className="text-gray-600">{t("quitWarning")}</span>
      <button
        type="button"
        onClick={onConfirm}
        disabled={isFinishing || disabled}
        className="font-semibold text-red-500 hover:text-red-600 disabled:opacity-50"
      >
        {isFinishing ? t("finishing") : t("quit")}
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={isFinishing}
        className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
      >
        {t("continue")}
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
  const t = useTranslations("catChase.game");
  return (
    <section className="flex h-fit w-full max-w-[480px] flex-col items-center gap-4 rounded-[20px] border border-gray-300 bg-white p-6 text-center md:p-10">
      <p className="text-[16px] font-medium text-gray-800">{message}</p>
      {children}
      <Link
        href="/assessment"
        className="text-[14px] text-gray-500 underline-offset-2 hover:underline"
      >
        {t("backToAssessment")}
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
  const t = useTranslations("catChase.game");
  const steps = [1, 2, 3, 4].map((step) => t(`steps.${step}`));

  return (
    <section className="flex h-fit w-full max-w-[640px] flex-col gap-6 rounded-[20px] border border-gray-300 bg-white p-6 md:p-10">
      <div>
        <h1 className="text-[24px] font-semibold tracking-[-0.6px] text-gray-900 md:text-[28px]">
          {t("title")}
        </h1>
        <p className="mt-1 text-[14px] text-gray-600">
          {t("summary", { count: questionCount })}
          {resumeFrom && (
            <span className="ml-1 font-medium text-orange-800">
              · {t("resumeFrom", { sequence: resumeFrom })}
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
          {t("back")}
        </Link>
        <button
          type="button"
          onClick={onStart}
          className="h-12 flex-1 rounded-[12px] bg-yellow-600 text-[16px] font-semibold tracking-[-0.5px] text-white transition-colors hover:bg-yellow-700"
        >
          {resumeFrom ? t("resume") : t("start")}
        </button>
      </div>
      <Link
        href="/assessment/cat-chase/records"
        className="self-center text-[14px] text-gray-500 underline-offset-2 hover:underline"
      >
        {t("myRecords")}
      </Link>
    </section>
  );
}
