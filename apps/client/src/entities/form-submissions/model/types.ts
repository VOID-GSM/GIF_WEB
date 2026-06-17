export interface FormDetailField {
  fieldId: number;
  title: string;
  description: string;
  type: "TEXT" | "FILE" | "DATE";
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

// POST /api/form/submit
export interface FormAnswerItem {
  fieldId: number;
  textAnswer: string;
  dateAnswer: string;
  eventName: string;
  startDate: string;
  endDate: string;
  color: string;
}

export interface PostFormSubmitRequest {
  formId: number;
  projectId: number;
  answers: FormAnswerItem[];
}

// POST /api/form/upload
export interface PostFormUploadResponse {
  fileUrl: string;
}

// DELETE /api/form/upload
export interface DeleteFormUploadParams {
  fieldId: number;
}

// PATCH /api/form/submit
export interface PatchFormSubmitAnswerItem {
  fieldId: number;
  textAnswer: string;
  dateAnswer: string;
  eventName: string;
  startDate: string;
  endDate: string;
  color: string;
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
  dateAnswer: string;
  eventName: string;
  startDate: string;
  endDate: string;
  color: string;
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
