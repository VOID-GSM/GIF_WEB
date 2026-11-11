"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import {
  CONFIDENCE_VALUES,
  type CatChaseAnswer,
  type CatChaseConfidence,
  type CatColor,
} from "@/entities/cat-chase";

const ASSET = "/assessment/cat-chase";

const ANSWERS: { value: CatChaseAnswer; image: string }[] = [
  { value: "FOUND", image: `${ASSET}/answer-found.svg` },
  { value: "MISSED", image: `${ASSET}/answer-missed.svg` },
];

const CAT_IMAGE: Record<CatColor, string> = {
  red: `${ASSET}/question-cat-red.svg`,
  blue: `${ASSET}/question-cat-blue.svg`,
};

// 남은 초 표시를 갱신하는 간격(ms). 막대는 CSS 애니메이션으로 줄어든다.
const TICK_MS = 250;

interface JudgmentCardProps {
  cat: CatColor;
  // 응답 제한 시간(ms). 카드가 나타난 순간부터 잰다.
  timeLimitMs: number;
  onSubmit: (judgment: CatChaseAnswer, confidence: CatChaseConfidence) => void;
  // 제한 시간 안에 제출하지 않으면 한 번 호출된다.
  onTimeout: () => void;
  isLast: boolean;
  disabled?: boolean;
}

