export interface FormByIdField {
  id: number;
  title: string;
  description: string;
  type: "TEXT" | "FILE" | "CALENDAR";
  orderIndex: number;
  allowedExtensions?: string[]; // FILE 타입에서 client 가 제출 가능한 확장자
}

export interface FormByIdResponse {
  id: number;
  title: string;
  description: string;
  deadline: string;
  announced: boolean;
  deadlineComplied: boolean;
  fields: FormByIdField[];
}

export interface UpdateFormField {
  title: string;
  description: string;
  type: "TEXT" | "FILE" | "CALENDAR";
  orderIndex: number;
  allowedExtensions?: string[]; // FILE 타입에서 client 가 제출 가능한 확장자
}

export interface UpdateFormRequest {
  title: string;
  description?: string;
  deadline: string;
  targetGrade?: number;
  fields: UpdateFormField[];
}
