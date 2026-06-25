"use client";

import { Close } from "@repo/ui";

import { formatDeadline } from "../lib/formatDeadline";
import type { FormSummary } from "../model/types";

interface FormCardProps {
  form: FormSummary;
  onAnnounce: (id: number) => void;
  onEdit: (id: number) => void;
  // 삭제 권한이 있을 때만 전달 — 없으면 삭제 버튼을 렌더하지 않는다.
  onDelete?: (id: number) => void;
  onView?: (id: number) => void;
}

export default function FormCard({
  form,
  onAnnounce,
  onEdit,
  onDelete,
  onView,
}: FormCardProps) {
  const { id, title, deadline, announced } = form;

  return (
    <div
      className={`flex h-20 w-full shrink-0 items-center rounded-xl bg-white pr-4 pl-4 shadow transition-shadow duration-200 hover:shadow-md sm:pr-6 ${announced ? "cursor-pointer" : ""}`}
      onClick={announced ? () => onView?.(id) : undefined}
    >
      {announced ? (
        <span className="flex h-8 w-[88px] shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-100 font-medium">
          공지 함
        </span>
      ) : (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onAnnounce(id); }}
          className="flex h-8 w-[88px] shrink-0 cursor-pointer items-center justify-center rounded-xl border border-yellow-600 bg-yellow-50 font-medium transition-all duration-150 hover:bg-yellow-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-600/50"
        >
          공지하기
        </button>
      )}

      <span className="ml-4 min-w-0 flex-1 truncate text-base font-medium sm:text-xl">
        {title}
      </span>

      <span className="ml-4 hidden shrink-0 text-base font-medium sm:inline sm:text-xl">
        {formatDeadline(deadline)}
      </span>

      {announced ? (
        <div className="ml-4 h-8 w-20 shrink-0 sm:ml-[68px]" aria-hidden />
      ) : (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onEdit(id); }}
          className="ml-4 flex h-8 w-20 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-yellow-600 bg-yellow-50 transition-all duration-150 hover:bg-yellow-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-600/50 sm:ml-[68px]"
        >
          수정
        </button>
      )}

      {onDelete && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(id); }}
          aria-label="양식 삭제"
          className="ml-3 flex shrink-0 cursor-pointer items-center justify-center rounded-lg p-1 text-gray-700 transition-all duration-150 hover:scale-110 hover:text-black active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 sm:ml-5"
        >
          <Close width={20} height={20} />
        </button>
      )}
    </div>
  );
}
