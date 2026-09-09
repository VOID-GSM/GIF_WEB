"use client";

import { toast } from "sonner";

function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StructureIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M17.5 10v2.5a1 1 0 0 1-1 1H7.5a1 1 0 0 0-1 1V17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PortfolioIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M8 9h8M8 13h8M8 17h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
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

const AI_ACTIONS = [
  { key: "polish", label: "내용 다듬기", icon: <PencilIcon /> },
  { key: "structure", label: "구조 추천", icon: <StructureIcon /> },
  { key: "portfolio", label: "포트폴리오로 변환", icon: <PortfolioIcon /> },
];

interface AiAssistPanelProps {
  /** 좁고 긴 세로 카드 대신, 넓은 폭에서 버튼을 가로로 나열한다 (같이 보기 모드용) */
  compact?: boolean;
}

export default function AiAssistPanel({ compact = false }: AiAssistPanelProps) {
  // TODO(backend): AI 지원 API가 생기면 각 버튼을 실제 요청으로 교체한다.
  const handleClick = () => toast.info("추후 지원 예정 기능입니다.");

  return (
    <aside
      className={`flex gap-3 rounded-[16px] border border-yellow-300 bg-gradient-to-b from-yellow-50 to-white p-4 shadow-[0_0_0_1px_rgba(237,201,38,0.15)] dark:border-yellow-800 dark:from-yellow-950/40 dark:to-transparent dark:shadow-[0_0_0_1px_rgba(237,201,38,0.08)] ${
        compact ? "flex-col sm:flex-row sm:items-center" : "flex-col"
      }`}
    >
      <div className={compact ? "sm:mr-1 sm:shrink-0" : ""}>
        <div className="flex items-center gap-2">
          <span className="animate-sparkle inline-block text-yellow-500">
            <SparkleIcon />
          </span>
          <h2 className="text-[15px] font-bold text-gray-900">
            AI 도움받기
          </h2>
        </div>
        {!compact && (
          <p className="mt-2 text-[12px] leading-relaxed font-medium text-gray-600">
            AI가 글을 더 정리하고
            <br />
            포트폴리오 작성에 도움을 드려요.
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
        {AI_ACTIONS.map((action) => (
          <button
            key={action.key}
            type="button"
            onClick={handleClick}
            className={`flex cursor-pointer items-center gap-2 rounded-[10px] border border-gray-200 bg-white font-medium text-gray-800 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 hover:shadow active:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600 ${
              compact ? "px-3 py-1.5 text-[13px]" : "px-3.5 py-3 text-[13px]"
            }`}
          >
            <span className="text-gray-500">{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>
    </aside>
  );
}
