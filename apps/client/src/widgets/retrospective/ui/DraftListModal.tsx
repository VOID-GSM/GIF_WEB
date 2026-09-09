"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import {
  CATEGORY_LABELS,
  useDeleteDraftRetrospective,
  useGetDraftRetrospectives,
  type DetailRetrospectiveResponse,
} from "@/entities/retrospective";

interface DraftListModalProps {
  onClose: () => void;
  onSelect: (draft: DetailRetrospectiveResponse) => void;
}

export default function DraftListModal({
  onClose,
  onSelect,
}: DraftListModalProps) {
  const { data: drafts } = useGetDraftRetrospectives();
  const { mutate: deleteDraft } = useDeleteDraftRetrospective();

  // Escape로 닫을 수 있게 한다
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleDelete = (id: number) => {
    deleteDraft(id, {
      onSuccess: () => toast.success("임시 저장 글을 삭제했습니다."),
    });
  };

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="draft-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="animate-modal-in thin-scrollbar max-h-[80dvh] w-full max-w-[440px] overflow-y-auto rounded-[14px] bg-white p-5"
      >
        <div className="flex items-center justify-between gap-3">
          <h2
            id="draft-modal-title"
            className="text-[16px] font-semibold text-gray-900"
          >
            임시 저장 목록
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="임시 저장 목록 닫기"
            className="cursor-pointer rounded-[8px] px-2 py-1 text-[13px] text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
          >
            닫기
          </button>
        </div>

        {drafts.length === 0 ? (
          <p className="py-12 text-center text-[13px] font-medium text-gray-400">
            임시 저장된 글이 없습니다.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-2">
            {drafts.map((draft) => (
              <li
                key={draft.id}
                className="flex items-center gap-2 rounded-[10px] border border-gray-200 p-3 transition-colors hover:border-gray-300"
              >
                <button
                  type="button"
                  onClick={() => onSelect(draft)}
                  className="min-w-0 flex-1 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
                >
                  <span className="block truncate text-[13px] font-medium text-gray-800">
                    {draft.title || "제목 없음"}
                  </span>
                  <span className="mt-0.5 block text-[12px] text-gray-400">
                    {CATEGORY_LABELS[draft.category]} ·{" "}
                    {draft.createdAt.slice(0, 10)}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(draft.id)}
                  aria-label={`${draft.title || "제목 없음"} 삭제`}
                  className="shrink-0 cursor-pointer rounded-[8px] px-2 py-1 text-[12px] font-medium text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
