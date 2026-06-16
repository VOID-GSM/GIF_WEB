export interface PostFormRequestField {
  title: string;
  description: string;
  type: "TEXT" | "FILE" | "CALENDAR";
  orderIndex: number;
}

export interface PostFormRequest {
  title: string;
  description?: string;
  deadline: string;
  targetGrade?: number;
  fields: PostFormRequestField[];
}

export type PostFormResponse = number;

export interface PostFormAnnounceParams {
  formId: number;
}
