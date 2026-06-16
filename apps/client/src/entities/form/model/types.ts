export interface FormSummary {
  id: number;
  title: string;
  /** 제출 마감일 (YYYY-MM-DD) */
  deadline: string;
  /** 공지 여부 */
  announced: boolean;
  /** 우리 팀(프로젝트)의 제출 여부 */
  submitted: boolean;
}

export type GetFormListResponse = FormSummary[];
