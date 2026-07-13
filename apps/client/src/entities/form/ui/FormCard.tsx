"use client";

import { formatDeadlineDate, formatDeadlineTime } from "../lib/formatDeadline";
import { isDeadlinePassed } from "../lib/isDeadlinePassed";
import type { FormSummary } from "../model/types";

// 헤더 행과 데이터 행이 동일한 컬럼 폭을 공유하도록 그리드 정의를 한곳에서 관리한다.
// 컬럼: 제목 / 마감 날짜 / 마감 시간 / 제출 여부 / 제출자 / 작업
export const FORM_TABLE_GRID =
  "grid grid-cols-[1fr_130px_84px_96px_100px_88px] gap-4 items-center min-w-[740px]";

interface FormCardProps {
  form: FormSummary;
  /** 우리 팀에서 이 양식을 제출한 팀원 이름 (미제출이면 undefined) */
  submitterName?: string;
  onSubmit: (id: number) => void;
  onEdit: (id: number) => void;
}

export default function FormCard({
  form,
  submitterName,
  onSubmit,
  onEdit,
}: FormCardProps) {
  const { id, title, deadline, submitted } = form;
  const time = formatDeadlineTime(deadline);
  // 마감 후 이미 제출한 건은 수정 불가. (미제출은 마감 후에도 제출 가능 — 미준수로 판정)
  const editLocked = submitted && isDeadlinePassed(deadline);

  return (
    <div className={`${FORM_TABLE_GRID} border-b border-gray-100 bg-white px-4 py-4 transition-colors hover:bg-yellow-50`}>
      {/* 제목 */}
      <span className="min-w-0 truncate text-base font-medium sm:text-lg">
        {title}
      </span>

      {/* 마감 날짜 */}
      <span className="text-sm text-gray-700">{formatDeadlineDate(deadline)}</span>

      {/* 마감 시간 */}
      <span className="text-sm text-gray-700">{time || "—"}</span>

      {/* 제출 여부 */}
      <div className="flex justify-start">
        <span
          className={`inline-flex w-16 items-center justify-center rounded-lg border py-1 text-sm ${
            submitted
              ? "border-yellow-600 bg-yellow-50"
              : "border-gray-200 bg-gray-100 text-gray-500"
          }`}
        >
          {submitted ? "제출" : "미제출"}
        </span>
      </div>

      {/* 제출자 — 제출한 경우 팀원 이름, 미제출은 "—" */}
      <span className="min-w-0 truncate text-sm text-gray-700">
        {submitted ? (submitterName ?? "—") : "—"}
      </span>

      {/* 작업 (작성 / 수정 / 보기) — 미제출은 마감 후에도 제출 가능(미준수), 제출한 건은 마감 후 수정 불가(보기만) */}
      <div className="flex justify-start">
        <button
          type="button"
          onClick={() => (submitted ? onEdit(id) : onSubmit(id))}
          className={`inline-flex h-8 w-16 cursor-pointer items-center justify-center rounded-lg border text-sm font-medium transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-600/50 ${
            editLocked
              ? "border-gray-200 bg-gray-100 text-gray-500 hover:bg-gray-200"
              : submitted
                ? "border-orange-400 bg-orange-50 hover:bg-orange-100"
                : "border-yellow-600 bg-yellow-50 hover:bg-yellow-100"
          }`}
        >
          {editLocked ? "보기" : submitted ? "수정" : "작성"}
        </button>
      </div>
    </div>
  );
}
