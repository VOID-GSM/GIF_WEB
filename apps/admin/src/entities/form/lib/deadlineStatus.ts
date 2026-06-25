import type { DeadlineSummary, FormSummary } from "../model/types";

// 로컬 시간대 기준 "YYYY-MM-DD" 문자열 (UTC 파싱/Hydration 오차 방지)
function getLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 마감일이 오늘보다 이전이면 마감됨 (문자열 직접 비교)
export function isOverdue(deadline: string): boolean {
  return deadline < getLocalDateString(new Date());
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
