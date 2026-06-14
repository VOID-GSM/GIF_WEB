export interface PostFormRequestField {
  title: string;
  description: string;
  type: "TEXT" | "FILE" | "CALENDAR";
  orderIndex: number;
}

export interface PostFormRequest {
  title: string;
  deadline: string;
  fields: PostFormRequestField[];
}

export type PostFormResponse = number;

export interface PostFormAnnounceParams {
  formId: number;
}
