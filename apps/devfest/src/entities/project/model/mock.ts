import type { Project } from "./types";

// 임시 mock 데이터 — API 연동 전까지 프로젝트 UI 확인용.
// 로고/팀원 사진은 apps/devfest/public 폴더의 정적 자산을 참조한다.
export function getProjectById(id: number): Project | undefined {
  return MOCK_PROJECTS.find((project) => project.id === id);
}

export const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    name: "GSMSV",
    teamName: "gsmsv",
    logo: "/gsmsv/gsmsv-logo.jpg",
    siteUrl: "https://gsmsv.site",
    demoVideoUrl: "/gsmsv/gsmsv-video.mp4",
    description:
      "“GSMSV”는 GSM의 AWS입니다.\n\n" +
      "GSMSV는 실제 광주 소프트웨어 마이스터고등학교 서버실에 있는 Proxmox VE 서버에서 동작합니다.\n\n" +
      "광주 소프트웨어 마이스터고 학생들이 배포 및 OS에 대해 공부 할 때 사용하려 만든 IaaS 플랫폼입니다. " +
      "현재는 70명 이상의 사용자가 있으며 평균 100~120개에 달하는 인스턴스들이 24시간 가동중입니다.",
    features: [
      {
        title: "5분내 빠른 배포",
        description: "4단계 마법사로 인스턴스 생성",
      },
      {
        title: "유연한 스펙 선택",
        description: "1~4 vCPU • 2~8GB RAM",
      },
      {
        title: "HTTPS 자동 적용",
        description: "Caddy 기반 인증서 자동 발급",
      },
      {
        title: "자동 스냅샷 • 함수 단위 실행",
        description: "상태 자동 보관 • 함수 단위 실행",
      },
    ],
    members: [
      {
        name: "김민준",
        role: "팀장",
        description: "전체적인 프로젝트 설계와 BE 일부 및 인프라 담당",
        photo: "/gsmsv/member/minjun.jpg",
        portfolioUrl: "https://github.com/MingJK",
      },
      {
        name: "이세민",
        role: "Back-end",
        description: "BE 유지보수, 신규 기능 Serverless 개발",
        photo: "/gsmsv/member/semin.png",
        portfolioUrl: "https://github.com/wwwcomcomcomcom",
      },
      {
        name: "송재욱",
        role: "Front-end",
        description: "메인 FE 개발",
        photo: "/gsmsv/member/song.png",
        portfolioUrl: "https://github.com/zaewc",
      },
      {
        name: "김담율",
        role: "Front-end",
        description: "보조 FE 개발",
        photo: "/gsmsv/member/damyul.png",
        portfolioUrl: "https://github.com/DAMNyul",
      },
      {
        name: "하창혁",
        role: "QA",
        description: "기능 테스트와 실제 환경에서의 버그 및 결함 탐색",
      },
      {
        name: "김민종",
        role: "PM",
        description: "프로젝트의 시작부터 끝까지 과정을 총괄",
        photo: "/gsmsv/member/minjong.png",
        portfolioUrl: "https://github.com/minong00",
      },
      {
        name: "김홍준",
        role: "Design",
        description: "웹 페이지 디자인 담당",
        photo: "/gsmsv/member/hong.png",
        portfolioUrl: "https://github.com/bost02",
      },
    ],
  },
  {
    id: 2,
    name: "GCinside",
    teamName: "왕꼬막상회",
    logo: "/gcinside/GCinside-logo.png",
    demoVideoUrl: "/gcinside/gcinside-video.mp4",
    description:
      "GCinside는 광주소프트웨어마이스터고 학생들의 동아리 신청·관리를 지원하고, " +
      "Anti-Abuse/ML 기반으로 비정상 신청과 어뷰징을 탐지하는 동아리 운영 플랫폼입니다.",
    features: [],
    members: [
      {
        name: "이산",
        role: "PM · 팀장",
        description: "프로젝트의 방향성과 일정을 잡고, 팀 전체 흐름을 총괄",
        photo: "/gcinside/member/san.png",
      },
      {
        name: "송재욱",
        role: "Front-end",
        description: "사용자가 직접 마주하는 동아리 신청 화면과 인터랙션 구현",
        photo: "/gcinside/member/song.png",
        portfolioUrl: "https://github.com/zaewc",
      },
      {
        name: "정재원",
        role: "Infra",
        description: "운영 환경을 점검하고 서버 인프라 안정화 담당",
        photo: "/gcinside/member/won.png",
        portfolioUrl:
          "https://www.figma.com/file/I73pOlHVDb0FAeYLMLfuPk?node-id=0:1&t=dIkrJ1ucL1doe3QY-1&locale=ko-kr&type=design",
      },
      {
        name: "배경진",
        role: "Front-end",
        description: "사용자 경험을 다듬는 프론트엔드 UI와 기능 개발",
        photo: "/gcinside/member/jin.png",
        portfolioUrl:
          "https://drive.google.com/file/d/1vmHVgdBJZlHXdfFNA7uZwg2KxLyU9f4E/view",
      },
      {
        name: "김승찬",
        role: "Back-end",
        description: "신청·관리 API와 어뷰즈 탐지 로직을 연결하는 백엔드 개발",
        photo: "/gcinside/member/sung.png",
        portfolioUrl:
          "https://drive.google.com/file/d/18zNvQa_ZtIoo0DCN0aYQ3gYgc_3K6iFL/view",
      },
      {
        name: "김지훈",
        role: "Infra",
        description: "서비스가 안정적으로 돌아갈 수 있는 배포·인프라 기반 구축",
        photo: "/gcinside/member/jihun.png",
        portfolioUrl: "https://kimjihoon3106.github.io/",
      },
      {
        name: "모태환",
        role: "Design",
        description: "서비스의 첫인상을 만드는 화면 구조와 비주얼 디자인 담당",
        photo: "/gcinside/member/mo.png",
        portfolioUrl:
          "https://prickle-smelt-6ce.notion.site/Portfolio-334e9a1de3bc8013bb33e42338e8598e",
      },
    ],
  },
  {
    id: 3,
    name: "감go!",
    teamName: "const",
    logo: "/gam/gam-logo.png",
    demoVideoUrl: "/gam/gam-video.mp4",
    description:
      "모든 여행의 준비를 이제\n\n" +
      "AI가 취향에 따라 여행지와 플레이리스트를 추천하고, " +
      "여행 일정과 플레이리스트를 관리하는 앱 감(go!)입니다.",
    features: [
      { title: "여행지 검색", description: "맛집, 숙소, 관광지 탐색" },
      {
        title: "AI 기반 여행지 추천",
        description: "취향 선택 후 AI가 여행지를 추천",
      },
      {
        title: "AI 기반 플레이리스트 생성",
        description: "가수 이름 입력 후 플레이리스트 생성",
      },
      { title: "마이페이지", description: "내 여행 일정과 플레이리스트 관리" },
    ],
    members: [
      {
        name: "김한주",
        role: "팀장",
        description: "회의 주도, 의견 수렴, 팀원 일정 조율",
        photo: "/gam/member/han.png",
        portfolioUrl: "https://github.com/Kimhanju0210",
      },
      {
        name: "최준영",
        role: "UI/UX · Front-end",
        description:
          "UI/UX 디자인, 주요 기능·사용자 인증 구현, 서버와 비동기 통신",
        photo: "/gam/member/jun.png",
      },
      {
        name: "이용표",
        role: "Back-end",
        description: "회의 주도, 의견 수렴, 팀원 일정 조율",
        photo: "/gam/member/lee.png",
      },
      {
        name: "김동현",
        role: "QA",
        description: "회의 주도, 의견 수렴, 팀원 일정 조율",
        photo: "/gam/member/dong.png",
      },
    ],
  },
  {
    id: 4,
    name: "Washer",
    teamName: "워셔",
    logo: "/washer/washer-logo.png",
    demoVideoUrl: "/washer/washer-video.mp4",
    videoFit: "contain", // 세로형 앱 영상 — 전체 표시(좌우 여백)
    heroBg: "#4285f4", // 로고 파랑 톤 배경 (밝기에 따라 글자색 자동 전환)
    description: "기숙사 세탁을 더 편리하고 스마트 하게",
    features: [
      {
        title: "예약 시스템",
        description: "미시작 시 자동 취소, Redis TTL 기반 5분 유지",
      },
      {
        title: "고장 신고",
        description: "200자 제한, 신고 시 기기 상태 변경 및 알림",
      },
      {
        title: "시작 검증",
        description: "3분 내 시작 확인, 10초 polling으로 기기 상태 체크",
      },
      {
        title: "악용 방지",
        description: "반복 예약 제한(쿨타임/패널티), 사용자별 이용 제한",
      },
    ],
    members: [
      {
        name: "김민솔",
        role: "UI/UX Design",
        description: "전체 서비스의 앱, 웹 디자인과 디자인시스템 구축을 맡았습니다.",
        photo: "/washer/member/min.png",
      },
      {
        name: "이은아",
        role: "QA",
        description:
          "로그인 정보 유지 문제, dispose 오류를 해결했습니다. 앱스토어와 플레이스토어에 배포했습니다.",
        photo: "/washer/member/ena.png",
      },
      {
        name: "권재헌",
        role: "PM",
        description:
          "프로젝트 일정 관리, 요구사항 분석을 담당했습니다. 핵심 기능 기획과 기능 테스트를 진행했습니다.",
        photo: "/washer/member/jahun.png",
        portfolioUrl:
          "https://ginger-narcissus-e98.notion.site/FE-272cbbbaed1a80198eddceef87f23c36",
      },
      {
        name: "김봄",
        role: "Front-end",
        description:
          "웹 서비스 UI 구현, 공통 컴포넌트 설계, API 연동 및 서버 상태 관리, 화면 개발과 배포를 했습니다.",
        photo: "/washer/member/bom.png",
        portfolioUrl:
          "https://app.notion.com/p/2cdbf73cc5378049ad20db08f8ea554f?source=copy_link",
      },
      {
        name: "황지훈",
        role: "Back-end",
        description:
          "백엔드 아키텍처 설계 및 핵심 비즈니스 로직 개발을 담당했습니다. 인증 외부 서비스 연동을 구현했습니다.",
        photo: "/washer/member/hangjihun.png",
      },
      {
        name: "이주언",
        role: "Flutter",
        description: "앱 클라이언트 개발을 담당했습니다.",
        photo: "/washer/member/un.png",
        portfolioUrl:
          "https://qr.scanned.page/uploads/pdf/Gic0fz_90725983111f81aa.pdf",
      },
      {
        name: "나현욱",
        role: "Flutter",
        description: "앱 구조 설계, 전체 기능 구현, 이슈 해결을 담당해 진행하였습니다.",
        photo: "/washer/member/na.png",
        portfolioUrl:
          "https://qr1.me-qr.com/mobile/pdf/6a3e5966-c7d7-4446-a2a3-d3a0b0a8b6ca",
      },
    ],
  },
  {
    id: 5,
    name: "GOMS",
    teamName: "haribo",
    logo: "/goms/goms-logo.png",
    demoVideoUrl: "/goms/goms-video.mp4",
    videoFit: "contain", // 세로형 앱 영상
    heroBg: "#f5a623", // 로고 주황 톤 배경
    description:
      "외출제를 더욱 더 간편하게\n\n" + "GSM 외출제 관리 플랫폼입니다.",
    features: [
      {
        title: "QR 기반 외출 관리",
        description: "QR 코드로 외출과 복귀를 빠르게 인증할 수 있습니다.",
      },
      {
        title: "실시간 외출 현황",
        description: "외출 중인 학생의 상태를 실시간으로 확인할 수 있습니다.",
      },
      {
        title: "지도 및 길 찾기",
        description: "원하는 장소 검색과 카카오맵 길찾기를 지원합니다.",
      },
      {
        title: "장소 탐색 및 공유",
        description: "장소를 저장하고 리뷰를 작성하거나 확인할 수 있습니다.",
      },
    ],
    members: [
      {
        name: "모태환",
        role: "PM",
        description:
          "GOMS V3의 신규 버전 기능 설계와 프로젝트 운영을 주도하고, 운영 가이드 개선 및 기능 명세를 구체화했습니다. 개발자와 지속적으로 소통하며 일정과 이슈를 조율하고, 프로젝트가 계획에 맞게 안정적으로 진행될 수 있도록 관리했습니다.",
        photo: "/goms/member/mota.png",
        skills: ["Figma", "Notion", "Adobe"],
        email: "mr.moteahwan@gmail.com",
        phone: "010-5731-5334",
        portfolioUrl:
          "https://prickle-smelt-6ce.notion.site/Portfolio-334e9a1de3bc8013bb33e42338e8598e",
      },
      {
        name: "한의준",
        role: "SERVER",
        description:
          "GOMS V3의 서버 개발과 배포를 담당하며 Kotlin 기반 Spring Boot로 REST API를 설계 구현했습니다. MariaDB와 Redis를 활용한 데이터 관리, AWS S3 및 카카오 API 연동을 통해 서비스의 안정성과 기능을 강화했습니다.",
        photo: "/goms/member/hanejun.png",
        skills: ["JAVA", "Spring Boot", "Redis", "Spring Security", "MariaDB"],
        email: "hanej090224@gmail.com",
        phone: "010-6778-3734",
      },
      {
        name: "김준표",
        role: "APP",
        description:
          "GOMS iOS V3의 메인 개발과 프로젝트 구조 설계를 수행하고, 핵심 기능 개발, REST API 연동, KakaoMapsSDK 기반 지도 기능 구현, Tuist 기반 모듈 의존성 구성 및 프로젝트 관리를 담당하였습니다.",
        photo: "/goms/member/junpu.png",
        skills: ["Swift", "UIKit", "Tuist", "SnapKit", "Then", "Moya"],
        email: "junpyokim0166@gmail.com",
        phone: "010-4999-7562",
      },
      {
        name: "류수연",
        role: "APP",
        description:
          "GOMS Flutter V3의 주요 화면과 핵심 기능을 개발하고, REST API 연동을 통해 서비스 로직을 구현했습니다. 공통 위젯을 활용해 일관된 UI를 구성하며 사용자 경험을 향상시켰습니다.",
        photo: "/goms/member/rusu.png",
        skills: ["Dart", "Flutter", "Riverpod", "Retrofit", "Dio", "fvm"],
        email: "s25010@gsm.hs.kr",
        phone: "010-5812-5334",
        portfolioUrl: "https://github.com/ryusuye0n",
      },
      {
        name: "김민선",
        role: "APP",
        description:
          "GOMS iOS V3의 주요 화면 전반을 퍼블리싱하고 Admin Report·Late 기능의 API 연동 및 세부 기능 구현을 담당했습니다. 사용자 경험을 고려한 UI를 구현하며 서비스의 완성도와 사용성을 높였습니다.",
        photo: "/goms/member/minsun.png",
        skills: ["Swift", "Combine", "UIKit", "Kingfisher", "KakaoMapsSDK"],
        email: "s25055@gsm.hs.kr",
        phone: "010-3367-1483",
      },
      {
        name: "김민솔",
        role: "Design",
        description:
          "GOMS V3의 신규 버전 기능 구조를 설계하고, 전체 운영 흐름을 사용자 경험 관점에서 재정의했습니다. 운영 가이드를 UI/UX 기준에 맞게 개선하고 기능 명세를 시각적으로 이해하기 쉽도록 구체화했습니다.",
        photo: "/goms/member/minsol.png",
        skills: ["Figma"],
        email: "s24057@gsm.hs.kr",
        phone: "010-2104-6274",
      },
    ],
  },
];
