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
import { useGetFormDetail } from "@/entities/form-submissions/hooks/useGetFormDetail";
import type { FormAnswerItem } from "@/entities/form-submissions/model/types";

type Props = { formId: number; projectId: number };

export default function FormSubmitView({ formId, projectId }: Props) {
  const router = useRouter();

  const { data: formDetail, isLoading: detailLoading } =
    useGetFormDetail(formId);
  const { mutate: submitForm, isPending } = usePostFormSubmit();

  const [textAnswers, setTextAnswers] = useState<Record<number, string>>({});
  const [fileAnswers, setFileAnswers] = useState<Record<number, File | null>>(
    {},
  );
  const [calendarAnswers, setCalendarAnswers] = useState<
    Record<number, CalendarEvent[]>
  >({});

  const handleTextChange = (fieldId: number, value: string) =>
    setTextAnswers((prev) => ({ ...prev, [fieldId]: value }));

  // FILE은 FileField 내부에서 usePostFormUpload로 처리
  const handleFileChange = (fieldId: number, file: File | null) =>
    setFileAnswers((prev) => ({ ...prev, [fieldId]: file }));

  const handleCalendarChange = (fieldId: number, events: CalendarEvent[]) =>
    setCalendarAnswers((prev) => ({ ...prev, [fieldId]: events }));

  const handleSubmit = () => {
    if (!formDetail?.fields) return;

    const answers: FormAnswerItem[] = formDetail.fields.flatMap((field) => {
      if (field.type === "FILE") return [];

      if (field.type === "DATE") {
        const events = calendarAnswers[field.fieldId] ?? [];
        if (events.length === 0) {
          return [
            {
              fieldId: field.fieldId,
              textAnswer: "",
              dateAnswer: "",
              eventName: "",
              startDate: "",
              endDate: "",
              color: "",
            },
          ];
        }
        return events.map((e) => ({
          fieldId: field.fieldId,
          textAnswer: "",
          dateAnswer: e.startDate,
          eventName: e.title,
          startDate: e.startDate,
          endDate: e.endDate,
          color: e.color,
        }));
      }

      // TEXT
      return [
        {
          fieldId: field.fieldId,
          textAnswer: textAnswers[field.fieldId] ?? "",
          dateAnswer: "",
          eventName: "",
          startDate: "",
          endDate: "",
          color: "",
        },
      ];
    });

    submitForm(
      { formId, projectId, answers },
      { onSuccess: () => router.push("/form") },
    );
  };

  if (detailLoading) return <div>로딩중...</div>;
  if (!formDetail) return <div>양식 정보를 불러올 수 없습니다.</div>;

  return (
    <div className="min-h-screen flex flex-col items-center pt-40 bg-background">
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
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((field) => (
              <div
                key={field.fieldId}
                className="flex flex-col py-8 px-12 border-t-5 border-yellow-600 bg-white rounded-[10px] shadow-new"
              >
                <span className="text-[20px] font-semibold pb-2">
                  {field.title}
                </span>
                <span className="font-medium text-gray-500 pb-4">
                  {field.description}
                </span>

                {field.type === "TEXT" && (
                  <TextField
                    fieldId={field.fieldId}
                    value={textAnswers[field.fieldId] ?? ""}
                    onChange={handleTextChange}
                  />
                )}
                {field.type === "FILE" && (
                  <FileField
                    fieldId={field.fieldId}
                    file={fileAnswers[field.fieldId] ?? null}
                    onChange={handleFileChange}
                  />
                )}
                {field.type === "DATE" && (
                  <CalendarField
                    fieldId={field.fieldId}
                    mode="write"
                    onChange={handleCalendarChange}
                  />
                )}
              </div>
            ))}
        </div>

        <div className="pb-20">
          <button
            className="flex w-full items-center justify-center py-3 font-medium bg-yellow-600 rounded-[10px] cursor-pointer disabled:opacity-50"
            onClick={handleSubmit}
            disabled={isPending || !formDetail}
          >
            {isPending ? "제출 중..." : "완료하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
