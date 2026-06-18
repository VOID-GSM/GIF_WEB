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

  const { data: formDetail, isLoading: detailLoading } =
    useGetFormDetail(formId);
  const { mutateAsync: submitForm, isPending } = usePostFormSubmit();
  const { mutateAsync: uploadFile } = usePostFormUpload();

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

  const handleSubmit = async () => {
    if (!formDetail?.fields || !projectId) return;

    const answers: FormAnswerItem[] = formDetail.fields.flatMap((field) => {
      const fId = field.fieldId ?? field.id ?? 0;
      if (field.type === "FILE") return [];

      if (field.type === "DATE") {
        const events = calendarAnswers[fId] ?? [];
        if (events.length === 0) {
          return [
            {
              fieldId: fId,
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
          fieldId: fId,
          textAnswer: "",
          dateAnswer: e.startDate,
          eventName: e.title,
          startDate: e.startDate,
          endDate: e.endDate,
          color: e.color,
        }));
      }

      return [
        {
          fieldId: fId,
          textAnswer: textAnswers[fId] ?? "",
          dateAnswer: "",
          eventName: "",
          startDate: "",
          endDate: "",
          color: "",
        },
      ];
    });

    try {
      // 1. 폼 제출 → submitId 획득
      const submitId = await submitForm({ formId, projectId, answers });

      // 2. 선택된 파일을 submitId와 함께 업로드
      const fileEntries = Object.entries(fileAnswers).filter(
        ([, file]) => file !== null,
      ) as [string, File][];

      await Promise.all(
        fileEntries.map(([fieldIdStr, file]) => {
          const fd = new FormData();
          fd.append("file", file);
          return uploadFile({
            formData: fd,
            fieldId: Number(fieldIdStr),
            submitId,
          });
        }),
      );

      router.push("/form");
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      toast.error(`제출에 실패했습니다: ${message}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-40 bg-background">
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
                    <TextField
                      fieldId={fId}
                      value={textAnswers[fId] ?? ""}
                      onChange={handleTextChange}
                    />
                  )}
                  {field.type === "FILE" && (
                    <FileField
                      fieldId={fId}
                      file={fileAnswers[fId] ?? null}
                      onChange={handleFileChange}
                    />
                  )}
                  {field.type === "DATE" && (
                    <CalendarField
                      fieldId={fId}
                      mode="write"
                      editable={true}
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
              disabled={isPending || !formDetail}
            >
              {isPending ? "제출 중..." : "완료하기"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
