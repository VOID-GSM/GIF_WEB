"use client";

import { useGetAiSummary } from "@/entities/retrospective";

function SparkleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 26 26" fill="none">
      <path
        d="M13 2c.6 3.8 1.7 6.2 3.5 8s4.2 2.9 8 3.5c-3.8.6-6.2 1.7-8 3.5s-2.9 4.2-3.5 8c-.6-3.8-1.7-6.2-3.5-8S5.3 14.1 1.5 13.5c3.8-.6 6.2-1.7 8-3.5S12.4 5.8 13 2Z"
        fill="currentColor"
      />
      <path
        d="M21.5 1c.3 1.6.7 2.6 1.5 3.4s1.8 1.2 3.4 1.5c-1.6.3-2.6.7-3.4 1.5s-1.2 1.8-1.5 3.4c-.3-1.6-.7-2.6-1.5-3.4S18.2 6.2 16.6 5.9c1.6-.3 2.6-.7 3.4-1.5S20.9 2.6 21.2 1Z"
        fill="currentColor"
      />
    </svg>
  );
}

interface AiSummaryCardProps {
  content: string;
}

export default function AiSummaryCard({ content }: AiSummaryCardProps) {
  const { data: bullets, isLoading } = useGetAiSummary(content);

  if (!isLoading && bullets.length === 0) return null;

  return (
    <section
      aria-label="AI 요약"
      className="flex flex-col gap-2 rounded-[12px] border border-gray-200 bg-white p-4"
    >
      <div className="flex items-center gap-1.5 text-yellow-600">
        <SparkleIcon />
        <h2 className="text-[12px] font-semibold tracking-[-0.1px] text-gray-500">
          AI 요약
        </h2>
      </div>

      {isLoading ? (
        <p className="text-[12px] text-gray-400" aria-live="polite">
          내용을 요약하는 중...
        </p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex gap-1.5 text-[13px] leading-relaxed text-gray-700"
            >
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-300" />
              {bullet}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
