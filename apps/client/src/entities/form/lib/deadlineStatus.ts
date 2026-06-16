import type { DeadlineSummary, FormSummary } from "../model/types";

// 오늘 0시 (날짜 단위 비교용)
function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

// 마감일이 오늘보다 이전이면 마감됨
export function isOverdue(deadline: string): boolean {
  return new Date(deadline) < startOfToday();
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
