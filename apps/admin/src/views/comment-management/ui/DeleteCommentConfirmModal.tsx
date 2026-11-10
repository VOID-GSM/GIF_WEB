"use client";

import type { AdminComment } from "@/entities/comment";

interface Props {
  comment: AdminComment;
  isPending: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

// 삭제한 댓글은 관리자 목록에서도 사라지므로 한 번 더 확인받는다.
export default function DeleteCommentConfirmModal({
  comment,
  isPending,
  onConfirm,
  onClose,
}: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
      onClick={() => !isPending && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="flex w-full max-w-[360px] flex-col gap-6 rounded-[16px] bg-white px-6 py-7 shadow-new"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-2">
          <p className="text-center text-base font-medium text-gray-900">
            댓글을 삭제하시겠어요?
          </p>
          <p className="text-center text-sm font-medium text-gray-500">
            삭제한 댓글은 되돌릴 수 없으며 관리 목록에서도 사라집니다.
          </p>
          <p className="mt-1 line-clamp-3 rounded-[10px] bg-gray-50 px-3 py-2 text-[13px] text-gray-600 dark:bg-gray-800">
            <span className="font-medium text-gray-800">
              {comment.authorName}
            </span>
            : {comment.content}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 cursor-pointer rounded-[10px] border border-yellow-600 bg-white py-2.5 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 cursor-pointer rounded-[10px] bg-red-500 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? "삭제 중..." : "삭제하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
