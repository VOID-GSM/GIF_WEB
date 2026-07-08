"use client";

import { formatDeadline } from "../lib/formatDeadline";
import { isDeadlinePassed } from "../lib/isDeadlinePassed";
import type { FormSummary } from "../model/types";

interface FormCardProps {
  form: FormSummary;
  onSubmit: (id: number) => void;
  onEdit: (id: number) => void;
}

export default function FormCard({ form, onSubmit, onEdit }: FormCardProps) {
  const { id, title, deadline, submitted } = form;
  const closed = isDeadlinePassed(deadline);

  return (
    <div className="flex h-20 w-full shrink-0 items-center rounded-xl bg-white pl-4 pr-4 shadow transition-shadow duration-200 hover:shadow-md sm:pr-[64px]">
      {submitted ? (
        <span className="flex h-8 w-[88px] shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-100 font-medium">
          제출
        </span>
      ) : (
        <span className="flex h-8 w-[88px] shrink-0 cursor-pointer items-center justify-center rounded-xl border border-yellow-600 bg-yellow-50 font-medium transition-all duration-150 hover:bg-yellow-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-600/50">
          미제출
        </span>
      )}

      <span className="ml-4 min-w-0 flex-1 truncate text-base font-medium sm:text-xl">
        {title}
      </span>

      <span className="ml-4 hidden shrink-0 text-base font-medium sm:inline sm:text-xl">
        {formatDeadline(deadline)}
      </span>

      {closed ? (
        <span className="ml-4 flex h-8 w-20 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-100 font-medium sm:ml-[72px]">
          마감
        </span>
      ) : (
        <button
          type="button"
          onClick={() => (submitted ? onEdit(id) : onSubmit(id))}
          className={`ml-4 flex h-8 w-20 shrink-0 cursor-pointer items-center justify-center rounded-xl border font-medium transition-all duration-150 hover:shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-600/50 sm:ml-[72px] ${
            submitted
              ? "border-orange-400 bg-orange-50 hover:bg-orange-100"
              : "border-yellow-600 bg-yellow-50 hover:bg-yellow-100"
          }`}
        >
          {submitted ? "수정" : "작성"}
        </button>
      )}
    </div>
  );
}
