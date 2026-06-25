"use client";

import { Close, Textarea, FileUpload } from "@repo/ui";
import CalendarAnswer from "@/entities/from-management/ui/Calendaranswer";
import type { AdminFormDetail, FormField } from "@/entities/from-management/model/type";

type Props = {
  form: AdminFormDetail;
  onClose: () => void;
};

// 실제 학생 입력 폼(공유 컴포넌트)을 그대로 보여주되, 클릭/입력은 막는다.
function PreviewField({ field }: { field: FormField }) {
  return (
    <div className="flex flex-col rounded-[10px] border-t-5 border-yellow-600 bg-white px-7 py-6 shadow-new">
      <span className="text-[18px] font-semibold">{field.title}</span>
      {field.description && (
        <span className="pb-3 pt-1 font-medium text-gray-500">
          {field.description}
        </span>
      )}

      {/* pointer-events-none: 미리보기라 입력/클릭 비활성 */}
      <div className="pointer-events-none mt-2 select-none">
        {field.type === "TEXT" && (
          <Textarea title="답변을 입력하세요" rows={3} />
        )}
        {field.type === "FILE" && (
          <FileUpload className="h-[160px] w-full" />
        )}
        {field.type === "CALENDAR" && <CalendarAnswer answers={[]} />}
      </div>
    </div>
  );
}

export default function FormPreviewModal({ form, onClose }: Props) {
  const fields = [...form.fields].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-[600px] flex-col rounded-[16px] bg-background shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-7 py-5">
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold text-yellow-900">
              폼 미리보기
            </span>
            <span className="text-[20px] font-semibold text-gray-900">
              {form.title}
            </span>
            <span className="pt-1 text-[13px] font-medium text-gray-500">
              마감일: {form.deadline}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="shrink-0 cursor-pointer rounded-lg p-1 text-gray-500 transition-colors hover:text-gray-900"
          >
            <Close width={22} height={22} />
          </button>
        </div>

        {/* 본문 — 필드 목록 */}
        <div className="flex flex-col gap-4 overflow-y-auto px-7 py-6">
          {fields.length === 0 ? (
            <p className="py-10 text-center text-sm font-medium text-gray-500">
              구성된 항목이 없습니다.
            </p>
          ) : (
            fields.map((field) => <PreviewField key={field.id} field={field} />)
          )}
        </div>
      </div>
    </div>
  );
}
