export interface FormSummary {
  id: number;
  title: string;
  /** 제출 마감일 (YYYY-MM-DD) */
  deadline: string;
  /** 공지 여부 — true면 client에 노출되며 수정이 불가능하다 */
  announced: boolean;
  /** 제출물 존재 여부 */
  submitted: boolean;
}

export type GetFormListResponse = FormSummary[];

// 백엔드 enum 확정 시 확장
export type FormFieldType = "TEXT";

export interface UpdateFormField {
  title: string;
  description: string;
  type: FormFieldType;
  orderIndex: number;
}

export interface UpdateFormRequest {
  title: string;
  deadline: string;
  fields: UpdateFormField[];
}
