import type { DeadlineSummary, FormSummary } from "../model/types";
import { isDeadlinePassed } from "./isDeadlinePassed";

// 마감 시각(날짜만이면 그날 자정)이 지났으면 마감됨 — 시간까지 반영
export function isOverdue(deadline: string): boolean {
  return isDeadlinePassed(deadline);
}

// 공지된 양식 기준으로 마감 현황 집계.
// 준수 = 서버의 deadlineComplied(기한 내 제출) true.
// 미준수 = deadlineComplied false 이면서 마감이 지난 양식 (마감 전 미제출은 '대기'로 제외).
export function getDeadlineSummary(forms: FormSummary[]): DeadlineSummary {
  const announced = forms.filter((form) => form.announced);
  return {
    total: announced.length,
    met: announced.filter((form) => form.deadlineComplied).length,
    notMet: announced.filter(
      (form) => !form.deadlineComplied && isOverdue(form.deadline),
    ).length,
  };
}
