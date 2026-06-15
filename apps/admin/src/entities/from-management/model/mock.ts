import {
  AdminForm,
  AdminSubmitDetail,
  FormDetail,
} from "@/entities/from-management/model/type";

// GET /api/form/admin 응답 mock
export const mockAdminForms: AdminForm[] = [
  {
    id: 1,
    title: "아이디어 페스티벌 보고서",
    deadline: "2026-12-21",
    announced: true,
    submitted: true,
    grade: 1,
    teamName: "VOID",
  },
  {
    id: 2,
    title: "아이디어 페스티벌 보고서",
    deadline: "2026-12-21",
    announced: true,
    submitted: false,
    grade: 1,
    teamName: "GIF",
  },
  {
    id: 3,
    title: "아이디어 페스티벌 보고서",
    deadline: "2026-12-21",
    announced: true,
    submitted: true,
    grade: 1,
    teamName: "NOVA",
  },
  {
    id: 4,
    title: "아이디어 페스티벌 보고서",
    deadline: "2026-12-21",
    announced: true,
    submitted: true,
    grade: 1,
    teamName: "PIXEL",
  },
  {
    id: 5,
    title: "아이디어 페스티벌 배너",
    deadline: "2026-12-31",
    announced: true,
    submitted: true,
    grade: 2,
    teamName: "ALPHA",
  },
  {
    id: 6,
    title: "아이디어 페스티벌 배너",
    deadline: "2026-12-31",
    announced: true,
    submitted: false,
    grade: 2,
    teamName: "BETA",
  },
  {
    id: 7,
    title: "아이디어 페스티벌 배너",
    deadline: "2026-12-31",
    announced: true,
    submitted: true,
    grade: 2,
    teamName: "GAMMA",
  },
];

// GET /api/form/{formId} 응답 mock
export const mockFormDetail: Record<number, FormDetail> = {
  1: {
    id: 1,
    title: "아이디어 페스티벌 보고서",
    deadline: "2026-12-21",
    announced: true,
    fields: [
      {
        id: 1,
        title: "팀 관련 사이트 QR코드",
        description: "없으면 비워둘 것 (깃허브나 다른 사이트 등)",
        type: "file",
        orderIndex: 0,
      },
      {
        id: 2,
        title: "프로젝트 이름",
        description: "프로젝트 이름을 작성해 주세요",
        type: "text",
        orderIndex: 1,
      },
      {
        id: 3,
        title: "프로젝트 추진 일정",
        description: "아이디어 계획서, 재료 신청, 기능 구현을 추가해 주세요",
        type: "calendar",
        orderIndex: 2,
      },
    ],
  },
  3: {
    id: 3,
    title: "아이디어 페스티벌 보고서",
    deadline: "2026-12-21",
    announced: true,
    fields: [
      {
        id: 1,
        title: "프로젝트 소개",
        description: "프로젝트를 간단히 소개해 주세요",
        type: "text",
        orderIndex: 0,
      },
      {
        id: 2,
        title: "결과 보고서 파일",
        description: "PDF 형식으로 업로드해 주세요",
        type: "file",
        orderIndex: 1,
      },
    ],
  },
  4: {
    id: 4,
    title: "아이디어 페스티벌 보고서",
    deadline: "2026-12-21",
    announced: true,
    fields: [
      {
        id: 1,
        title: "팀 관련 사이트 QR코드",
        description: "없으면 비워둘 것",
        type: "file",
        orderIndex: 0,
      },
      {
        id: 2,
        title: "프로젝트 이름",
        description: "프로젝트 이름을 작성해 주세요",
        type: "text",
        orderIndex: 1,
      },
      {
        id: 3,
        title: "개발 일정",
        description: "개발 일정을 추가해 주세요",
        type: "calendar",
        orderIndex: 2,
      },
      {
        id: 4,
        title: "팀원 역할 정리",
        description: "각 팀원의 역할을 작성해 주세요",
        type: "text",
        orderIndex: 3,
      },
    ],
  },
  5: {
    id: 5,
    title: "아이디어 페스티벌 배너",
    deadline: "2026-12-31",
    announced: true,
    fields: [
      {
        id: 1,
        title: "배너 이미지",
        description: "PNG 또는 JPG로 업로드해 주세요",
        type: "file",
        orderIndex: 0,
      },
      {
        id: 2,
        title: "배너 설명 문구",
        description: "배너에 들어갈 문구를 작성해 주세요",
        type: "text",
        orderIndex: 1,
      },
    ],
  },
  7: {
    id: 7,
    title: "아이디어 페스티벌 배너",
    deadline: "2026-12-31",
    announced: true,
    fields: [
      {
        id: 1,
        title: "배너 파일",
        description: "완성된 배너 파일을 업로드해 주세요",
        type: "file",
        orderIndex: 0,
      },
      {
        id: 2,
        title: "제작 의도",
        description: "배너 제작 의도를 작성해 주세요",
        type: "text",
        orderIndex: 1,
      },
      {
        id: 3,
        title: "제작 일정",
        description: "배너 제작 일정을 추가해 주세요",
        type: "calendar",
        orderIndex: 2,
      },
    ],
  },
};

