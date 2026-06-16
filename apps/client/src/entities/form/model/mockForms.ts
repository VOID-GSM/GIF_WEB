// TODO: 실데이터(목록 API에 deadlineComplied 포함) 연동 후 이 파일 전체 삭제
import type { FormSummary } from "./types";

// 마감 현황/양식 목록 확인용 목데이터.
// 전체 4(공지된 것), 준수 2(deadlineComplied true), 미준수 1(false + 마감경과), 대기 1(false + 마감 전)
export const MOCK_FORMS: FormSummary[] = [
  {
    id: 1,
    title: "아이디어 페스티벌 기획서",
    deadline: "2026-06-10",
    announced: true,
    submitted: true,
    deadlineComplied: true,
    targetGrade: 2,
  },
  {
    id: 2,
    title: "아이디어 페스티벌 배너",
    deadline: "2026-06-12",
    announced: true,
    submitted: true,
    deadlineComplied: true,
    targetGrade: 2,
  },
  {
    id: 3,
    title: "중간 발표 자료",
    deadline: "2026-06-10",
    announced: true,
    submitted: false,
    deadlineComplied: false,
    targetGrade: 2,
  },
  {
    id: 4,
    title: "최종 산출물",
    deadline: "2026-08-12",
    announced: true,
    submitted: false,
    deadlineComplied: false,
    targetGrade: 2,
  },
  {
    id: 5,
    title: "팀 소개서 (미공지)",
    deadline: "2026-08-20",
    announced: false,
    submitted: false,
    deadlineComplied: false,
    targetGrade: 2,
  },
];
