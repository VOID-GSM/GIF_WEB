"use client";

import { useState, type ReactNode } from "react";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import {
  useRetrospectiveAiAssist,
  type RetrospectiveAiAction,
  type RetrospectiveAiResult,
  type RetrospectiveCategory,
} from "@/entities/retrospective";

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
  title: string;
  category: RetrospectiveCategory;
  content: string;
  onApply: (content: string) => void;
}

function getErrorMessage(error: unknown) {
  if (!isAxiosError(error)) return "AI 도움 요청에 실패했습니다. 잠시 후 다시 시도해 주세요.";

  switch (error.response?.status) {
    case 400: {
      const message = (error.response.data as { message?: unknown } | undefined)?.message;
      return typeof message === "string" && message.trim()
        ? message
        : "본문은 5,000자 이하여야 하며, 다듬기와 포트폴리오 변환은 20자 이상 입력해 주세요.";
    }
    case 429:
      return "오늘 사용할 수 있는 AI 도움 횟수(20회)를 모두 사용했습니다.";
    case 502:
      return "AI 응답에 실패했습니다. 잠시 후 다시 시도해 주세요.";
    case 503:
      return "AI 기능이 현재 설정되어 있지 않습니다.";
    default:
      return "AI 도움 요청에 실패했습니다. 잠시 후 다시 시도해 주세요.";
  }
}

export default function AiAssistPanel({
  compact = false,
  title,
  category,
  content,
  onApply,
}: AiAssistPanelProps) {
  const { mutate, isPending } = useRetrospectiveAiAssist();
  const [result, setResult] = useState<{
    action: RetrospectiveAiAction;
    data: RetrospectiveAiResult;
  } | null>(null);
  const trimmedContent = content.trim();

  const requestAssist = (action: RetrospectiveAiAction) => {
    if (content.length > 5000) {
      toast.error("본문은 5,000자 이하로 입력해 주세요.");
      return;
    }
    if ((action === "polish" || action === "portfolio") && trimmedContent.length < 20) {
      toast.error("이 기능을 사용하려면 본문을 20자 이상 입력해 주세요.");
      return;
    }

    mutate(
      {
        action,
        payload: {
          ...(title.trim() ? { title: title.trim().slice(0, 100) } : {}),
          category,
          content,
        },
      },
      {
        onSuccess: (data) => {
          if (!data.content?.trim()) {
            toast.error("AI가 결과를 만들지 못했습니다. 잠시 후 다시 시도해 주세요.");
            return;
          }
          setResult({ action, data });
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
    setResult(null);
  };

  const dismissResult = () => setResult(null);
  const applyResult = () => {
    if (!result) return;
    onApply(result.data.content);
    setResult(null);
    toast.success("AI 결과를 본문에 적용했습니다.");
  };

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
          <div className="mt-3 flex justify-end gap-2">
            <button type="button" onClick={dismissResult} className="rounded-[8px] border border-gray-200 px-3 py-2 text-[12px] font-medium text-gray-600 hover:bg-gray-50">취소</button>
            <button type="button" onClick={applyResult} className="rounded-[8px] bg-yellow-500 px-3 py-2 text-[12px] font-semibold text-gray-900 hover:bg-yellow-400">본문에 적용</button>
          </div>
        </section>
      )}
    </aside>
  );
}
