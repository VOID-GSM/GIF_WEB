interface RetrospectiveFormActionsProps {
  onSaveDraft: () => void;
  isSavingDraft: boolean;
  onSubmit: () => void;
  isSubmitting: boolean;
  isEditing?: boolean;
}

export default function RetrospectiveFormActions({
  onSaveDraft,
  isSavingDraft,
  onSubmit,
  isSubmitting,
  isEditing = false,
}: RetrospectiveFormActionsProps) {
  return (
    <div className="mt-6 flex justify-end gap-2 border-t border-gray-200 pt-4">
      <button
        type="button"
        onClick={onSaveDraft}
        disabled={isSavingDraft}
        className="cursor-pointer rounded-[10px] border border-gray-200 px-4 py-2 text-[13px] font-medium text-gray-600 transition-all duration-150 hover:border-gray-300 hover:text-gray-800 active:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        임시 저장
      </button>
      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="cursor-pointer rounded-[10px] bg-yellow-600 px-4 py-2 text-[13px] font-medium text-gray-900 transition-all duration-150 hover:-translate-y-0.5 hover:bg-yellow-700 hover:shadow active:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {isEditing ? "수정 완료" : "작성 완료"}
      </button>
    </div>
  );
}
