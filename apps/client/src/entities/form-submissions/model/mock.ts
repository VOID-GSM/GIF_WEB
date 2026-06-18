import type { GetFormMySubmitResponse } from "./types";

export const MOCK_FORM_ID = 1;
export const MOCK_PROJECT_ID = 1;

export const mockFormDetail = {
  formId: MOCK_FORM_ID,
  title: "아이디어 기획서",
  description: "팀 프로젝트 아이디어를 제출하는 양식입니다.",
  deadline: "2026-12-21",
  targetGrade: 2,
  fields: [
    {
      fieldId: 1,
      title: "프로젝트 이름",
      description: "팀 프로젝트 이름을 입력해주세요",
      type: "TEXT" as const,
      orderIndex: 0,
    },
    {
      fieldId: 2,
      title: "프로젝트 소개",
      description: "프로젝트를 간략히 소개해주세요",
      type: "TEXT" as const,
      orderIndex: 1,
    },
    {
      fieldId: 3,
      title: "결과 보고서",
      description: "PDF 형식으로 업로드해 주세요",
      type: "FILE" as const,
      orderIndex: 2,
    },
    {
      fieldId: 4,
      title: "프로젝트 추진 일정",
      description: "주요 일정을 캘린더에 추가해주세요",
      type: "CALENDAR" as const,
      orderIndex: 3,
    },
  ],
};

export const mockFormFields = mockFormDetail.fields;

export const mockMySubmit: GetFormMySubmitResponse = {
  submitId: 1,
  projectId: MOCK_PROJECT_ID,
  teamName: "VOID",
  submittedByUserId: 101,
  submittedAt: "2026-06-10T09:00:00.000Z",
  deadlineComplied: true,
  answers: [
    {
      fieldId: 1,
      fieldTitle: "프로젝트 이름",
      type: "TEXT",
      textAnswer: "VOID - 개발자 커뮤니티 플랫폼",
      filePath: "",
      fileSize: 0,
      dateAnswer: [],
    },
    {
      fieldId: 2,
      fieldTitle: "프로젝트 소개",
      type: "TEXT",
      textAnswer:
        "개발자들이 서로의 프로젝트를 공유하고 피드백을 나눌 수 있는 커뮤니티 플랫폼입니다.",
      filePath: "",
      fileSize: 0,
      dateAnswer: [],
    },
    {
      fieldId: 3,
      fieldTitle: "결과 보고서",
      type: "FILE",
      textAnswer: "",
      filePath: "/mock/void_report.pdf",
      fileSize: 2048000,
      dateAnswer: [],
    },
    {
      fieldId: 4,
      fieldTitle: "프로젝트 추진 일정",
      type: "CALENDAR",
      textAnswer: "",
      filePath: "",
      fileSize: 0,
      dateAnswer: [
        { eventName: "기획 완료", startDate: "2026-06-01", endDate: "2026-06-05", color: "blue" },
        { eventName: "개발 시작", startDate: "2026-08-01", endDate: "2026-10-31", color: "green" },
        { eventName: "최종 제출", startDate: "2026-12-15", endDate: "2026-12-21", color: "red" },
      ],
    },
  ],
};
