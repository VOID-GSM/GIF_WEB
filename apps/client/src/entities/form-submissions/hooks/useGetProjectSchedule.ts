"use client";

import { useQueries } from "@tanstack/react-query";
import { getFormMySubmit } from "../api/api";
import type { CalendarEvent } from "../ui/CalendarField";
import type { SubmitAnswerItem } from "../model/types";

function isDateStr(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

// 한 양식의 제출 답변에서 캘린더/날짜 이벤트만 뽑아낸다.
// 백엔드는 DATE·CALENDAR 답변을 모두 dateAnswer 배열(CalendarEventResponse[])로 내려준다.
function toCalendarEvents(
  formId: number,
  answers: SubmitAnswerItem[],
): CalendarEvent[] {
  return answers
    .filter((a) => a.type === "DATE" || a.type === "CALENDAR")
    .flatMap((a) =>
      (a.dateAnswer ?? [])
        .filter((ev) => isDateStr(ev.startDate))
        .map((ev, i) => ({
          id: `${formId}-${a.fieldId}-${ev.startDate}-${i}`,
          title: ev.eventName || a.fieldTitle || "",
          startDate: ev.startDate,
          endDate: isDateStr(ev.endDate) ? ev.endDate : ev.startDate,
          color: ev.color || "gray",
        })),
    );
}

// 프로젝트(팀)가 제출한 양식들의 캘린더 일정을 모두 모아 하나의 일정으로 합친다.
// 제출 데이터는 양식별(my-submit)로만 조회되므로 useQueries 로 병렬 조회 후 합친다.
export function useGetProjectSchedule(projectId: number, formIds: number[]) {
  const results = useQueries({
    queries: formIds.map((formId) => ({
      // useGetFormMySubmit 과 동일한 queryKey 로 캐시를 공유한다.
      queryKey: ["form", "my-submit", formId, projectId],
      queryFn: () => getFormMySubmit({ formId, projectId }),
      enabled: !!projectId && !!formId,
    })),
  });

  const events = results.flatMap((result, index) =>
    result.data ? toCalendarEvents(formIds[index], result.data.answers) : [],
  );
  const isLoading = results.some((result) => result.isLoading);

  return { events, isLoading };
}
