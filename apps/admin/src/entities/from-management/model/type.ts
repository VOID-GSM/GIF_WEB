// GET /api/form/admin 응답
export interface AdminForm {
  id: number;
  title: string;
  deadline: string;
  announced: boolean;
  submitted: boolean;
  grade: number; // 추가 구현
  teamName: string; // 추가 구현
}

// GET /api/form/{formId} 응답
export interface FormField {
  id: number;
  title: string;
  description: string;
  type: string;
  orderIndex: number;
}

export interface FormDetail {
  id: number;
  title: string;
  deadline: string;
  announced: boolean;
  fields: FormField[];
}

// GET /api/form/admin/submit 응답
export interface CalendarEvent {
  title: string;
  startDate: string;
  endDate: string;
  color: string;
} // 전체 추가 구현

export interface SubmitAnswer {
  fieldId: number;
  fieldTitle: string;
  type: string;
  textAnswer: string | null;
  filePath: string | null;
  fileSize: number | null; //추가 구현
  dateAnswer: string | null;
  calendarEvents: CalendarEvent[] | null; // 추가 구현
}

export interface AdminSubmitDetail {
  submitId: number;
  projectId: number;
  submittedByUserId: number;
  submittedAt: string;
  answers: SubmitAnswer[];
}
