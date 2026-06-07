"use client";

import { formatDeadline } from "../lib/formatDeadline";
import { isDeadlinePassed } from "../lib/isDeadlinePassed";
import type { FormSummary } from "../model/types";

interface FormCardProps {
  form: FormSummary;
  onOpen: (id: number) => void;
}

export default function FormCard({ form, onOpen }: FormCardProps) {
  const { id, title, deadline, submitted } = form;
  const closed = isDeadlinePassed(deadline);

  return (
    <div className="flex h-20 w-[800px] shrink-0 items-center rounded-xl bg-white pr-[64px] pl-4 shadow">
      <span
        className={`flex h-8 w-[88px] shrink-0 items-center justify-center rounded-xl border font-medium ${
          submitted
            ? "border-gray-200 bg-gray-100"
            : "border-yellow-600 bg-yellow-50"
        }`}
      >
        {submitted ? "제출 함" : "제출하기"}
      </span>

      <span className="ml-4 min-w-0 flex-1 truncate text-xl font-medium">
        {title}
      </span>

      <span className="ml-4 shrink-0 text-xl font-medium">
        {formatDeadline(deadline)}
      </span>

      {closed ? (
        <span className="ml-[72px] flex h-8 w-20 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-100 font-medium">
          마감
        </span>
      ) : (
        <button
          type="button"
          onClick={() => onOpen(id)}
          className={`ml-[72px] flex h-8 w-20 shrink-0 items-center justify-center rounded-xl border font-medium ${
            submitted
              ? "border-orange-400 bg-orange-50"
              : "border-yellow-600 bg-yellow-50"
          }`}
        >
          {submitted ? "수정" : "작성"}
        </button>
      )}
    </div>
  );
}
