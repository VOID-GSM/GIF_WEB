// 보고서 영역 평가 시작일 설정 — EvaluationPeriodBar(입력)와 EvaluationPeriodBadge(조회)가 공유하는 타입·유틸.

// POST /api/score/period 스펙과 동일한 모양으로 맞춰둔다.
export interface EvaluationPeriodPayload {
  category: "REPORT";
  startDate: string; // ISO 8601
}

export function formatKoreanDateTime(dateStr: string, timeStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return `${year}년 ${month}월 ${day}일 ${timeStr}`;
}

// 날짜(YYYY-MM-DD) + 시각(HH:mm) 로컬 입력값을 ISO 8601(UTC) 문자열로 변환한다.
export function toIsoStartDate(dateStr: string, timeStr: string) {
  return new Date(`${dateStr}T${timeStr}:00`).toISOString();
}

// ISO 문자열을 로컬 타임존 기준 "YYYY년 M월 D일 HH:mm"으로 되돌린다.
export function formatIsoKoreanDateTime(iso: string) {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${hh}:${mm}`;
}