export default function JudgmentCard({
  cat,
  timeLimitMs,
  onSubmit,
  onTimeout,
  isLast,
  disabled,
}: JudgmentCardProps) {
  const t = useTranslations("catChase.judgment");
  const tc = useTranslations("catChase.confidence");
  const tColor = useTranslations("catChase.catColor");
  const [judgment, setJudgment] = useState<CatChaseAnswer | null>(null);
  const [confidence, setConfidence] = useState<CatChaseConfidence | null>(
    null,
  );
  const [isTimeUp, setIsTimeUp] = useState(false);
  // 제출이나 시간 초과 중 먼저 일어난 쪽만 처리한다.
  const settledRef = useRef(false);
  const deadlineRef = useRef(0);
  const onTimeoutRef = useRef(onTimeout);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  });

  const settleTimeout = () => {
    setIsTimeUp(true);
    if (settledRef.current) return;
    settledRef.current = true;
    onTimeoutRef.current();
  };

  useEffect(() => {
    deadlineRef.current = Date.now() + timeLimitMs;
    const timer = setTimeout(settleTimeout, timeLimitMs);
    return () => clearTimeout(timer);
  }, [timeLimitMs]);

  const canSubmit = !!judgment && !!confidence && !disabled && !isTimeUp;
  const catLabel = tColor(cat);

  const handleSubmit = () => {
    if (!judgment || !confidence || settledRef.current) return;
    // 탭이 가려져 타이머가 늦게 돌아도, 제한 시간이 지났으면 시간 초과로 처리한다.
    if (Date.now() >= deadlineRef.current) return settleTimeout();
    settledRef.current = true;
    onSubmit(judgment, confidence);
  };

  return (
    <section className="animate-pop-in flex w-full max-w-[800px] flex-col items-center rounded-[20px] border border-gray-300 bg-white px-5 py-[clamp(16px,3dvh,32px)] md:px-10">
      <AnswerTimer timeLimitMs={timeLimitMs} paused={!!disabled} />

      <h2 className="mt-[2dvh] text-center text-[clamp(20px,3.2dvh,34px)] font-medium leading-none tracking-[-0.03em] text-black">
        {t("question", { cat: catLabel })}
      </h2>

      <Image
        src={CAT_IMAGE[cat]}
        alt={catLabel}
        width={240}
        height={240}
        className="mt-[2.5dvh] h-auto w-[clamp(88px,17dvh,200px)]"
      />

      <div
        role="radiogroup"
        aria-label={t("judgment")}
        className="mt-[3dvh] flex gap-[clamp(24px,5vw,64px)]"
      >
        {ANSWERS.map((answer) => {
          const selected = judgment === answer.value;
          return (
            <button
              key={answer.value}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={isTimeUp}
              onClick={() => setJudgment(answer.value)}
              className="group flex flex-col items-center gap-[1.5dvh] disabled:cursor-not-allowed"
            >
              <Image
                src={answer.image}
                alt=""
                width={240}
                height={240}
                className={`h-auto w-[clamp(88px,17dvh,200px)] rounded-[16.67%] transition-all duration-200 ${
                  selected
                    ? "scale-[1.03] ring-4 ring-yellow-600"
                    : judgment
                      ? "opacity-50 group-hover:opacity-80"
                      : "group-hover:-translate-y-1 group-hover:shadow"
                }`}
              />
              <span className="text-[clamp(18px,2.8dvh,30px)] font-medium leading-none tracking-[-0.03em] text-black">
                {t(`answer.${answer.value}`)}
              </span>
            </button>
          );
        })}
      </div>

      <div
        className={`grid w-full transition-all duration-300 ${
          judgment
            ? "mt-[3dvh] grid-rows-[1fr] opacity-100"
            : "mt-0 grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-center text-[15px] font-medium tracking-[-0.4px] text-gray-800 md:text-[16px]">
            {t("confidenceQuestion")}
          </p>
          <div
            role="radiogroup"
            aria-label={t("confidence")}
            className="mx-auto mt-3 grid max-w-[560px] grid-cols-2 gap-2 sm:grid-cols-4"
          >
            {CONFIDENCE_VALUES.map((value) => {
              const selected = confidence === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  tabIndex={judgment ? 0 : -1}
                  disabled={isTimeUp}
                  onClick={() => setConfidence(value)}
                  className={`h-10 rounded-[10px] border text-[15px] font-medium tracking-[-0.4px] transition-colors disabled:cursor-not-allowed ${
                    selected
                      ? "border-yellow-600 bg-yellow-100 font-semibold text-gray-900"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {tc(value)}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={!canSubmit}
            tabIndex={judgment ? 0 : -1}
            onClick={handleSubmit}
            className="mx-auto mt-[2dvh] block h-11 w-full max-w-[560px] rounded-[12px] bg-yellow-600 text-[16px] font-semibold tracking-[-0.5px] text-white transition-colors hover:bg-yellow-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {isLast ? t("submit") : t("nextCat")}
          </button>
        </div>
      </div>
    </section>
  );
}

// 남은 시간을 막대와 초로 보여준다. 3초 이하로 남으면 빨갛게 바꿔 알린다.
// 제출 중(paused)에는 시간 초과로 오해하지 않도록 그 자리에서 멈춘다.
function AnswerTimer({
  timeLimitMs,
  paused,
}: {
  timeLimitMs: number;
  paused: boolean;
}) {
  const t = useTranslations("catChase.judgment");
  const [seconds, setSeconds] = useState(Math.ceil(timeLimitMs / 1000));
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    startedAtRef.current ??= Date.now();
    if (paused) return;
    const startedAt = startedAtRef.current;
    const timer = setInterval(() => {
      const left = Math.max(0, timeLimitMs - (Date.now() - startedAt));
      setSeconds(Math.ceil(left / 1000));
      if (left <= 0) clearInterval(timer);
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [timeLimitMs, paused]);

  const isUrgent = seconds <= 3;

  return (
    <div className="flex w-full max-w-[560px] items-center gap-3">
      <div
        role="progressbar"
        aria-label={t("timeLeft")}
        aria-valuemin={0}
        aria-valuemax={Math.ceil(timeLimitMs / 1000)}
        aria-valuenow={seconds}
        className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200"
      >
        <div
          className={`animate-timer-shrink h-full rounded-full ${
            isUrgent ? "bg-red" : "bg-yellow-600"
          }`}
          style={{
            animationDuration: `${timeLimitMs}ms`,
            animationPlayState: paused ? "paused" : "running",
          }}
        />
      </div>
      <span
        className={`w-10 text-right text-[15px] font-semibold tabular-nums ${
          isUrgent ? "text-red" : "text-gray-700"
        }`}
      >
        {t("seconds", { seconds })}
      </span>
    </div>
  );
}
