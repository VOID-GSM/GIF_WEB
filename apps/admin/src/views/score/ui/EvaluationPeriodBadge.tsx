"use client";

import { useEffect, useRef, useState } from "react";
import {
  formatIsoKoreanDateTime,
  type EvaluationPeriodPayload,
} from "./evaluationPeriod";

interface Props {
  period: EvaluationPeriodPayload;
}

// 평가 기간이 설정된 뒤 필터 바에 남는 조회 전용 배지 — 클릭하면 설정된 날짜·시간만 보여준다.
export default function EvaluationPeriodBadge({ period }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 py-[6.5px] px-[10px] rounded-[8px] text-[12px] font-medium border border-yellow-600 text-yellow-700 bg-yellow-50 cursor-pointer"
      >
        평가 기간
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] left-0 z-20 w-max rounded-[8px] border border-gray-200 bg-white px-3 py-2 shadow-new">
          <p className="text-[10px] text-gray-400">보고서 영역 평가 시작: </p>
          <p className="whitespace-nowrap text-[13px] font-medium text-gray-800">
            {formatIsoKoreanDateTime(period.startDate)}
          </p>
          <p className="whitespace-nowrap pt-2 text-[13px] font-medium text-gray-800">
            그외의 평가 항목은 아이디어페스티벌 시작 날짜부터 평가가 가능하며,
            모든 평가는 아이디어페스트벌 종료일에 마감됩니다.
          </p>
        </div>
      )}
    </div>
  );
}
