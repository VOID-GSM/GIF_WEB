// GET /api/form/admin 응답
export interface AdminForm {
  id: number;
  title: string;
  deadline: string;
  announced: boolean;
  submitted: boolean;
  deadlineComplied: boolean;
  targetGrade: number;
  teamName: string;
}

// GET /api/form/admin/submit 응답에서 개별 필드 타입
export interface FormField {
  id: number;
  title: string;
  description: string;
  type: "TEXT" | "FILE" | "CALENDAR";
  orderIndex: number;
}

// GET /api/form/admin/submit 응답
export interface SubmitAnswer {
  fieldId: number;
  fieldTitle: string;
  type: string;
  textAnswer: string | null;
  filePath: string | null;
  fileSize: number | null;
  dateAnswer: string | null;
  eventName: string | null;
  startDate: string | null;
  endDate: string | null;
  color: string | null;
}

export interface AdminSubmitDetail {
  submitId: number;
  projectId: number;
  teamName: string;
  submittedByUserId: number;
  submittedAt: string;
  answers: SubmitAnswer[];
}