// GET /api/form/admin/submit?formId={formId} 응답 mock
export const mockSubmitDetailMap: Record<number, AdminSubmitDetail[]> = {
  // VOID - file + text + calendar
  1: [
    {
      submitId: 1,
      projectId: 1,
      submittedByUserId: 101,
      submittedAt: "2026-06-10T09:00:00.000Z",
      answers: [
        {
          fieldId: 1,
          fieldTitle: "팀 관련 사이트 QR코드",
          type: "file",
          textAnswer: null,
          filePath: "/mock/void_report.pdf",
          fileSize: 2048000,
          dateAnswer: null,
          calendarEvents: null,
        },
        {
          fieldId: 2,
          fieldTitle: "프로젝트 이름",
          type: "text",
          textAnswer: "저희 프로젝트 이름은 VOID 입니다",
          filePath: null,
          fileSize: null,
          dateAnswer: null,
          calendarEvents: null,
        },
        {
          fieldId: 3,
          fieldTitle: "프로젝트 추진 일정",
          type: "calendar",
          textAnswer: null,
          filePath: null,
          fileSize: null,
          dateAnswer: null,
          calendarEvents: [
            {
              title: "기획",
              startDate: "2026-01-05",
              endDate: "2026-01-07",
              color: "yellow",
            },
            {
              title: "개발",
              startDate: "2026-01-12",
              endDate: "2026-01-23",
              color: "green",
            },
            {
              title: "마무리",
              startDate: "2026-02-01",
              endDate: "2026-02-01",
              color: "red",
            },
          ],
        },
      ],
    },
  ],

  // NOVA - text + file만
  3: [
    {
      submitId: 3,
      projectId: 3,
      submittedByUserId: 103,
      submittedAt: "2026-06-11T10:30:00.000Z",
      answers: [
        {
          fieldId: 1,
          fieldTitle: "프로젝트 소개",
          type: "text",
          textAnswer: "NOVA는 별자리를 활용한 앱 서비스입니다.",
          filePath: null,
          fileSize: null,
          dateAnswer: null,
          calendarEvents: null,
        },
        {
          fieldId: 2,
          fieldTitle: "결과 보고서 파일",
          type: "file",
          textAnswer: null,
          filePath: "/mock/nova_report.pdf",
          fileSize: 1536000,
          dateAnswer: null,
          calendarEvents: null,
        },
      ],
    },
  ],

  // PIXEL - file + text + calendar + text
  4: [
    {
      submitId: 4,
      projectId: 4,
      submittedByUserId: 104,
      submittedAt: "2026-06-12T08:00:00.000Z",
      answers: [
        {
          fieldId: 1,
          fieldTitle: "팀 관련 사이트 QR코드",
          type: "file",
          textAnswer: null,
          filePath: "/mock/pixel_qr.pdf",
          fileSize: 512000,
          dateAnswer: null,
          calendarEvents: null,
        },
        {
          fieldId: 2,
          fieldTitle: "프로젝트 이름",
          type: "text",
          textAnswer: "PIXEL - 픽셀아트 공유 플랫폼",
          filePath: null,
          fileSize: null,
          dateAnswer: null,
          calendarEvents: null,
        },
        {
          fieldId: 3,
          fieldTitle: "개발 일정",
          type: "calendar",
          textAnswer: null,
          filePath: null,
          fileSize: null,
          dateAnswer: null,
          calendarEvents: [
            {
              title: "UI 설계",
              startDate: "2026-06-08",
              endDate: "2026-06-09",
              color: "yellow",
            },
            {
              title: "개발",
              startDate: "2026-06-15",
              endDate: "2026-06-25",
              color: "green",
            },
          ],
        },
        {
          fieldId: 4,
          fieldTitle: "팀원 역할 정리",
          type: "text",
          textAnswer: "김민준: 프론트엔드\n이서연: 백엔드\n박지호: 디자인",
          filePath: null,
          fileSize: null,
          dateAnswer: null,
          calendarEvents: null,
        },
      ],
    },
  ],

  // ALPHA - file + text만
  5: [
    {
      submitId: 5,
      projectId: 5,
      submittedByUserId: 105,
      submittedAt: "2026-06-13T14:00:00.000Z",
      answers: [
        {
          fieldId: 1,
          fieldTitle: "배너 이미지",
          type: "file",
          textAnswer: null,
          filePath: "/mock/alpha_banner.png",
          fileSize: 3145728,
          dateAnswer: null,
          calendarEvents: null,
        },
        {
          fieldId: 2,
          fieldTitle: "배너 설명 문구",
          type: "text",
          textAnswer: "미래를 여는 아이디어, ALPHA와 함께",
          filePath: null,
          fileSize: null,
          dateAnswer: null,
          calendarEvents: null,
        },
      ],
    },
  ],

  // GAMMA - file + text + calendar
  7: [
    {
      submitId: 7,
      projectId: 7,
      submittedByUserId: 107,
      submittedAt: "2026-06-14T11:00:00.000Z",
      answers: [
        {
          fieldId: 1,
          fieldTitle: "배너 파일",
          type: "file",
          textAnswer: null,
          filePath: "/mock/gamma_banner.pdf",
          fileSize: 4194304,
          dateAnswer: null,
          calendarEvents: null,
        },
        {
          fieldId: 2,
          fieldTitle: "제작 의도",
          type: "text",
          textAnswer:
            "팀의 개성을 담은 배너로 관람객의 시선을 사로잡고자 했습니다.",
          filePath: null,
          fileSize: null,
          dateAnswer: null,
          calendarEvents: null,
        },
        {
          fieldId: 3,
          fieldTitle: "제작 일정",
          type: "calendar",
          textAnswer: null,
          filePath: null,
          fileSize: null,
          dateAnswer: null,
          calendarEvents: [
            {
              title: "시안 제작",
              startDate: "2026-06-10",
              endDate: "2026-06-12",
              color: "yellow",
            },
            {
              title: "수정",
              startDate: "2026-06-20",
              endDate: "2026-06-22",
              color: "red",
            },
            {
              title: "최종 완성",
              startDate: "2026-06-28",
              endDate: "2026-06-28",
              color: "green",
            },
          ],
        },
      ],
    },
  ],
};
