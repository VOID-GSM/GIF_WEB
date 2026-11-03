"use client";

import { useState } from "react";
import Image from "next/image";

import {
  CONFIDENCE_OPTIONS,
  type CatChaseConfidence,
  type CatChaseJudgment,
} from "@/entities/cat-chase";

const ASSET = "/assessment/cat-chase";

const ANSWERS: { value: CatChaseJudgment; label: string; image: string }[] = [
  { value: "FOUND", label: "잡다", image: `${ASSET}/answer-found.svg` },
  { value: "MISSED", label: "놓치다", image: `${ASSET}/answer-missed.svg` },
];

interface JudgmentCardProps {
  onSubmit: (judgment: CatChaseJudgment, confidence: CatChaseConfidence) => void;
  isLast: boolean;
  disabled?: boolean;
}

export default function JudgmentCard({
  onSubmit,
  isLast,
  disabled,
}: JudgmentCardProps) {
  const [judgment, setJudgment] = useState<CatChaseJudgment | null>(null);
  const [confidence, setConfidence] = useState<CatChaseConfidence | null>(
    null,
  );

  const canSubmit = !!judgment && !!confidence && !disabled;

  return (
    <section className="animate-pop-in flex w-full max-w-[800px] flex-col items-center rounded-[20px] border border-gray-300 bg-white px-5 py-[clamp(16px,3dvh,32px)] md:px-10">
      <h2 className="text-center text-[clamp(20px,3.2dvh,34px)] font-medium leading-none tracking-[-0.03em] text-black">
        빨간 고양이는 쥐를 잡았을까요?
      </h2>

      <Image
        src={`${ASSET}/question-cat-red.svg`}
        alt="빨간 고양이"
        width={240}
        height={240}
        className="mt-[2.5dvh] h-auto w-[clamp(88px,17dvh,200px)]"
      />

      <div
        role="radiogroup"
        aria-label="판단"
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
              onClick={() => setJudgment(answer.value)}
              className="group flex flex-col items-center gap-[1.5dvh]"
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
                {answer.label}
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
            얼마나 확신하나요?
          </p>
          <div
            role="radiogroup"
            aria-label="확신도"
            className="mx-auto mt-3 grid max-w-[560px] grid-cols-2 gap-2 sm:grid-cols-4"
          >
            {CONFIDENCE_OPTIONS.map((option) => {
              const selected = confidence === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  tabIndex={judgment ? 0 : -1}
                  onClick={() => setConfidence(option.value)}
                  className={`h-10 rounded-[10px] border text-[15px] font-medium tracking-[-0.4px] transition-colors ${
                    selected
                      ? "border-yellow-600 bg-yellow-100 font-semibold text-gray-900"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={!canSubmit}
            tabIndex={judgment ? 0 : -1}
            onClick={() => judgment && confidence && onSubmit(judgment, confidence)}
            className="mx-auto mt-[2dvh] block h-11 w-full max-w-[560px] rounded-[12px] bg-yellow-600 text-[16px] font-semibold tracking-[-0.5px] text-white transition-colors hover:bg-yellow-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {isLast ? "제출하기" : "다음 고양이"}
          </button>
        </div>
      </div>
    </section>
  );
}
