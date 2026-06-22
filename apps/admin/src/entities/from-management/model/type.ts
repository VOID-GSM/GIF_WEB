export interface CalendarEventAnswer {
  eventName: string;
  startDate: string;
  endDate: string;
  color: string;
}

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

// GET /api/form/{formId} 응답 — 제출 상세보기용 양식 단건 조회
// (announced 양식도 조회 가능. 수정용 draft 조회와 달리 읽기 전용)
export interface AdminFormDetail {
  id: number;
  title: string;
  description: string;
  deadline: string;
  announced: boolean;
  deadlineComplied: boolean;
  fields: FormField[];
}

// GET /api/form/admin/submit 응답
// 캘린더 답변은 이벤트 1개당 answer 1행으로 평탄하게 내려온다
// (eventName/startDate/endDate/color). 텍스트·파일 답변에서는 해당 필드가 null.
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
