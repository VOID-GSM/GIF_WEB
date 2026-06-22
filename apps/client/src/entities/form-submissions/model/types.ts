export interface FormDetailField {
  fieldId: number;
  id?: number; // 일부 API 응답이 fieldId 대신 id를 반환하는 경우 대비
  title: string;
  description: string;
  type: "TEXT" | "FILE" | "DATE" | "CALENDAR";
  orderIndex: number;
}

export interface GetFormDetailResponse {
  formId: number;
  title: string;
  description: string;
  deadline: string;
  targetGrade: number;
  fields: FormDetailField[];
}

// 백엔드 AnswerRequest/AnswerResponse 는 평면(flat) 구조이며,
// 캘린더 이벤트는 같은 fieldId 를 가진 개별 answer 항목으로 표현된다.
// (dateAnswer 는 단일 날짜 문자열, 캘린더 이벤트는 eventName/startDate/endDate/color)

// POST /api/form/submit
export interface FormAnswerItem {
  fieldId: number;
  textAnswer?: string;
  dateAnswer?: string;
  eventName?: string;
  startDate?: string;
  endDate?: string;
  color?: string;
}

export interface PostFormSubmitRequest {
  formId: number;
  projectId: number;
  answers: FormAnswerItem[];
}

// POST /api/form/upload — 응답은 파일 URL 문자열
export type PostFormUploadResponse = string;

// DELETE /api/form/upload
export interface DeleteFormUploadParams {
  fieldId: number;
  submitId: number;
}

// PATCH /api/form/submit
export type PatchFormSubmitAnswerItem = FormAnswerItem;

export interface PatchFormSubmitRequest {
  submitId: number;
  answers: PatchFormSubmitAnswerItem[];
}

// GET /api/form/my-submit
export interface GetFormMySubmitParams {
  formId: number;
  projectId: number;
}

export interface SubmitAnswerItem {
  fieldId: number;
  fieldTitle: string;
  type: string;
  textAnswer: string;
  filePath: string;
  fileSize: number;
  dateAnswer: string | null;
  eventName: string | null;
  startDate: string | null;
  endDate: string | null;
  color: string | null;
}

export interface GetFormMySubmitResponse {
  submitId: number;
  projectId: number;
  teamName: string;
  submittedByUserId: number;
  submittedAt: string;
  deadlineComplied: boolean;
  answers: SubmitAnswerItem[];
}
