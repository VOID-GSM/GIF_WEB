import type { DeadlineSummary, FormSummary } from "../model/types";

// 마감 시각이 지났으면 마감됨.
// - 시간 포함(YYYY-MM-DDTHH:mm:ss) → 해당 시각까지 제출 가능
// - 날짜만(YYYY-MM-DD) → 그날 자정(23:59:59, KST)까지 제출 가능
export function isOverdue(deadline: string): boolean {
  if (!deadline || typeof deadline !== "string") return false;
  const hasTimezone =
    deadline.includes("Z") || /[+-]\d{2}:?\d{2}$/.test(deadline);
  const iso = deadline.includes("T") ? deadline : `${deadline}T23:59:59`;
  const endTime = new Date(hasTimezone ? iso : `${iso}+09:00`).getTime();
  return !isNaN(endTime) && Date.now() > endTime;
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
