"use client";

import type { ReactNode } from "react";

import type { RetrospectiveAiAction } from "@/entities/retrospective";

import type { AiAssistState } from "../model/useAiAssist";

function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StructureIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <path d="M17.5 10v2.5a1 1 0 0 1-1 1H7.5a1 1 0 0 0-1 1V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PortfolioIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 9h8M8 13h8M8 17h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <path d="M13 2c.6 3.8 1.7 6.2 3.5 8s4.2 2.9 8 3.5c-3.8.6-6.2 1.7-8 3.5s-2.9 4.2-3.5 8c-.6-3.8-1.7-6.2-3.5-8S5.3 14.1 1.5 13.5c3.8-.6 6.2-1.7 8-3.5S12.4 5.8 13 2Z" fill="currentColor" />
      <path d="M21.5 1c.3 1.6.7 2.6 1.5 3.4s1.8 1.2 3.4 1.5c-1.6.3-2.6.7-3.4 1.5s-1.2 1.8-1.5 3.4c-.3-1.6-.7-2.6-1.5-3.4S18.2 6.2 16.6 5.9c1.6-.3 2.6-.7 3.4-1.5S20.9 2.6 21.2 1Z" fill="currentColor" />
    </svg>
  );
}

const AI_ACTIONS: {
  key: RetrospectiveAiAction;
  label: string;
  icon: ReactNode;
}[] = [
  { key: "polish", label: "내용 다듬기", icon: <PencilIcon /> },
  { key: "structure", label: "구조 추천", icon: <StructureIcon /> },
  { key: "portfolio", label: "포트폴리오로 변환", icon: <PortfolioIcon /> },
];

interface AiAssistPanelProps {
  compact?: boolean;
  content: string;
  /** 작성 화면에서 한 번만 만든 AI 도움 상태 (보기 모드가 바뀌어도 유지) */
  assist: AiAssistState;
}

export default function AiAssistPanel({
  compact = false,
  content,
  assist,
}: AiAssistPanelProps) {
  const {
    isPending,
    result,
    isContentChangedSinceRequest,
    requestAssist,
    dismissResult,
    applyResult,
  } = assist;
  const trimmedContent = content.trim();

  return (
    <aside
      aria-busy={isPending}
      className={`flex gap-3 rounded-[16px] border border-yellow-300 bg-gradient-to-b from-yellow-50 to-white p-4 shadow-[0_0_0_1px_rgba(237,201,38,0.15)] dark:border-yellow-800 dark:from-yellow-950/40 dark:to-transparent dark:shadow-[0_0_0_1px_rgba(237,201,38,0.08)] ${
        compact ? "flex-col sm:flex-row sm:flex-wrap sm:items-center" : "flex-col"
      }`}
    >
      <div className={compact ? "sm:mr-1 sm:shrink-0" : ""}>
        <div className="flex items-center gap-2">
          <span className="animate-sparkle inline-block text-yellow-500"><SparkleIcon /></span>
          <h2 className="text-[15px] font-bold text-gray-900">AI 도움받기</h2>
        </div>
        {!compact && (
          <p className="mt-2 text-[12px] leading-relaxed font-medium text-gray-600">
            AI가 작성한 초안을 확인하고
            <br />
            원하는 경우 본문에 적용할 수 있어요.
          </p>
        )}
      </div>

      <div className={compact ? "flex flex-1 flex-wrap gap-1.5" : "mt-1 flex flex-col gap-2"}>
        {AI_ACTIONS.map((action) => {
          const disabled = isPending ||
            ((action.key === "polish" || action.key === "portfolio") && trimmedContent.length < 20);
          return (
            <button
              key={action.key}
              type="button"
              onClick={() => requestAssist(action.key)}
              disabled={disabled}
              className={`flex items-center gap-2 rounded-[10px] border border-gray-200 bg-white font-medium text-gray-800 shadow-sm transition-all duration-150 hover:border-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600 disabled:cursor-not-allowed disabled:opacity-50 ${compact ? "px-3 py-1.5 text-[13px]" : "px-3.5 py-3 text-[13px]"}`}
            >
              <span className="text-gray-500">{action.icon}</span>
              {isPending ? "생성 중…" : action.label}
            </button>
          );
        })}
      </div>

      {content.length > 5000 && (
        <p className="text-[12px] text-red-600" role="alert">본문이 5,000자를 넘었습니다. 분량을 줄여 주세요.</p>
      )}
      {isPending && <p className="text-[12px] text-gray-500" role="status">AI가 결과를 만들고 있습니다…</p>}

      {result && (
        <section className="w-full rounded-[12px] border border-yellow-200 bg-white p-3 sm:basis-full" aria-label="AI 결과 미리보기">
          <h3 className="text-[13px] font-semibold text-gray-800">
            {AI_ACTIONS.find((action) => action.key === result.action)?.label} 결과 미리보기
          </h3>
          {result.data.sections && result.data.sections.length > 0 && (
            <div className="mt-2">
              <p className="text-[11px] font-semibold text-gray-500">추천 목차</p>
              <ol className="mt-1 list-inside list-decimal space-y-0.5 text-[12px] text-gray-700">
                {result.data.sections.map((section, index) => <li key={`${section}-${index}`}>{section}</li>)}
              </ol>
            </div>
          )}
          <pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-[8px] bg-gray-50 p-3 font-sans text-[12px] leading-relaxed text-gray-700">
            {result.data.content}
          </pre>
          {isContentChangedSinceRequest && (
            <p className="mt-2 text-[12px] text-red-600" role="alert">
              요청 후 본문이 수정되었습니다. 적용하면 그 뒤에 쓴 내용이 이 결과로 바뀝니다.
            </p>
          )}
          <div className="mt-3 flex justify-end gap-2">
            <button type="button" onClick={dismissResult} className="rounded-[8px] border border-gray-200 px-3 py-2 text-[12px] font-medium text-gray-600 hover:bg-gray-50">취소</button>
            <button type="button" onClick={applyResult} className="rounded-[8px] bg-yellow-500 px-3 py-2 text-[12px] font-semibold text-gray-900 hover:bg-yellow-400">
              {isContentChangedSinceRequest ? "그래도 적용" : "본문에 적용"}
            </button>
          </div>
        </section>
      )}
    </aside>
  );
}
