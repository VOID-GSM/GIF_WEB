export interface FormByIdField {
  id: number;
  title: string;
  description: string;
  type: "TEXT" | "FILE" | "DATE";
  orderIndex: number;
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
}

export interface UpdateFormRequest {
  title: string;
  description?: string;
  deadline: string;
  targetGrade?: number;
  fields: UpdateFormField[];
}
