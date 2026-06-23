// GET /api/form?projectId= — 프로젝트의 양식(제출) 목록
export interface FormSummary {
  id: number;
  title: string;
  deadline: string; // YYYY-MM-DD
  /** 공지 여부 */
  announced: boolean;
  /** 우리 팀(프로젝트)의 제출 여부 */
  submitted: boolean;
  /** 기한 내 제출 여부 (준수/미준수 판정) */
  deadlineComplied: boolean;
  /** 대상 학년 */
  targetGrade: number;
}

export type GetFormsResponse = FormSummary[];

// GET /api/form/admin 계열 — 양식 목록 응답 (동일 요약 형태)
export type GetFormListResponse = FormSummary[];

// 마감 현황 집계 (전체 / 준수 / 미준수)
export interface DeadlineSummary {
  total: number;
  met: number;
  notMet: number;
}
