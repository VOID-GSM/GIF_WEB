export interface PostFormRequestField {
  title: string;
  description: string;
  type: "TEXT" | "FILE" | "CALENDAR" | "";
  orderIndex: number;
  allowedExtensions?: string[]; // FILE 타입에서 client 가 제출 가능한 확장자 + "url"(외부 링크 제출 허용 플래그)
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
