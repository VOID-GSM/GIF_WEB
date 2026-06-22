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

export interface CalendarEventAnswer {
  eventName: string;
  startDate: string;
  endDate: string;
  color: string;
}

// POST /api/form/submit
export interface FormAnswerItem {
  fieldId: number;
  textAnswer?: string;
  dateAnswer?: CalendarEventAnswer[];
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
export interface PatchFormSubmitAnswerItem {
  fieldId: number;
  textAnswer?: string;
  dateAnswer?: CalendarEventAnswer[];
}

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
  dateAnswer: CalendarEventAnswer[] | null;
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
