"use client";

import { Close } from "@repo/ui";

import { formatDeadline } from "../lib/formatDeadline";
import type { FormSummary } from "../model/types";

interface FormCardProps {
  form: FormSummary;
  onAnnounce: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function FormCard({
  form,
  onAnnounce,
  onEdit,
  onDelete,
}: FormCardProps) {
  const { id, title, deadline, announced } = form;

  return (
    <div className="flex h-20 w-[800px] shrink-0 items-center rounded-xl bg-white pr-6 pl-4 shadow">
      {announced ? (
        <span className="flex h-8 w-[88px] shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-100 font-medium">
          공지 함
        </span>
      ) : (
        <button
          type="button"
          onClick={() => onAnnounce(id)}
          className="flex h-8 w-[88px] shrink-0 items-center justify-center rounded-xl border border-yellow-600 bg-yellow-50 font-medium"
        >
          공지하기
        </button>
      )}

      <span className="ml-4 min-w-0 flex-1 truncate text-xl font-medium">
        {title}
      </span>

      <span className="ml-4 shrink-0 text-xl font-medium">
        {formatDeadline(deadline)}
      </span>

      {announced ? (
        <div className="ml-[68px] h-8 w-20 shrink-0" aria-hidden />
      ) : (
        <button
          type="button"
          onClick={() => onEdit(id)}
          className="ml-[68px] flex h-8 w-20 shrink-0 items-center justify-center rounded-xl border border-yellow-600 bg-yellow-50"
        >
          수정
        </button>
      )}

      <button
        type="button"
        onClick={() => onDelete(id)}
        aria-label="양식 삭제"
        className="ml-5 flex shrink-0 items-center justify-center p-1 text-gray-700 transition-colors hover:text-black"
      >
        <Close width={20} height={20} />
      </button>
    </div>
  );
}
