"use client";

interface LeaderTransferModalProps {
  memberName: string;
  isPending: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

// 팀장 양도 확인 모달 — MASTER(아이디어페스티벌 담당) 관리자가 프로젝트 상세에서 팀원 클릭 시 노출
export default function LeaderTransferModal({
  memberName,
  isPending,
  onConfirm,
  onClose,
}: LeaderTransferModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
      onClick={() => !isPending && onClose()}
    >
      <div
        className="flex w-full max-w-[320px] flex-col gap-6 rounded-[16px] bg-white px-6 py-7 shadow-new"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-center text-base font-medium text-gray-900">
          <span className="font-semibold">{memberName}</span> 님에게
          <br />
          팀장을 양도하시겠어요?
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 rounded-[10px] border border-yellow-600 bg-white py-2.5 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 rounded-[10px] bg-yellow-600 py-2.5 text-sm font-semibold text-gray-900 transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
          >
            {isPending ? "양도 중..." : "양도하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
