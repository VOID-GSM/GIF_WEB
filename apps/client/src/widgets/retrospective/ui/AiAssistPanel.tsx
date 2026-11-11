"use client";

import { useEffect, type ReactNode } from "react";
import { useTranslations } from "next-intl";

import {
  AI_ASSIST_MAX_CONTENT_LENGTH,
  AI_ASSIST_MIN_CONTENT_LENGTH,
  isAiContentTooShort,
  type RetrospectiveAiAction,
} from "@/entities/retrospective";

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

const AI_ACTIONS: { key: RetrospectiveAiAction; icon: ReactNode }[] = [
  { key: "polish", icon: <PencilIcon /> },
  { key: "structure", icon: <StructureIcon /> },
  { key: "portfolio", icon: <PortfolioIcon /> },
];

interface AiAssistPanelProps {
  /** 좁고 긴 세로 카드 대신, 넓은 폭에서 버튼을 가로로 나열한다 (같이 보기 모드용) */
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
  const t = useTranslations("retrospective.ai");
  const {
    isPending,
    result,
    isContentChangedSinceRequest,
    requestAssist,
    dismissResult,
    applyResult,
  } = assist;
  const isContentTooLong = content.length > AI_ASSIST_MAX_CONTENT_LENGTH;
  // 다듬기·포트폴리오 변환이 막혀 있는 이유를 버튼 아래에 알려 준다
  const hasShortContentAction = AI_ACTIONS.some((action) =>
    isAiContentTooShort(action.key, content),
  );

  return (
    <aside
      aria-busy={isPending}
      className={`flex gap-3 rounded-[16px] border border-yellow-300 bg-gradient-to-b from-yellow-50 to-white p-4 shadow-[0_0_0_1px_rgba(237,201,38,0.15)] dark:border-yellow-800 dark:from-yellow-950/40 dark:to-transparent dark:shadow-[0_0_0_1px_rgba(237,201,38,0.08)] ${
        compact ? "flex-col sm:flex-row sm:flex-wrap sm:items-center" : "flex-col"
      }`}
    >
      <div className={compact ? "sm:mr-1 sm:shrink-0" : ""}>
        <div className="flex items-center gap-2">
          <span className="animate-sparkle inline-block text-yellow-500">
            <SparkleIcon />
          </span>
          <h2 className="text-[15px] font-bold text-gray-900">
            {t("title")}
          </h2>
        </div>
        {!compact && (
          <p className="mt-2 text-[12px] leading-relaxed font-medium text-gray-600">
            {t.rich("description", { br: () => <br /> })}
          </p>
        )}
      </div>

      <div
        className={
          compact
            ? "flex flex-1 flex-wrap gap-1.5"
            : "mt-1 flex flex-col gap-2"
        }
      >
        {AI_ACTIONS.map((action) => {
          const disabled = isPending || isAiContentTooShort(action.key, content);
          return (
            <button
              key={action.key}
              type="button"
              onClick={() => requestAssist(action.key)}
              disabled={disabled}
              className={`flex cursor-pointer items-center gap-2 rounded-[10px] border border-gray-200 bg-white font-medium text-gray-800 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 hover:shadow active:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ${
                compact ? "px-3 py-1.5 text-[13px]" : "px-3.5 py-3 text-[13px]"
              }`}
            >
              <span className="text-gray-500">{action.icon}</span>
              {isPending ? t("generating") : t(`actions.${action.key}`)}
            </button>
          );
        })}
      </div>

      {hasShortContentAction && !isPending && (
        <p className="text-[12px] text-gray-500">
          {t("minContentHint", { min: AI_ASSIST_MIN_CONTENT_LENGTH })}
        </p>
      )}
      {isContentTooLong && (
        <p className="text-[12px] text-red-600" role="alert">
          {t("tooLong", { max: AI_ASSIST_MAX_CONTENT_LENGTH })}
        </p>
      )}
      {isPending && (
        <p className="text-[12px] text-gray-500" role="status">
          {t("pending")}
        </p>
      )}

      {result && (
        <AiResultModal
          title={t("result.title", { action: t(`actions.${result.action}`) })}
          sections={result.data.sections}
          content={result.data.content}
          isContentChanged={isContentChangedSinceRequest}
          onClose={dismissResult}
          onApply={applyResult}
        />
      )}
    </aside>
  );
}

interface AiResultModalProps {
  title: string;
  sections?: string[];
  content: string;
  isContentChanged: boolean;
  onClose: () => void;
  onApply: () => void;
}

// 사이드 패널은 폭이 좁아 결과를 읽기 어려우므로 넓은 모달로 보여 준다
function AiResultModal({
  title,
  sections,
  content,
  isContentChanged,
  onClose,
  onApply,
}: AiResultModalProps) {
  const t = useTranslations("retrospective.ai.result");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-result-title"
        onClick={(e) => e.stopPropagation()}
        className="animate-modal-in flex max-h-[85dvh] w-full max-w-[760px] flex-col rounded-[16px] bg-white p-6"
      >
        <h3 id="ai-result-title" className="text-[18px] font-bold text-gray-900">
          {title}
        </h3>

        <div className="thin-scrollbar mt-4 flex-1 overflow-y-auto">
          {sections && sections.length > 0 && (
            <div className="mb-4">
              <p className="text-[13px] font-semibold text-gray-600">{t("sections")}</p>
              <ol className="mt-2 list-inside list-decimal space-y-1 text-[15px] text-gray-800">
                {sections.map((section, index) => <li key={`${section}-${index}`}>{section}</li>)}
              </ol>
            </div>
          )}
          <pre className="whitespace-pre-wrap break-words rounded-[10px] border border-gray-200 bg-gray-100 p-5 font-sans text-[15px] leading-[1.8] text-gray-900">
            {content}
          </pre>
        </div>

        {isContentChanged && (
          <p className="mt-3 text-[13px] text-red-600" role="alert">
            {t("contentChanged")}
          </p>
        )}
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-[10px] border border-gray-200 px-4 py-2.5 text-[14px] font-medium text-gray-700 hover:bg-gray-100">
            {t("cancel")}
          </button>
          <button type="button" onClick={onApply} className="rounded-[10px] bg-yellow-500 px-4 py-2.5 text-[14px] font-semibold text-gray-900 hover:bg-yellow-400">
            {isContentChanged ? t("applyAnyway") : t("apply")}
          </button>
        </div>
      </section>
    </div>
  );
}
