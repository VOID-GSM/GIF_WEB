interface AiSummaryProps {
  summary: string;
}

// AI 요약 배너 (admin·client 공용) — 요약 텍스트만 받아 표시하는 표현용 컴포넌트
export default function AiSummary({ summary }: AiSummaryProps) {
  return (
    <div className="flex items-center gap-7 border-l-4 border-yellow-400 bg-yellow-50 px-7 py-3">
      <span className="shrink-0 text-[20px] font-semibold tracking-[-0.5px] text-black">
        AI 요약
      </span>
      <p className="whitespace-pre-line text-[16px] font-medium leading-[1.4] tracking-[-0.4px] text-gray-700">
        {summary}
      </p>
    </div>
  );
}
