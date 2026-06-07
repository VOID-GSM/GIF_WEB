import type { GetFormListResponse } from "./types";

/**
 * 임시 목데이터 — 양식 목록 UI 개발용.
 * DataGSM admin 연동(실 admin 토큰 발급)이 완료되면 이 파일을 통째로 삭제하세요.
 * 삭제 시 useGetFormList.ts의 목 블록도 함께 제거하면 실제 API로 바로 연결됩니다.
 */
export const MOCK_FORM_LIST: GetFormListResponse = [
  {
    id: 1,
    title: "아이디어 페스티벌 보고서",
    deadline: "2026-12-21",
    announced: false,
    submitted: false,
  },
  {
    id: 2,
    title: "1차 기획서 제출",
    deadline: "2026-11-30",
    announced: false,
    submitted: false,
  },
  {
    id: 3,
    title: "팀 구성 신청서",
    deadline: "2026-10-15",
    announced: true,
    submitted: true,
  },
  {
    id: 4,
    title: "중간 발표 자료",
    deadline: "2026-11-05",
    announced: true,
    submitted: false,
  },
  {
    id: 5,
    title: "최종 산출물 제출",
    deadline: "2026-12-10",
    announced: false,
    submitted: false,
  },
  {
    id: 6,
    title: "포스터 디자인 제출",
    deadline: "2026-11-20",
    announced: true,
    submitted: true,
  },
  {
    id: 7,
    title: "회고 보고서",
    deadline: "2026-12-23",
    announced: true,
    submitted: false,
  },
  {
    id: 8,
    title: "데모 영상 업로드",
    deadline: "2026-12-18",
    announced: false,
    submitted: false,
  },
];
