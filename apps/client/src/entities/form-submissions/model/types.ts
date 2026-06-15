export interface FormAnswerItem {
  fieldId: number;
  textAnswer: string;
  dateAnswer: string;
  fileAnswer?: string;
}

export interface PostFormSubmitRequest {
  formId: number;
  projectId: number;
  answers: FormAnswerItem[];
}

export interface PostFormUploadResponse {
  fileUrl: string;
}

export interface DeleteFormUploadParams {
  submitId: number;
  fieldId: number;
}

export interface PatchFormSubmitAnswerItem {
  fieldId: number;
  textAnswer: string;
  dateAnswer: string;
}

export interface PatchFormSubmitRequest {
  submitId: number;
  answers: PatchFormSubmitAnswerItem[];
}

export interface FormFieldItem {
  title: string;
  description: string;
  type: "TEXT" | "FILE" | "DATE";
  orderIndex: number;
}

export interface PatchFormUpdateRequest {
  title: string;
  description: string;
  deadline: string;
  targetGrade: number;
  fields: FormFieldItem[];
}

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
  answers: SubmitAnswerItem[];
}
