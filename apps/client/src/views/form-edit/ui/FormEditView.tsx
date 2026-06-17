"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarField,
  FileField,
  TextField,
  type CalendarEvent,
} from "@/entities/form-submissions/index";
import {
  useGetFormMySubmit,
  usePatchFormSubmit,
  useGetFormDetail,
} from "@/entities/form-submissions/index";
import type { SubmitAnswerItem } from "@/entities/form-submissions/model/types";

type Props = { formId: number; projectId: number };

function toCalendarEvents(
  answers: SubmitAnswerItem[],
  fieldId: number,
): CalendarEvent[] {
  return answers
    .filter((a) => a.fieldId === fieldId && a.type === "DATE" && a.eventName)
    .map((a) => ({
      id: `${a.fieldId}-${a.startDate}`,
      title: a.eventName,
      startDate: a.startDate,
      endDate: a.endDate,
      color: a.color || "gray",
    }));
}

export default function FormMySubmitView({ formId, projectId }: Props) {
  const router = useRouter();

  const { data: formDetail, isLoading: detailLoading } =
    useGetFormDetail(formId);
  const { data: mySubmit, isLoading: submitLoading } = useGetFormMySubmit({
    formId,
    projectId,
  });
  const { mutate: patchSubmit, isPending } = usePatchFormSubmit();

  const [isEditing, setIsEditing] = useState(false);

  // ─── 서버 데이터 기반 초기값 ─────────────────────────────────────────────
  const initialTexts = useMemo(() => {
    const texts: Record<number, string> = {};
    mySubmit?.answers.forEach((a) => {
      if (a.type === "TEXT") texts[a.fieldId] = a.textAnswer;
    });
    return texts;
  }, [mySubmit]);

  const initialCalendars = useMemo(() => {
    const calendars: Record<number, CalendarEvent[]> = {};
    const processed = new Set<number>();
    mySubmit?.answers.forEach((a) => {
      if (a.type === "DATE" && !processed.has(a.fieldId)) {
        calendars[a.fieldId] = toCalendarEvents(mySubmit.answers, a.fieldId);
        processed.add(a.fieldId);
      }
    });
    return calendars;
  }, [mySubmit]);

  // ─── 사용자 수정분만 별도 관리 ───────────────────────────────────────────
  const [textEdits, setTextEdits] = useState<Record<number, string>>({});
  const [calendarEdits, setCalendarEdits] = useState<
    Record<number, CalendarEvent[]>
  >({});
  const [fileAnswers, setFileAnswers] = useState<Record<number, File | null>>(
    {},
  );

  // 수정분 우선, 없으면 초기값
  const getTextValue = (fieldId: number) =>
    textEdits[fieldId] ?? initialTexts[fieldId] ?? "";
  const getCalendarValue = (fieldId: number) =>
    calendarEdits[fieldId] ?? initialCalendars[fieldId] ?? [];

  const handleTextChange = (fieldId: number, value: string) =>
    setTextEdits((prev) => ({ ...prev, [fieldId]: value }));

  const handleFileChange = (fieldId: number, file: File | null) =>
    setFileAnswers((prev) => ({ ...prev, [fieldId]: file }));

  const handleCalendarChange = (fieldId: number, events: CalendarEvent[]) =>
    setCalendarEdits((prev) => ({ ...prev, [fieldId]: events }));

  // 취소 시 수정분 초기화
  const handleCancel = () => {
    setTextEdits({});
    setCalendarEdits({});
    setFileAnswers({});
    setIsEditing(false);
  };

  const handlePatch = () => {
    if (!mySubmit) return;

    const seenFields = new Set<number>();
    const answers = mySubmit.answers
      .filter((a) => {
        if (seenFields.has(a.fieldId)) return false;
        seenFields.add(a.fieldId);
        return true;
      })
      .flatMap((a) => {
        if (a.type === "DATE") {
          const events =
            calendarEdits[a.fieldId] ?? initialCalendars[a.fieldId] ?? [];
          if (events.length === 0) {
            return [
              {
                fieldId: a.fieldId,
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
            fieldId: a.fieldId,
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
            fieldId: a.fieldId,
            textAnswer: textEdits[a.fieldId] ?? a.textAnswer,
            dateAnswer: a.dateAnswer,
            eventName: "",
            startDate: "",
            endDate: "",
            color: "",
          },
        ];
      });

    patchSubmit(
      { submitId: mySubmit.submitId, answers },
      { onSuccess: () => router.push("/form") },
    );
  };

  if (detailLoading || submitLoading) return <div>로딩중...</div>;
  if (!formDetail) return <div>양식 정보를 불러올 수 없습니다.</div>;
  if (!mySubmit) return <div>제출 정보를 불러올 수 없습니다.</div>;

  const uniqueAnswers = mySubmit.answers.filter(
    (a, idx, arr) => arr.findIndex((b) => b.fieldId === a.fieldId) === idx,
  );

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
          {uniqueAnswers.map((answer: SubmitAnswerItem) => (
            <div
              key={answer.fieldId}
              className="flex flex-col py-8 px-12 border-t-5 border-yellow-600 bg-white rounded-[10px] shadow-new"
            >
              <span className="text-[20px] font-semibold pb-2">
                {answer.fieldTitle}
              </span>

              {answer.type === "TEXT" && (
                <TextField
                  fieldId={answer.fieldId}
                  value={getTextValue(answer.fieldId)}
                  readOnly={!isEditing}
                  onChange={handleTextChange}
                />
              )}
              {answer.type === "FILE" && (
                <FileField
                  fieldId={answer.fieldId}
                  file={fileAnswers[answer.fieldId] ?? null}
                  readOnly={!isEditing}
                  onChange={handleFileChange}
                />
              )}
              {answer.type === "DATE" && (
                <CalendarField
                  fieldId={answer.fieldId}
                  mode="view"
                  editable={isEditing}
                  events={getCalendarValue(answer.fieldId)}
                  onChange={handleCalendarChange}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-5 pb-20">
          {isEditing ? (
            <>
              <button
                className="flex w-full items-center justify-center py-3 font-medium border border-yellow-600 bg-white rounded-[10px] cursor-pointer"
                onClick={handleCancel}
              >
                취소
              </button>
              <button
                className="flex w-full items-center justify-center py-3 font-medium bg-yellow-600 rounded-[10px] cursor-pointer disabled:opacity-50"
                onClick={handlePatch}
                disabled={isPending}
              >
                {isPending ? "저장 중..." : "완료하기"}
              </button>
            </>
          ) : (
            <button
              className="flex w-full items-center justify-center py-3 font-medium bg-yellow-600 rounded-[10px] cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              수정하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
