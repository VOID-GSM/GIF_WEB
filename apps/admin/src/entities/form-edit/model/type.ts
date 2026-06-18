export interface FormByIdField {
  fieldId: number;
  title: string;
  description: string;
  type: "TEXT" | "FILE" | "DATE";
  orderIndex: number;
}

export interface FormByIdResponse {
  formId: number;
  title: string;
  description: string;
  deadline: string;
  targetGrade: number;
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
