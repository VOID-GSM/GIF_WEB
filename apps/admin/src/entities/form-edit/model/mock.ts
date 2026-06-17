import type { FormByIdResponse } from "./type";

export const mockFormByIdMap: Record<number, FormByIdResponse> = {
  1: {
    id: 1,
    title: "아이디어 페스티벌 보고서",
    description: "",
    deadline: "2026-12-21",
    announced: true,
    deadlineComplied: false,
    fields: [
      {
        id: 1,
        title: "팀 관련 사이트 QR코드",
        description: "팀 관련 사이트 QR코드를 첨부해 주세요.",
        type: "FILE",
        orderIndex: 0,
      },
      {
        id: 2,
        title: "프로젝트 이름",
        description: "프로젝트 이름을 입력해 주세요.",
        type: "TEXT",
        orderIndex: 1,
      },
      {
        id: 3,
        title: "프로젝트 추진 일정",
        description: "프로젝트 추진 일정을 입력해 주세요.",
        type: "CALENDAR",
        orderIndex: 2,
      },
    ],
  },
  2: {
    id: 2,
    title: "아이디어 페스티벌 배너",
    description: "",
    deadline: "2026-12-31",
    announced: true,
    deadlineComplied: false,
    fields: [
      {
        id: 1,
        title: "배너 이미지",
        description: "배너 이미지를 첨부해 주세요.",
        type: "FILE",
        orderIndex: 0,
      },
      {
        id: 2,
        title: "배너 설명 문구",
        description: "배너에 들어갈 설명 문구를 입력해 주세요.",
        type: "TEXT",
        orderIndex: 1,
      },
      {
        id: 3,
        title: "제작 일정",
        description: "제작 일정을 입력해 주세요.",
        type: "CALENDAR",
        orderIndex: 2,
      },
    ],
  },
};

export const DEFAULT_MOCK_FORM = mockFormByIdMap[1];
