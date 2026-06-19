"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarField,
  FileField,
  TextField,
  type CalendarEvent,
} from "@/entities/form-submissions/index";
import { usePostFormSubmit } from "@/entities/form-submissions/hooks/usePostFormSubmit";
import { usePostFormUpload } from "@/entities/form-submissions/hooks/usePostFormUpload";
import { useGetFormDetail } from "@/entities/form-submissions/hooks/useGetFormDetail";
import type { FormAnswerItem } from "@/entities/form-submissions/model/types";
import { useGetMyInfo } from "@/entities/mypage/index";
import { toast } from "sonner";

type Props = { formId: number };

export default function FormSubmitView({ formId }: Props) {
  const { data: myInfo, isLoading: myInfoLoading } = useGetMyInfo();
  const projectId = myInfo?.projectId;

  const router = useRouter();

  const { data: formDetail, isLoading: detailLoading } = useGetFormDetail(formId);
  const { mutateAsync: submitForm, isPending } = usePostFormSubmit();
  const { mutateAsync: uploadFile } = usePostFormUpload();

  const [textAnswers, setTextAnswers] = useState<Record<number, string>>({});
  const [fileAnswers, setFileAnswers] = useState<Record<number, File | null>>({});
  const [calendarAnswers, setCalendarAnswers] = useState<Record<number, CalendarEvent[]>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<number, string>>({});

  const handleTextChange = (fieldId: number, value: string) => {
    setTextAnswers((prev) => ({ ...prev, [fieldId]: value }));
    if (value.trim()) setFieldErrors((prev) => ({ ...prev, [fieldId]: "" }));
  };

  const handleFileChange = (fieldId: number, file: File | null) => {
    setFileAnswers((prev) => ({ ...prev, [fieldId]: file }));
    if (file) setFieldErrors((prev) => ({ ...prev, [fieldId]: "" }));
  };

  const handleCalendarChange = (fieldId: number, events: CalendarEvent[]) =>
    setCalendarAnswers((prev) => ({ ...prev, [fieldId]: events }));

  const handleSubmit = async () => {
    if (!formDetail?.fields || !projectId) return;

    const errors: Record<number, string> = {};
    formDetail.fields.forEach((field) => {
      const fId = field.fieldId ?? field.id ?? 0;
      if (field.type === "TEXT" && !textAnswers[fId]?.trim()) {
        errors[fId] = "필수 항목입니다.";
      }
      if (field.type === "FILE" && !fileAnswers[fId]) {
        errors[fId] = "파일을 첨부해주세요.";
      }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.error("모든 항목을 작성해주세요.");
      return;
    }

    const answers: FormAnswerItem[] = formDetail.fields.flatMap((field) => {
      const fId = field.fieldId ?? field.id ?? 0;
      if (field.type === "FILE") return [];

      if (field.type === "DATE" || field.type === "CALENDAR") {
        const events = calendarAnswers[fId] ?? [];
        const mapped = events.map((e) => ({
          eventName: e.title,
          startDate: e.startDate,
          endDate: e.endDate,
          color: e.color,
        }));
        return [{
          fieldId: fId,
          textAnswer: "",
          ...(mapped.length > 0 ? { dateAnswer: mapped } : {}),
        }];
      }

      return [{
        fieldId: fId,
        textAnswer: textAnswers[fId] ?? "",
      }];
    });

    console.log("[handleSubmit] request body:", JSON.stringify({ formId, projectId, answers }, null, 2));
    try {
      const submitId = await submitForm({ formId, projectId, answers });

      const fileEntries = Object.entries(fileAnswers).filter(
        ([, file]) => file instanceof File,
      ) as [string, File][];

      if (fileEntries.length > 0) {
        try {
          await Promise.all(
            fileEntries.map(([fieldIdStr, file]) => {
              const fd = new FormData();
              fd.append("file", file);
              return uploadFile({ formData: fd, fieldId: Number(fieldIdStr), submitId });
            }),
          );
        } catch {
          toast.error("파일 업로드에 실패했습니다. 수정 페이지에서 파일을 다시 업로드해주세요.");
          router.push(`/form/${formId}/edit`);
          return;
        }
      }

      router.push("/form");
    } catch {
      toast.error("제출에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-20 px-5 bg-background">
      {myInfoLoading || detailLoading ? (
        <div className="flex w-full justify-center pt-20 text-gray-500 font-medium">
          로딩중...
        </div>
      ) : !projectId ? (
        <div className="flex w-full justify-center pt-20 text-gray-500 font-medium">
          프로젝트 정보를 불러올 수 없습니다.
        </div>
      ) : !formDetail ? (
        <div className="flex w-full justify-center pt-20 text-gray-500 font-medium">
          양식 정보를 불러올 수 없습니다.
        </div>
      ) : (
        <div className="mx-auto flex flex-col w-full max-w-[560px] gap-4">
          <div className="flex flex-col gap-2">
            <span className="flex justify-center text-[24px] font-semibold">
              {formDetail.title}
            </span>
            <span className="text-[14px] font-medium">
              마감일: {formDetail.deadline}
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {(formDetail.fields ?? [])
              .slice()
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((field, index) => {
                const fId = field.fieldId ?? field.id ?? index;
                const error = fieldErrors[fId];
                return (
                  <div
                    key={fId}
                    className="flex flex-col py-8 px-12 border-t-5 border-yellow-600 bg-white rounded-[10px] shadow-new"
                  >
                    <span className="text-[20px] font-semibold pb-2">
                      {field.title}
                    </span>
                    <span className="font-medium text-gray-500 pb-4">
                      {field.description}
                    </span>

                    {field.type === "TEXT" && (
                      <>
                        <TextField
                          fieldId={fId}
                          value={textAnswers[fId] ?? ""}
                          onChange={handleTextChange}
                        />
                        {error && (
                          <span className="mt-1 text-[12px] text-red-500">{error}</span>
                        )}
                      </>
                    )}
                    {field.type === "FILE" && (
                      <>
                        <FileField
                          fieldId={fId}
                          file={fileAnswers[fId] instanceof File ? (fileAnswers[fId] as File) : null}
                          onChange={handleFileChange}
                        />
                        {error && (
                          <span className="mt-1 text-[12px] text-red-500">{error}</span>
                        )}
                      </>
                    )}
                    {(field.type === "DATE" || field.type === "CALENDAR") && (
                      <CalendarField
                        fieldId={fId}
                        mode="write"
                        editable={true}
                        events={calendarAnswers[fId] ?? []}
                        onChange={handleCalendarChange}
                      />
                    )}
                  </div>
                );
              })}
          </div>

          <div className="pb-20">
            <button
              className="flex w-full items-center justify-center py-3 font-medium bg-yellow-600 rounded-[10px] cursor-pointer disabled:opacity-50"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? "제출 중..." : "완료하기"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
