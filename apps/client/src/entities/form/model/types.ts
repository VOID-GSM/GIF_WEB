// GET /api/form?projectId= — 프로젝트의 양식(제출) 목록
export interface FormSummary {
  id: number;
  title: string;
  deadline: string; // YYYY-MM-DD
  announced: boolean;
  submitted: boolean;
  deadlineComplied: boolean; // 기한 내 제출 여부 (준수/미준수 판정)
  targetGrade: number;
}

export type GetFormsResponse = FormSummary[];

// 마감 현황 집계 (전체 / 준수 / 미준수)
export interface DeadlineSummary {
  total: number;
  met: number;
  notMet: number;
}
