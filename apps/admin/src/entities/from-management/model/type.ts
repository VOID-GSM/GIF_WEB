export interface CalendarEventAnswer {
  eventName: string | null;
  startDate: string;
  endDate: string;
  color: string | null;
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
  allowedExtensions?: string[]; // FILE 타입에서 client 가 제출 가능한 확장자
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

// GET /api/form/admin/submit 응답 (백엔드 AnswerResponse, 스웨거 기준)
// 캘린더·날짜 답변은 모두 dateAnswer 배열(CalendarEventAnswer[])로 내려온다.
// eventName/startDate/endDate/color 는 평면 필드가 아니라 배열 원소의 속성이다.
export interface SubmitAnswer {
  fieldId: number;
  fieldTitle: string;
  type: string;
  textAnswer: string | null;
  filePath: string | null;
  fileSize: number | null;
  dateAnswer: CalendarEventAnswer[] | null;
}

export interface AdminSubmitDetail {
  submitId: number;
  projectId: number;
  teamName: string;
  submittedByUserId: number;
  submittedAt: string;
  answers: SubmitAnswer[];
}
