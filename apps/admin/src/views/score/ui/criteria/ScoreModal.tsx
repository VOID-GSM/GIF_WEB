"use client";

interface Props {
  title: string;
  description?: string;
  onClose: () => void;
  children?: React.ReactNode;
  footer: React.ReactNode;
}

// 점수 페이지 공통 모달 — 기존 "점수를 수정하시겠습니까?" 확인 모달과 같은 스타일.
export default function ScoreModal({ title, description, onClose, children, footer }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-2xl shadow-lg px-6 py-6 sm:px-8 sm:py-7 flex flex-col gap-5 w-full max-w-[440px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-1.5">
          <p className="text-base font-semibold text-gray-900">{title}</p>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
        {children}
        <div className="flex gap-2 justify-end">{footer}</div>
      </div>
    </div>
  );
}

export const modalCancelCx =
  "px-4 py-2 rounded-xl text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors dark:hover:bg-gray-800";

export const modalPrimaryCx =
  "px-4 py-2 rounded-xl text-sm font-semibold bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors";

export const modalDangerCx =
  "px-4 py-2 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors";

export const fieldInputCx =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-yellow-600 transition-colors";
