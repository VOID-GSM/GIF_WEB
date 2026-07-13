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
    logoFit: "cover",
    siteUrl: "https://gsmsv.site",
    leader: "김민준",
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
    logoBg: "#ffffff",
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
    logoBg: "#ffffff",
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
    logoBg: "#ffffff",
    siteUrl: "https://play.google.com/store/apps/details?id=com.washer.v2",
    leader: "김민솔",
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
        description:
          "전체 서비스의 앱, 웹 디자인과 디자인시스템 구축을 맡았습니다.",
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
        description:
          "앱 구조 설계, 전체 기능 구현, 이슈 해결을 담당해 진행하였습니다.",
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
    siteUrl: "https://apps.apple.com/kr/app/goms/id6502936560",
    leader: "모태환",
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
  {
    id: 6,
    name: "flooding",
    teamName: "플러딩",
    logo: "/flooding/flooding-logo.png",
    logoBg: "#ffffff",
    siteUrl: "https://flooding.kr",
    leader: "김준혁",
    demoVideoUrl: "/flooding/flooding-video.mp4",
    description: "하나의 플랫폼, 학교 통합 관리 서비스",
    features: [
      {
        title: "학교 서비스 통합",
        description:
          "기존에 흩어져 있던 학교 서비스를 하나로 통합하여, 학생들이 필요한 기능을 더욱 편리하게 이용할 수 있습니다.",
      },
      {
        title: "동아리 신청",
        description:
          "동아리 모집부터 신청 현황까지 한 곳에서 간편하게 확인하고 신청할 수 있습니다.",
      },
      {
        title: "기숙사 관리",
        description:
          "기상음악 신청, 안마의자 예약, 자습 관리 등 기숙사 생활에 필요한 기능을 제공합니다.",
      },
      {
        title: "홈베이스 예약",
        description:
          "홈베이스 이용 시간을 예약하고 실시간 현황을 확인할 수 있습니다.",
      },
    ],
    members: [
      {
        name: "모태환",
        role: "PM",
        description:
          "일일 보고서를 작성해 PO에게 보고하고, 개발자와 일정·이슈를 조율했습니다.",
        photo: "/flooding/member/mohwn.png",
      },
      {
        name: "김민솔",
        role: "UI/UX Design",
        description:
          "전체 서비스의 앱, 웹 디자인과 디자인 시스템 구축을 맡았습니다.",
        photo: "/flooding/member/kimmin.png",
      },
      {
        name: "김준혁",
        role: "Front-end",
        description:
          "프로젝트의 설계부터 유지보수까지 개발 전반에 참여하며 팀을 이끌어왔습니다. 프론트엔드 파트리더로 기숙사 도메인 개발과 교내 서버 내 배포 등을 했습니다.",
        photo: "/flooding/member/kimjun.png",
        portfolioUrl:
          "https://drive.google.com/file/d/1bWqnI9zWXehSDPLbHOML1x1UIoYcKY0q/view",
      },
      {
        name: "김승찬",
        role: "Back-end",
        description:
          "문제의 원인을 분석해 서비스 품질을 개선해왔습니다. 신규 팀원 온보딩을 해 기술 구조 이해와 협업 문화 적응을 도왔고, 안정적인 서비스를 만들기 위해 노력했습니다.",
        photo: "/flooding/member/kimseng.png",
      },
      {
        name: "김지훈",
        role: "DevOps",
        description:
          "더 나은 인프라를 위해 다양한 기술을 직접 익히고, 이를 실제 서비스로 구현하며 성장해온 클라우드 아키텍트입니다.",
        photo: "/flooding/member/kimjihun.png",
      },
      {
        name: "배용빈",
        role: "AI",
        description:
          "문제를 끝까지 해결하고 수치로 검증하는 AI 개발자입니다. AI 모델 개발 등에 참여하며 파트리더로 의사결정과 협업을 이끌었습니다.",
        photo: "/flooding/member/bae.png",
        portfolioUrl:
          "https://gold-maize-ae1.notion.site/ML-Engineer-3726eef1fec3808ebd2ec3fc7e00c193",
      },
      {
        name: "조수민",
        role: "Back-end",
        description:
          "프로젝트의 설계부터 마이그레이션·배포·장애 대응까지 개발 전반에 참여하며 팀을 이끌어왔습니다. 프로젝트 리더로서 팀원 온보딩 등을 주도했습니다.",
        photo: "/flooding/member/sumin.png",
        portfolioUrl:
          "https://branched-newsstand-c00.notion.site/2df9ac344dbb80168fc0e8114efbd30a",
      },
    ],
  },
  {
    id: 7,
    name: "풀악셀",
    teamName: "정현태의 블랙박스",
    logo: "/fullaccel/fullaccel-logo.png",
    siteUrl:
      "https://drive.google.com/file/d/1471qsGjPm3lT75lKtC_4mpCwys2RDxzn/view?usp=sharing",
    leader: "최민준",
    demoVideoUrl: "/fullaccel/fullaccel-video.mp4",
    description:
      "현실감 넘치는 운전 연수 시뮬레이터\n\n" +
      "처음으로 하드웨어와 연동되는 시뮬레이터를 완성시켜 만족감과 성취감이 있었다",
    features: [
      {
        title: "하드웨어 기기를 통한 조작",
        description: "",
      },
      {
        title: "도로 교통법 반영",
        description: "",
      },
      {
        title: "튜토리얼로 운전 방법 학습 가능",
        description: "",
      },
      {
        title: "실제 운전환경 경험 가능",
        description: "",
      },
    ],
    members: [
      {
        name: "최민준",
        role: "Client",
        description: "클라이언트 개발 전반\n튜토리얼,엔진,맵 등",
        photo: "/fullaccel/member/minjun.png",
      },
      {
        name: "서정민",
        role: "QA",
        description: "하드웨어와 시뮬레이션 연동테스트",
        photo: "/fullaccel/member/jungmin.png",
      },
      {
        name: "서우주",
        role: "HardWare",
        description: "페달 및 기어봉 설계, 제작",
        photo: "/fullaccel/member/uju.png",
      },
      {
        name: "정세준",
        role: "HardWare",
        description: "핸들 설계, 제작 및 라즈베리파이 코딩 전반",
        photo: "/fullaccel/member/sejun.png",
      },
      {
        name: "정현태",
        role: "PM",
        description: "맵 설계 및 운전 자문",
        photo: "/fullaccel/member/tae.png",
      },
    ],
  },
  {
    id: 8,
    name: "따잇",
    teamName: "오일공부",
    logo: "/daic/daic-logo.png",
    demoVideoUrl: "/daic/daic-video.mp4",
    description:
      "자격증 정보를 한 곳에서!\n\n" +
      "사용자가 학습 목표를 설정하고, 진행 상황을 관리 하며, 커뮤니티를 통해\n" +
      "다른 학습자들과 경험을 공유할 수 있는 웹 애플리케이션입니다.",
    features: [
      {
        title: "자격증 정보 조회",
        description: "자격증 검색, 카테고리 조회, 시험 일정 확인.",
      },
      {
        title: "스터디 그룹 이용",
        description: "합격자의 합격 팁 공유, 학습 진척도 확인 가능",
      },
      {
        title: "학습 계획 작성",
        description: "개인 학습 계획 만들기 및 일정 별 학습 내용 관리.",
      },
      {
        title: "커뮤니티 이용",
        description: "질문 공유 및 사용자 간 자유로운 소통.",
      },
      {
        title: "자격증 인증 신청",
        description: "취득 자격증 PDF 업로드 후 인증 요청.",
      },
      {
        title: "인증 완료",
        description: "승인된 자격증은 마이 페이지와 프로필에서 확인 가능.",
      },
    ],
    members: [
      {
        name: "이서희",
        role: "Back-end",
        description:
          "일정 정리 및 활동 공유\n회원 가입 및 로그인,\n커뮤니티, 마이 페이지 개발",
        photo: "/daic/member/suh.png",
      },
      {
        name: "정하진",
        role: "Design, Front-end",
        description: "디자인 구성/프로젝트 관리\n마이 페이지 개발",
        photo: "/daic/member/hajin.png",
      },
      {
        name: "송정연",
        role: "Back-end QA",
        description: "프로젝트 보안성 강화\n메인, 스터디,\n플랜 페이지 개발",
        photo: "/daic/member/jungyen.png",
      },
      {
        name: "이서준",
        role: "Front-end",
        description: "회의록 작성\n메인, 스터디 페이지 개발",
        photo: "/daic/member/sujun.png",
      },
      {
        name: "주여진",
        role: "Design Front-end",
        description: "디자인 구성/프로젝트 관리\n커뮤니티 페이지 개발",
        photo: "/daic/member/juyjin.png",
      },
      {
        name: "함성우",
        role: "Front-end",
        description: "회원 가입 및 로그인,\n플랜 페이지 개발",
        photo: "/daic/member/sungu.png",
      },
    ],
  },
  {
    id: 9,
    name: "판타지 키우기",
    teamName: "낭만실현부",
    logo: "/fantasy/fantasy.png",
    logoBg: "#000000",
    demoVideoUrl: "/fantasy/fantasy-video.mp4",
    description:
      "자신만의 빌드로 성장하는 방치형 RPG\n\n" +
      "플레이어가 캐릭터의 직업 • 무기 • 스킬 트리를 조합해 자신만의 빌드를 만들고, 던전을 자동으로 진행하며 성장하는 방치형 RPG 게임입니다.\n\n" +
      "저희 팀 ‘낭만실현부’는 이름에 맞는 게임을 만들기 위해 함께 노력합니다.",
    features: [
      {
        title: "자유로운 빌드 선택",
        description: "직업·무기·스킬을 조합하라!",
      },
      {
        title: "다양한 던전 콘텐츠",
        description: "다양한 보상을 획득하라!",
      },
    ],
    members: [
      {
        name: "문승덕",
        role: "PM",
        description: "게임 기획 및 계획서 작성",
        photo: "/fantasy/member/seng.png",
      },
      {
        name: "박현민",
        role: "SERVER",
        description: "서버 개발 및 연동, 게임 기획",
        photo: "/fantasy/member/pack.png",
      },
      {
        name: "이시우",
        role: "CLIENT",
        description: "UI, 전투 시스템, 플레이어와 적 구현",
        photo: "/fantasy/member/siu.png",
      },
      {
        name: "장경훈",
        role: "CLIENT",
        description: "서버연동, 상점 구현",
        photo: "/fantasy/member/hun.png",
      },
      {
        name: "이평강",
        role: "CLIENT",
        description: "합성 시스템, 각성 시스템 구현",
        photo: "/fantasy/member/kang.png",
      },
      {
        name: "정창진",
        role: "CLIENT",
        description:
          "재화 시스템 구축, 던전 시스템 구현, 게임 루프 연결, 튜토리얼 제작",
        photo: "/fantasy/member/kangjin.png",
      },
    ],
  },
  {
    id: 10,
    name: "NOCHU",
    teamName: "한승일",
    tagline: "AI 감정분석 기반 사용자 맞춤 노래 추천 애플리케이션",
    logo: "/nochu/nochu-logo.png",
    logoBg: "#ffffff",
    leader: "박정우",
    heroBg: "#f5f5f7", // 사진 배너 배경 — 밝은 톤(글자색 자동으로 어둡게 전환)
    // 시연 영상 대신 앱 스크린샷으로 소개
    photos: [
      "/nochu/nochu1.png",
      "/nochu/nochu2.png",
      "/nochu/nochu3.png",
      "/nochu/nochu4.png",
    ],
    description:
      "AI가 감정을 읽고, 음악으로 답합니다.\n\n" +
      "카메라로 얼굴 표정을 분석해 감정을 파악하고, 개인 취향에 최적화된 노래를 " +
      "자동으로 추천하는 AI 기반 음악 추천 앱 NOCHU입니다.",
    features: [
      {
        title: "얼굴 표정 인식 감정 분석",
        description: "얼굴 감정 인식 모델을 통한 4가지 감정 분류",
      },
      {
        title: "감정 상태 기반 개인 맞춤형 노래 자동 추천",
        description: "감정별 음악 DB 매칭 및 협업 필터링 알고리즘",
      },
      {
        title: "Spotify API 연동 및 원터치 재생",
        description: "주요 스트리밍 플랫폼 바로 연결",
      },
      {
        title: "감정 이력 기록 및 통계 시각화",
        description: "일 • 주 • 월별 감정 변화 차트 및 음악 취향 분석 제공",
      },
    ],
    members: [
      {
        name: "박정우",
        role: "PM",
        description:
          "프로젝트 기획 및 일정 관리, 요구사항 정의, 팀 내 커뮤니케이션 총괄, 품질 검수",
        photo: "/nochu/member/jungu.png",
      },
      {
        name: "임지훈",
        role: "DevOps",
        description:
          "클라우드 인프라 구축, CI/CD 파이프라인 설계, 서버 배포 자동화 및 성능 최적화",
        photo: "/nochu/member/imjihun.png",
      },
      {
        name: "조수민",
        role: "Back-end",
        description:
          "REST API 설계 및 구현, 데이터베이스 설계, 음악 추천 서버 로직 개발 및 유지보수",
        photo: "/nochu/member/josumin.png",
      },
      {
        name: "배용빈",
        role: "AI",
        description:
          "AI 감정 인식 모델(YOLO-NAS, ResNet, EfficientNet, MobileNet) 성능 비교 기반 음악 추천 알고리즘 개발",
        photo: "/nochu/member/bin.png",
      },
      {
        name: "박승일",
        role: "AI",
        description:
          "AI 음악 데이터 수집 • 전처리, AI 모델 배포 및 프롬프트 엔지니어링",
        photo: "/nochu/member/packseng.png",
      },
      {
        name: "김재관",
        role: "Android",
        description:
          "Android 앱 UI/UX 개발, 감정 분석 화면 및 음악 추천 뷰 구현, Spotify API 연동",
        photo: "/nochu/member/jae.png",
      },
      {
        name: "전선우",
        role: "Android",
        description:
          "Android 앱 아키텍처 설계, 음악 플레이어 기능 개발, 사용자 통계 화면 및 UX 개선",
        photo: "/nochu/member/sunu.png",
      },
    ],
  },
  {
    id: 11,
    name: "FinLightAI",
    teamName: "모자이크",
    tagline: "뉴스와 시장 반응을 함께 읽는 AI 금융 상황판",
    logo: "/finlightai/finlightai-logo.png",
    demoVideoUrl: "/finlightai/finlightai-video.mp4",
    description:
      "금융 뉴스를 읽고, 시장의 신호를 밝힙니다.\n\n" +
      "FinLightAI는 금융 뉴스의 신뢰도 • 관련성 • 감성과 시장 반응을 함께 분석해, " +
      "현재 시장 상태를 RED / YELLOW / GREEN 신호와 근거로 보여주는 AI 금융 상황판입니다.",
    features: [
      {
        title: "뉴스 • 시장 데이터 수집",
        description: "금융 뉴스와 시장 데이터를 수집해 DB에 저장",
      },
      {
        title: "뉴스 다차원 분석",
        description: "뉴스 신뢰도 • 감정 • 이벤트 점수 분석",
      },
      {
        title: "시장 신호 시각화",
        description: "시장 상태를 RED / YELLOW / GREEN 신호로 시각화",
      },
      {
        title: "AI 브리핑",
        description: "오늘의 시장 흐름과 핵심 근거 요약",
      },
      {
        title: "뉴스 가드",
        description: "신뢰 • 주의 • 차단 뉴스 분류",
      },
      {
        title: "산업 • 자산 리스크 확인",
        description: "산업 영향도와 관심 자산 리스크 확인",
      },
    ],
    members: [
      {
        name: "허태희",
        role: "PM · Data Analysis",
        description:
          "프로젝트 총괄과 데이터 분석을 맡아 FinLightAI의 기획 방향, 분석 구조, 시장 신호 체계를 설계하였습니다.",
        photo: "/finlightai/member/taeh.png",
      },
      {
        name: "이산",
        role: "Financial Analyst",
        description:
          "금융 분석을 맡아 AI • 반도체 • 정책 뉴스가 시장과 산업에 미치는 영향을 조사하고 정리하였습니다.",
        photo: "/finlightai/member/isan.png",
      },
      {
        name: "이영서",
        role: "QA",
        description:
          "품질 관리를 맡아 주요 기능과 화면이 기획 의도에 맞게 구현되었는지 검수하였습니다.",
        photo: "/finlightai/member/leeyeng.png",
      },
      {
        name: "한승재",
        role: "QA",
        description:
          "품질 관리를 맡아 사용자 흐름, 신호 표현, 데이터 표시 방식의 오류와 개선점을 점검하였습니다.",
        photo: "/finlightai/member/sengjae.png",
      },
      {
        name: "허은서",
        role: "Design",
        description:
          "디자인을 맡아 FinLightAI의 대시보드 화면 구성과 신호등 기반 시각 표현을 설계하였습니다.",
        photo: "/finlightai/member/ensu.png",
      },
      {
        name: "김명현",
        role: "QA",
        description:
          "품질 관리를 맡아 로그인, 포트폴리오, 설정 등 사용자 기능의 동작과 연관성을 검토하였습니다.",
        photo: "/finlightai/member/hun.png",
      },
      {
        name: "임시현",
        role: "Financial Analyst",
        description:
          "금융 분석을 맡아 뉴스와 시장 데이터의 관계를 해석하고 산업별 영향 근거를 정리하였습니다.",
        photo: "/finlightai/member/imsi.png",
      },
    ],
  },
  {
    id: 12,
    name: "꿀통",
    teamName: "더모먼트",
    tagline: "학교 생활 속 사진과 추억을 기록하는 디지털 아카이브",
    logo: "/honey/honey-logo.png",
    logoBg: "#ffffff",
    demoVideoUrl: "/honey/honey-video.mp4",
    description:
      "추억을 담다, 마음을 잇다.\n\n" +
      "학교 생활 중 찍은 움짤을 업로드하고, 태그를 통해 원하는 순간을 쉽게 " +
      "검색 • 공유할 수 있는 아카이빙 서비스입니다.",
    features: [
      {
        title: "태그 기반 분류",
        description: "태그로 추억을 체계적으로 분류하고 관리",
      },
      {
        title: "빠른 검색",
        description: "원하는 사진과 게시물을 빠르게 찾는 검색 기능",
      },
      {
        title: "AI 맞춤 추천",
        description: "AI 기반 맞춤형 추억 및 콘텐츠 추천",
      },
      {
        title: "학교 행사 아카이빙",
        description: "학교 행사 • 동아리 • 학급별 추억 기록 지원",
      },
      {
        title: "간편한 공유",
        description: "학생 간 사진과 추억을 손쉽게 공유하는 환경 제공",
      },
      {
        title: "졸업 후에도 보관",
        description: "졸업 후에도 학교의 추억을 지속적으로 보관 및 열람",
      },
    ],
    members: [
      {
        name: "정효주",
        role: "PM",
        description:
          "프로젝트 기획, 일정 관리, 요구사항 정의 및 팀 협업 총괄을 맡았습니다.",
        photo: "/honey/member/huju.png",
      },
      {
        name: "이세민",
        role: "Back-end",
        description: "서버 및 데이터베이스 설계, API 개발을 담당했습니다.",
        photo: "/honey/member/semin.png",
      },
      {
        name: "김태은",
        role: "Back-end",
        description:
          "CI/CD 파이프라인 구축, 서버 및 데이터베이스 배포를 담당했습니다.",
        photo: "/honey/member/taeen.png",
      },
      {
        name: "서경주",
        role: "Design",
        description:
          "UI/UX 설계, 프로토타입 및 디자인 시스템 제작, 포스터 및 발표자료 제작을 맡았습니다.",
        photo: "/honey/member/gengju.png",
      },
      {
        name: "이상혁",
        role: "Front-end",
        description:
          "검색 • 업로드 등 주요 기능 구현 및 사용자 경험 개선을 담당했습니다.",
        photo: "/honey/member/leesang.png",
      },
      {
        name: "전준연",
        role: "Front-end",
        description: "사용자 화면(UI) 구현 및 API 연동을 담당했습니다.",
        photo: "/honey/member/jun.png",
      },
    ],
  },
  {
    id: 13,
    name: "취준",
    teamName: "조업 (조기 취업)",
    tagline: "학생 • 선생님을 위한 온라인 클래스 코딩 테스트 사이트",
    logo: "/job/job-logo.png",
    logoBg: "#ffffff",
    demoVideoUrl: "/job/job-video.mp4",
    description:
      "교내 전용 코딩테스트, 취준\n\n" +
      "학생과 선생님을 위한 온라인 클래스 기반 코딩 테스트 사이트입니다.",
    features: [
      {
        title: "코딩테스트",
        description: "기본 코딩테스트 학습 가능",
      },
      {
        title: "학급",
        description: "학급에 들어가 과제 작성 & 학생 관리",
      },
      {
        title: "랭킹",
        description: "학급 내의 다양한 랭킹으로 동기부여",
      },
    ],
    members: [
      {
        name: "김준혁",
        role: "Front-end",
        description:
          "좋은 개발자 경험이 좋은 사용자 경험을 만든다는 원칙으로 설계부터 유지보수까지 참여해온 프론트엔드 개발자입니다. 파트리더로서 타 직군과 협업하며 프론트엔드 전반을 책임졌고, WASM 기반 Pyodide로 브라우저에서 코드를 실행 • 채점하는 기능을 개발했습니다.",
        photo: "/job/member/kimjun.png",
        portfolioUrl:
          "https://drive.google.com/file/d/1bWqnI9zWXehSDPLbHOML1x1UIoYcKY0q/view",
      },
      {
        name: "이준건",
        role: "Front-end",
        description:
          "에러 페이지와 학급 페이지처럼 사용자 흐름에 맞닿는 화면을 중심으로, 구조 설계부터 구현, 유지보수까지 맡아온 프론트엔드 개발자입니다. 사용성이 흔들리지 않도록 예외 상황과 주요 화면 경험을 다듬는 데 집중하며 서비스 완성도를 높였습니다.",
        photo: "/job/member/jungun.png",
        portfolioUrl: "https://github.com/tlrdmsEjrqhRdl",
      },
      {
        name: "임한솔",
        role: "Back-end",
        description:
          "전반적인 서버 개발을 혼자 맡으며 문제 제출, 문제, 학급 그룹 등의 백엔드 기능 개발을 담당했습니다.",
        photo: "/job/member/hansol.png",
        portfolioUrl: "https://github.com/h-x0-i1",
      },
      {
        name: "박찬울",
        role: "DevOps",
        description:
          "서버 구축부터 배포 자동화, 모니터링, 백업까지 설계하는 DevOps 엔지니어입니다. 컨테이너 기반 운영 환경을 구축하고, Ansible과 GitHub Actions를 활용해 구축 및 배포를 자동화하며 안정적인 운영 환경을 만드는 데 집중했습니다.",
        photo: "/job/member/ul.png",
        portfolioUrl:
          "https://drive.google.com/file/d/1fi7jgx1bGtW3dZV4H7K2am8wwSc-_Ics/view",
      },
      {
        name: "박서현",
        role: "PM · Design",
        description:
          "이번 프로젝트에서 PM과 디자인 역할을 담당했습니다. 사용자 편의성을 고려해 UI/UX를 설계했으며, PM으로서 팀원들과 소통하며 일정 관리와 의견 조율을 통해 프로젝트를 원활하게 진행했습니다.",
        photo: "/job/member/packsu.png",
        portfolioUrl: "https://github.com/mikao4869",
      },
      {
        name: "유은서",
        role: "UI/UX",
        description:
          "디자이너로서 프로젝트에 참여하여 전체적인 UI/UX와 웹페이지의 부분적인 기획을 맡았습니다. 팀원들과 의견을 공유하며 어떻게 하면 사용자에게 더 좋은 경험을 전달할 수 있을지 고민하며 웹을 디자인했습니다.",
        photo: "/job/member/ensu.png",
        portfolioUrl: "https://github.com/azukeun",
      },
    ],
  },
  {
    id: 14,
    name: "혼돈의 체스",
    teamName: "8x8 Labs",
    tagline: "스킬 카드를 활용하는 체스 로그라이크 게임",
    logo: "/chess/chess-logo.png",
    siteUrl: "https://www.youtube.com/watch?v=7iQ2su9TN_Q",
    leader: "이시우",
    demoVideoUrl: "/chess/chess-video.mp4",
    videoFit: "contain", // 세로형 게임 영상 — 전체 표시(좌우 여백)
    description:
      "수많은 도전과 실패로 얻은 경험\n\n" +
      "규모 있는 프로젝트를 분업으로 진행하며 팀원들과 끊임없이 소통하고 의견을 조율하는 법을 배웠습니다. " +
      "서로 다른 기술과 아이디어를 하나의 결과물로 모으며 협업의 본질을 체감했습니다. " +
      "이 경험은 제 작업 방식을 돌아보고 다음 프로젝트의 방향을 정립하는 계기가 되었으며, " +
      "나아가 결과물을 실제 소비자에게 선보이는 것까지 목표로 삼게 되었습니다.",
    features: [],
    members: [
      {
        name: "이시우",
        role: "Leader · CLIENT · PM",
        description:
          "Unity와 C#, C++를 기반으로 게임 개발에 필요한 도구와 시스템을 설계하고 구축해왔습니다. 하나의 기술에만 의존하기보다 여러 기술을 상황에 맞게 접목하는 것을 중요하게 생각하며, 다양한 플랫폼에서 개발하며 각 플랫폼의 제약 조건에 맞는 설계 역량을 쌓아왔습니다. 기술보다 “이것이 사용자 경험에 어떤 도움이 되는가”를 우선 순위로 두고 최적의 해결책을 찾는 개발자가 되고자 합니다.",
        photo: "/chess/member/siu.png",
        email: "leesiuuuu1@gmail.com",
        phone: "010-4175-7616",
      },
      {
        name: "정예빈",
        role: "CLIENT",
        description:
          "Unity와 C# 기반 게임 클라이언트 개발을 공부하며, 플레이어 경험을 중심에 둔 구현을 지향합니다. 백준 문제 풀이로 알고리즘적 사고력을 기르고, 개발 중 마주하는 문제를 분석 • 개선하는 경험을 쌓아왔습니다. 기능 구현을 넘어 플레이어가 자연스럽게 이해하고 사용할 수 있는 게임을 만드는 개발자로 성장하고 있습니다.",
        photo: "/chess/member/bin.png",
        email: "s25031@gsm.hs.kr",
        phone: "010-5351-5076",
      },
      {
        name: "박시온",
        role: "Composer",
        description:
          "Reaper와 Vital을 활용해 게임에 어울리는 BGM, Foley Sound, SFX를 제작하며, 뻔하거나 과한 기교 없이 게임과 조화를 이루는 사운드를 지향합니다. 웨이브테이블 신디사이저 훈련을 통해 적합한 사운드를 만드는 역량을 지속적으로 키우고 있습니다. 궁극적으로 다수에게 감동을 주는 사운드 디자이너가 되기를 목표로 학습하고 있습니다.",
        photo: "/chess/member/sion.png",
        email: "sxonoiz@gmail.com",
        phone: "010-2459-4805",
      },
    ],
  },
  {
    id: 15,
    name: "光탈페",
    teamName: "스타트업",
    tagline:
      "光탈페, 너의 꿈을 펼쳐봐\n\n" +
      "여러 도메인을 각자 맡아 진행하며 팀원들과 부딪히고 맞춰가는 과정 자체가 즐거웠던 프로젝트였습니다. " +
      "서로의 코드를 리뷰하며 함께 성장했고, 실제 사용자가 쓰는 서비스를 끝까지 완성했다는 뿌듯함이 컸습니다.",
    logo: "/gwangju/gwangju-logo.png",
    logoBg: "#ffffff",
    siteUrl: "https://www.xn--hc0b809dz3b.kr/home",
    leader: "박하민",
    demoVideoUrl: "/gwangju/gwangju-video.mp4",
    description:
      "광주학생탈렌트페스티벌\n\n" +
      "光탈페(광주학생탈렌트페스티벌)는 청소년 오디션 프로그램의 운영 효율성을 높이기 위해 개발한 웹 서비스입니다.",
    features: [
      {
        title: "참가 신청 (Apply)",
        description:
          "대표자가 팀 정보와 공연영상을 제출해 참가 신청. 신청 접수 후 예선 결과를 페이지에서 확인 가능",
      },
      {
        title: "좌석 예매 (Booking)",
        description:
          "관람객이 원하는 좌석을 선택해 예매. 예매 내역은 마이페이지에서 확인",
      },
      {
        title: "심사 (Evaluation / Score)",
        description:
          "심사위원이 참가팀을 평가하고 점수를 부여. 평가 결과는 심사결과 페이지에 공개",
      },
      {
        title: "슬로건 제출 (Slogan)",
        description:
          "누구나 참여 가능한 슬로건 문구 공모. 종료 후 심사를 거쳐 1등 • 2등 • 3등 선정 및 시상",
      },
    ],
    members: [
      {
        name: "박하민",
        role: "Back-end · Leader",
        description:
          "좌석 예매 • 슬로건 • Excel 도메인을 개발하고 프로젝트를 총괄했습니다. 조회 성능 개선을 위해 캐싱을 도입했으며, 가상 스레드 기반 SSE 구조를 적용해 실시간 좌석 상태 동기화의 안정성을 높였습니다. 좌석 중복 예매를 방지하기 위한 상태 검증 로직을 구현하였습니다.",
        photo: "/gwangju/member/hamin.png",
        skills: ["Java", "Spring Boot", "MySQL", "Redis"],
        email: "s25058@gsm.hs.kr",
        portfolioUrl: "https://github.com/cfcromn",
      },
      {
        name: "문강현",
        role: "Front-end",
        description:
          "슬로건 공모전의 팝업 노출, 기간 로직, 유효성 검사, 수상 발표 기능을 개발하고, Vitest 기반 테스트 환경을 도입해 핵심 로직에 대한 단위 테스트를 작성했습니다. GitHub Actions 커버리지 자동화 파이프라인을 구축하고, 인증 API 응답 타입과 Role 값을 팀 전체 코드베이스에 맞게 정규화했습니다.",
        photo: "/gwangju/member/mun.png",
        skills: ["Next.js", "TypeScript", "Tailwind CSS"],
        email: "s25024@gsm.hs.kr",
        portfolioUrl: "https://github.com/g-hyxn",
      },
      {
        name: "박채은",
        role: "DevOps",
        description:
          "DevOps 및 인프라 전반을 담당했습니다. AWS S3에서 Cloudflare R2로 마이그레이션하고 Terraform을 활용한 IaC 구성으로 인프라를 코드로 관리했으며, GitHub Actions 기반 CI/CD 파이프라인을 구축해 개발 • 운영 환경을 분리했습니다. Grafana • Prometheus 모니터링 스택을 도입해 서비스 안정성을 높였습니다.",
        photo: "/gwangju/member/packche.png",
        skills: ["AWS", "Docker", "Kubernetes"],
        email: "s25026@gsm.hs.kr",
        portfolioUrl: "https://github.com/chaeeun-09",
      },
      {
        name: "정종윤",
        role: "Back-end",
        description:
          "좌석 예매 • 슬로건 • Excel 도메인을 개발하고 프로젝트를 총괄했습니다. 조회 성능 개선을 위해 캐싱을 도입했으며, 가상 스레드 기반 SSE 구조를 적용해 실시간 좌석 상태 동기화의 안정성을 높였습니다. 좌석 중복 예매를 방지하기 위한 상태 검증 로직을 구현하였습니다.",
        photo: "/gwangju/member/jungjong.png",
        skills: ["Java", "Spring Boot", "MySQL", "Redis"],
        email: "s25069@gsm.hs.kr",
        portfolioUrl: "https://github.com/jyx-07",
      },
      {
        name: "한국",
        role: "Front-end",
        description:
          "참가 신청 기능을 영상 파일 멀티파트 업로드 방식으로 전환하고, 저장소를 NCP에서 R2로 마이그레이션했으며, 파일 크기 제한 • 이메일 XSS 방지 • 미리보기 메모리 누수 수정 등 안정성을 함께 챙겼습니다. SSE 통신에서는 탭 비활성화 • 오프라인 상태의 중복 재연결을 방지하는 로직을 구현해 실시간 연결을 안정화했습니다.",
        photo: "/gwangju/member/han.png",
        skills: ["Next.js", "TypeScript", "Tailwind CSS"],
        email: "s25017@gsm.hs.kr",
        portfolioUrl: "https://github.com/koreahghg",
      },
    ],
  },
  {
    id: 16,
    name: "COWORK",
    teamName: "cowork",
    logo: "/cowork/cowork-logo.png",
    logoBg: "#ffffff",
    siteUrl: "https://cowork-server-ashy.vercel.app/",
    leader: "류수연",
    demoVideoUrl: "/cowork/cowork-video.mp4",
    description:
      "학생들이 만드는 협업 관리 플랫폼\n\n" +
      "직접 사용하면서 느낀 불편함을 해결하기 위해 기획부터 참여했고, 사용자 관점에서 기능을 설계하며 개선을 이어갔습니다. " +
      "개발 과정에서 다양한 피드백을 반영해 사용성을 지속적으로 높이며, 서비스는 끊임없는 개선으로 완성된다는 것을 경험했습니다.",
    features: [
      {
        title: "프로젝트 관리",
        description:
          "GitHub와 긴밀하게 연결되어 프로젝트와 업무를 한곳에서 체계적으로 관리할 수 있습니다.",
      },
      {
        title: "실시간 채팅",
        description:
          "채널 기반 채팅을 통해 팀원들과 빠르게 소통할 수 있습니다.",
      },
      {
        title: "회의록 관리",
        description:
          "회의 내용을 기록하고 팀원들과 공유하여 의사결정을 체계적으로 관리할 수 있습니다.",
      },
      {
        title: "이슈 관리",
        description:
          "프로젝트 이슈를 등록하고 진행 상황을 효율적으로 관리할 수 있습니다.",
      },
    ],
    members: [
      {
        name: "김성찬",
        role: "SERVER",
        description:
          "Kotlin과 Spring Boot로 다루기 쉽고 튼튼한 백엔드 서버와 핵심 기능을 만들었습니다. 코드를 구조 있게 작성해 재사용과 관리가 편하도록 설계하였고, 에러 처리와 데이터 연결을 깔끔하게 하여 프론트엔드와 매끄럽게 연동되는 개발 환경을 완성했습니다.",
        photo: "/cowork/member/sungkan.png",
        skills: ["Gin", "Java", "Spring Boot"],
        portfolioUrl: "https://github.com/kimseongchan0914",
      },
      {
        name: "배재현",
        role: "SERVER",
        description:
          "Kotlin 기반 Spring Boot를 사용하여 프로젝트 기능 관리를 위한 팀 모듈을 구현하였습니다. 그 외에도 ktlint 포맷터 설정을 추가하여 100+개 파일의 코드 일관성을 맞추고, 중복된 코드를 검토 후 별도의 함수를 직접 정의하였습니다.",
        photo: "/cowork/member/bae.png",
        skills: ["Kotlin", "Ktlint", "Spring Boot"],
        email: "roblery128@gmail.com",
        portfolioUrl: "https://github.com/ZaMan0806",
      },
      {
        name: "정종윤",
        role: "SERVER",
        description:
          "실시간 메시징(스레드 • 멘션 • 반응 • 고정 • 읽음 상태)과 Elasticsearch / GraphQL 검색, 파일 연동 등 채팅 핵심 기능을 구현하고, 인증 • 로깅 • 모니터링 • 알림 인프라를 갖추면서 보안 취약점 수정과 ESLint 기반 코드 품질 개선까지 진행했습니다.",
        photo: "/cowork/member/jong.png",
        skills: ["NestJS", "MongoDB", "WebSocket"],
        email: "ymy8554@gmail.com",
        portfolioUrl: "https://github.com/jyx-07",
      },
      {
        name: "류수연",
        role: "APP",
        description:
          "Flutter 기반으로 모바일 앱을 개발하며 상태 관리를 위해 Riverpod을 활용하였습니다. 구조적인 상태 관리 설계를 통해 코드의 안정성과 확장성을 높이고, 향후 유지보수를 고려하여 앱 구조를 구현하였습니다. 이를 바탕으로 사용자 경험을 고려한 기능 중심의 앱 개발을 진행하였습니다.",
        photo: "/cowork/member/rusu.png",
        skills: ["Flutter", "Dart", "Riverpod"],
        email: "suehng08231@gmail.com",
        portfolioUrl: "https://github.com/ryusuye0n",
      },
      {
        name: "이주언",
        role: "APP",
        description:
          "Flutter로 Cowork 협업 모바일 앱을 개발하며 사용자 중심의 기능을 구현했습니다. 팀 협업과 작업 관리 경험을 고려해 UI/UX를 설계하고 기능을 구성했으며, 서비스 구조를 안정적으로 유지할 수 있도록 개발을 진행했습니다. 이를 통해 실제 사용성을 고려한 앱 개발 과정을 경험했습니다.",
        photo: "/cowork/member/juun.png",
        skills: ["Flutter", "Dart"],
        portfolioUrl: "https://github.com/aiden30015",
      },
      {
        name: "김준혁",
        role: "Front-end",
        description:
          "React, TypeScript를 사용하여 프론트엔드를 개발하고 Rsbuild 환경을 적용해 프로젝트 구조를 최적화하였습니다. 컴포넌트 기반 설계를 통해 재사용성과 유지보수성을 높이고, 백엔드와의 연동을 고려한 화면 구조를 구현하였습니다.",
        photo: "/cowork/member/kimjun.png",
        skills: ["TypeScript", "React", "Rsbuild"],
        portfolioUrl:
          "https://drive.google.com/file/d/1bWqnI9zWXehSDPLbHOML1x1UIoYcKY0q/view",
      },
      {
        name: "박채은",
        role: "DevOps",
        description:
          "cowork config, cowork gateway, cowork authorization, cowork user 총 4개 서비스와 MySQL, PostgreSQL, MongoDB, Kafka, Redis, Elasticsearch, MinIO, LiveKit, Vault 인프라를 배포하였습니다. Vault 시크릿 초기화 및 각 서비스 환경변수 세팅까지 마무리하였습니다.",
        photo: "/cowork/member/cheun.png",
        skills: ["Docker", "MSA"],
        email: "s25026@gsm.hs.kr",
        portfolioUrl: "https://github.com/chaeeun-09",
      },
    ],
  },
  {
    id: 17,
    name: "Ready, GSM",
    teamName: "ENT(더모먼트)",
    logo: "/readygsm/readygsm-logo.png",
    logoBg: "#ffffff",
    siteUrl: "https://www.ready.hellogsm.kr",
    leader: "김유찬",
    demoVideoUrl: "/readygsm/readygsm-video.mp4",
    description:
      "광주소프트웨어마이스터고등학교 학과 체험 신청 서비스\n\n" +
      "Ready, GSM은 광주소프트웨어마이스터고 학과 체험 신청을 위해 더모먼트가 개발한 웹 플랫폼입니다. " +
      "프로그램 조회부터 신청 • 조회 • FAQ까지 전 과정을 소셜 로그인 기반으로 제공합니다. " +
      "지원자는 원하는 체험 프로그램을 선택해 신청하고, 이후 신청 내역을 조회할 수 있습니다.",
    features: [
      {
        title: "학과 체험 정보 확인",
        description: "학과 체험을 생성하고, 수정하고, 삭제할 수 있습니다.",
      },
      {
        title: "학과 체험 신청 • 취소",
        description: "학과 체험을 신청하고 취소할 수 있습니다.",
      },
      {
        title: "신청자 정보 조회 • 관리",
        description:
          "학과 체험에 신청한 사람들의 정보를 조회하고, 관리자 권한으로 신청을 취소할 수 있습니다.",
      },
      {
        title: "학과 체험 예비 신청",
        description: "정원이 가득 찬 학과 체험에 예비로 신청할 수 있습니다.",
      },
    ],
    members: [
      {
        name: "김유찬",
        role: "PO · Design",
        description:
          "서비스 이용 타겟(중 • 고등학생)의 연령대와 디지털 리터러시 수준을 고려해 전체 UI/UX를 설계하고, 직관적인 정보 구조와 친숙한 인터랙션 패턴을 적용해 사용성 및 접근성 향상에 기여했습니다.",
      },
      {
        name: "정연돈",
        role: "",
        description:
          "신청 플로우 전 과정(폼 설계 → 유효성 검증 → 제출 처리)을 구현하고, 디자인 시스템 기반으로 컴포넌트를 재사용 가능하게 구조화하여 개발 효율성을 확보했습니다.",
      },
      {
        name: "김서연",
        role: "",
        description:
          "소셜 로그인 기반 인증 시스템을 설계 • 구현하고, 토큰 발급/갱신 로직 및 세션 관리를 통해 안전하고 끊김 없는 로그인 경험을 제공했습니다. 관리자가 학과 체험 프로그램을 직접 등록/관리할 수 있는 어드민 기능을 기획부터 구현까지 담당했습니다.",
      },
      {
        name: "정효주",
        role: "",
        description:
          "기획-개발-QA 간 커뮤니케이션 창구 역할을 하며 이슈 트래킹 및 우선순위 조율을 담당했습니다.",
      },
      {
        name: "이상혁",
        role: "",
        description:
          "기획-QA 2개 파트를 오가며 이슈 트래킹 보드를 관리하고 우선순위를 조율해, 파트 간 정보 비대칭으로 인한 개발 지연을 최소화했습니다.",
      },
      {
        name: "홍지민",
        role: "",
        description:
          "Pulumi IaC 기반 AWS 프로덕션 배포 환경 구성하였으며, CORS/HTTPS 설정 및 CI/CD 자동화로 배포 파이프라인 확립, 예비신청 승격 로직 및 Discord 에러 알림 시스템까지 운영 전반을 담당했습니다.",
      },
      {
        name: "김태은",
        role: "",
        description:
          "예약 생성/조회/변경/취소 등 핵심 도메인 로직을 API로 설계 • 구현하고, 동시성 이슈(중복 예약 방지) 및 예외 케이스를 고려한 API 구조 설계로 서비스 안정성을 확보했습니다. API 전반에 대한 자동화 테스트 환경을 구축했습니다.",
      },
    ],
  },
  {
    id: 18,
    name: "Hello, GSM",
    teamName: "MOM(더모먼트)",
    logo: "/hellogsm/hellogsm-logo.png",
    logoBg: "#ffffff",
    siteUrl: "https://www.hellogsm.kr/",
    leader: "전준연",
    demoVideoUrl: "/hellogsm/hellogsm-video.mp4",
    description: "광주소프트웨어마이스터고등학교 입학지원 서비스",
    features: [
      {
        title: "온라인 원서 접수",
        description:
          "지원서 작성부터 증빙 서류 제출까지 입학 절차를 온라인으로 진행할 수 있습니다.",
      },
      {
        title: "합격자 발표",
        description:
          "1차 • 최종 합격 여부를 서비스 내에서 즉시 확인할 수 있습니다.",
      },
      {
        title: "성적 산출",
        description:
          "중학교 성적을 입력하면 입학 전형 기준에 맞춰 자동으로 환산 점수를 계산합니다.",
      },
      {
        title: "지원자 관리",
        description:
          "서비스 내에서 지원자에 대해 원서 수정 관리, 성적 수정, 수험표 출력, 엑셀 출력이 가능합니다.",
      },
    ],
    members: [
      {
        name: "홍지민",
        role: "PO",
        description:
          "인적사항 수정 API 설계 및 구현, Redis 캐시 역직렬화 오류 수정, 성적 관련 버그 수정 다수(NPE, 필드 누락, 자유학기 복사값 노출 등)를 담당했습니다. OAuth redirect_uri 검증 추가, 세션 쿠키 도메인 환경변수화, Claude Code 인프라 초기 구성을 진행했습니다.",
      },
      {
        name: "김유찬",
        role: "",
        description:
          "서비스 디자인 파일 전체를 리팩토링하고, 네이밍 규칙 정립과 컴포넌트/토큰 구조 재정비를 통해 UX 일관성을 확보하며 디자이너-개발자 간 협업 효율성 향상에 기여했습니다.",
      },
      {
        name: "정연돈",
        role: "",
        description:
          "기존 하드코딩된 redirectUri 구조를 환경(로컬/스테이징/프로덕션)별로 동적 분기 처리하도록 리팩토링했습니다. 배포 환경 전환 시 발생하던 인증 오류를 근본적으로 해결하고 배포 안정성 향상에 기여했습니다.",
      },
      {
        name: "김서연",
        role: "",
        description:
          "원서 작성 단계에서 회원가입 시 입력한 이름, 생년월일, 성별을 직접 수정할 수 있도록 인적사항 편집 기능을 구현했습니다. 비용 절감을 위해 프론트엔드(client/admin)를 AWS(EC2/ECR 기반 Docker 배포)에서 Vercel로 이전하기 위한 사전 정리 작업을 진행하고, 더 이상 필요하지 않은 Docker 빌드 파일과 AWS 기반 CI/CD 워크플로우를 식별해 제거했습니다.",
      },
      {
        name: "배재현",
        role: "",
        description:
          "원서 수정 권한 요청 기능을 구현하고 검색 필터를 개선했으며, SecurityConfig 권한 구조를 리팩터링했습니다.",
      },
      {
        name: "이상혁",
        role: "",
        description:
          "원서 수정 권한 요청 기능과 원서 작성 시 사용자 피드백 기능을 구현했습니다.",
      },
      {
        name: "전준연",
        role: "",
        description:
          "OAuth 로그인 플로우 개선, 원서 작성 중 페이지 이탈 방지 기능 구현 등 UX를 개선했습니다. Turborepo 기반 모노레포 마이그레이션으로 DX를 개선하고, Notion Database 기반 데이터 관리 구조 개선을 통해 운영 효율을 높였습니다.",
      },
    ],
  },
  {
    id: 19,
    name: "인삼",
    teamName: "인삼",
    logo: "/ginseng/ginseng-logo.png",
    logoBg: "#ffffff",
    leader: "김동현",
    demoVideoUrl: "/ginseng/ginseng-video.mp4",
    description:
      "실시간으로 확인하는 스마트 화분\n\n" +
      "선배님들이 개발한 인삼은 다양한 기능을 갖추고 있었지만, 크기가 크고 배터리 사용 시간이 짧다는 아쉬운 점이 있었습니다. " +
      "이에 인삼 V2는 꼭 필요한 기능만 적용하여 제품의 크기를 줄이고, 배터리 사용 시간을 늘리는 것을 목표로 개발했습니다. " +
      "기존 프로젝트를 이어받아 부족한 부분을 개선하고 저만의 아이디어를 반영하는 과정에서 많은 것을 배울 수 있었으며, " +
      "프로젝트를 한 단계 발전시키는 의미 있는 경험이었습니다.",
    features: [
      {
        title: "실시간 토양 습도 모니터링",
        description: "",
      },
      {
        title: "실시간 원격 모니터링",
        description: "",
      },
      {
        title: "전력 최적화",
        description: "",
      },
    ],
    members: [
      {
        name: "채성원",
        role: "IOT · Back-end",
        description:
          "저는 백엔드 기술을 활용한 웹 개발뿐만 아니라 IoT와 연계한 다양한 프로젝트를 진행해 온 개발자입니다. 각종 센서와 백엔드 기술을 결합하여 원격 제어 시스템을 구현하며 경험을 쌓아왔고, 최종적으로는 사용자가 편리함을 체감할 수 있는 제품을 만드는 것을 목표로 하고 있습니다.",
        photo: "/ginseng/member/sung.png",
        skills: ["Arduino", "Java", "Spring Boot"],
        email: "seongwonchae54@gmail.com",
        phone: "010-6380-9388",
      },
      {
        name: "김동현",
        role: "IOT",
        description:
          "저는 PCB 설계와 IoT 기술을 활용한 임베디드 시스템 개발에 관심을 가지고 다양한 프로젝트를 진행해 왔습니다. 하드웨어와 소프트웨어를 융합하여 사용자가 편리하게 사용할 수 있는 제품을 만드는 것을 목표로 하고 있습니다.",
        photo: "/ginseng/member/dong.png",
        skills: ["Arduino", "ORCAD", "pcd design"],
        email: "kdh1230a@gmail.com",
        phone: "010-4139-6243",
      },
      {
        name: "김민종",
        role: "PM",
        description:
          "저는 프로젝트의 전체 흐름을 이해하고 팀원들과 협업하여 문제를 해결하는 것에 관심이 많습니다. 사용자 중심의 서비스를 기획하고 프로젝트를 성공적으로 이끄는 PM을 목표로 하고 있습니다.",
        photo: "/ginseng/member/minjong.png",
        email: "s24039@gsm.hs.kr",
        phone: "010-2873-0960",
      },
    ],
  },
  {
    id: 20,
    name: "Data GSM",
    teamName: "THE(더모먼트)",
    tagline: "학생 인증·데이터 연동을 위한 OpenAPI & OAuth 플랫폼",
    logo: "/datagsm/datagsm-logo.png",
    siteUrl: "https://datagsm.kr",
    leader: "김태은",
    demoVideoUrl: "/datagsm/datagsm-video.mp4",
    description:
      "광주소프트웨어마이스터고등학교 OpenAPI & OAuth 서비스\n\n" +
      "Data GSM은 광주소프트웨어마이스터고에서 진행되는 프로젝트들이 공통으로 쓰는 학생 인증·데이터 연동 플랫폼입니다. " +
      "OAuth 기반 SSO로 서비스 간 로그인을 일원화하고, 학생 인증 정보를 API로 제공해 개별 서비스의 중복 인증 개발 부담을 줄였습니다. " +
      "신규 서비스 온보딩 시 API 연동만으로 로그인 기능을 확보할 수 있게 설계해 개발 생산성을 높였습니다.",
    features: [
      {
        title: "Open API",
        description:
          "정보 제공에 쓰이는 API 키를 발급받을 수 있습니다. API 키를 통해 학생, 동아리, 프로젝트 등의 데이터를 조회할 수 있는 REST API를 제공합니다.",
      },
      {
        title: "Event",
        description:
          "학생, 동아리, 프로젝트의 정보에서 생기는 변경사항을 외부 서버에 실시간으로 전송해주는 기능입니다. 외부 서버는 이를 통해 변경된 정보가 즉시 반영될 수 있습니다.",
      },
      {
        title: "OAuth",
        description:
          "외부 서비스는 학생이 로그인 시 간편하게 학생 정보를 제공받을 수 있습니다. 학생에게는 DataGSM 계정으로 외부 서비스에 안전한 로그인을 돕습니다.",
      },
    ],
    members: [
      {
        name: "김태은",
        role: "팀장 · Back-end",
        description:
          "DX 경험 개선, 데이터 모델 설계 및 아키텍처 구조 정립을 담당했습니다. OpenAPI & OAuth 기능을 구현하고 기술문서를 작성했습니다.",
      },
      {
        name: "배재현",
        role: "Back-end",
        description:
          "웹훅 CRUD API·이벤트 디스패처를 신규 구현하고 이벤트 타입/페이로드 구조를 통합했습니다. OAuth 보안을 강화(STATELESS 세션 전환, 이메일 열거 취약점 제거, 도메인 검증 추가)하고, 페이지네이션 N+1 문제를 2-쿼리 패턴으로 해결했습니다.",
      },
      {
        name: "홍지민",
        role: "Back-end",
        description:
          "엑셀 업로드 성능을 QueryDSL 벌크 업데이트 전환으로 개선하고, 엔티티에 누락된 인덱스를 추가했습니다.",
      },
      {
        name: "이세민",
        role: "Back-end",
        description:
          "프로젝트 초기 단계부터 참여해 서비스 방향성과 핵심 기능을 정의했습니다. 사용자 인증 및 권한 관리 체계를 설계·구현하고, 스코프 기반 접근 제어로 리소스별 권한을 분리해 서비스 보안성을 확보했습니다.",
      },
      {
        name: "정연돈",
        role: "QA",
        description:
          "엣지 케이스를 발굴하고 시나리오 기반 테스트로 배포 전 잠재 이슈를 사전에 차단해 서비스 안정성 향상에 기여했습니다.",
      },
      {
        name: "정효주",
        role: "Front-end",
        description:
          "문서(Docs) 페이지 프론트엔드 개발을 전담하며 컴포넌트 설계와 마크업/스타일링을 구현했습니다.",
      },
      {
        name: "전준연",
        role: "Front-end",
        description:
          "프론트엔드 초기 기능의 70% 이상을 주도적으로 개발했습니다. OpenAPI JavaScript SDK를 개발하고, OAuth React SDK 구조 개선 및 빌드 최적화, LLM 친화적 문서 구조 설계를 담당했습니다.",
      },
    ],
  },
  {
    id: 21,
    name: "GIF",
    teamName: "VOID",
    tagline: "GSM Idea Festival 통합 관리 플랫폼",
    logo: "/gif/gif-l.png",
    logoBg: "#ffffff",
    siteUrl: "https://gif.io.kr",
    leader: "김지유",
    demoVideoUrl: "/gif/gif-video.mp4",
    description:
      "광주소프트웨어마이스터고등학교 idea festival 관리 서비스\n\n" +
      "GIF은 아이디어페스티벌 전 과정을 학생, 선생님 사이트로 나눠 통합한 서비스로, 팀원과 함께 사용자 중심 설계를 배울 수 있었습니다" +
      "",
    features: [
      {
        title: "프로젝트 팀 관리",
        description: "팀원 관리 및 프로젝트 관리를 한번에",
      },
      {
        title: "점수 부여 기능",
        description: "선생님이 바로바로 팀별 점수 입력",
      },
      {
        title: "양식 생성 기능",
        description: "복잡한 과정없이 웹에서 바로 양식 생성 후 공지",
      },
      {
        title: "AI 요약 기능",
        description: "설명 등을 한눈에 알아볼 수 있도록 요약",
      },
    ],
    members: [
      {
        name: "김지유",
        role: "Front-end",
        description:
          "로그인 · 회원가입 인증 화면부터 프로젝트 목록 · 상세 조회, 양식 목록까지 서비스 핵심 페이지의 UI와 API 데이터 연동을 담당하여, 사용자가 프로젝트를 관리하고 양식을 확인하는 주요 흐름을 구현했습니다.",
        photo: "/gif/member/jiyu.jpg",
        skills: [
          "Next.js",
          "React",
          "Tailwind CSS",
          "Tanstack Query",
          "TypeScript",
        ],
        email: "s25023@gsm.hs.kr",
        portfolioUrl:
          "https://forested-spell-882.notion.site/223431f0338b80bda42bdecac3138745",
      },
      {
        name: "김민아",
        role: "Front-end",
        description:
          "양식 생성 · 조회 · 수정 페이지와 마이페이지의 개발을 담당했으며, 공통 UI 컴포넌트 구현 및 백엔드 API연동을 통해 기능을 개발했습니다. 또한 디자인 토큰을 적용하여 사용자 인터페이스를 구축했습니다.",
        photo: "/gif/member/min.jpg",
        skills: [
          "Next.js",
          "React",
          "Tailwind CSS",
          "Tanstack Query",
          "TypeScript",
        ],
        email: "s25020@gsm.hs.kr",
        portfolioUrl: "https://m.site.naver.com/2bEAm",
      },
      {
        name: "이효은",
        role: "Front-end",
        description:
          "참가자용 프로젝트 생성 페이지와 어드민의 점수 부여 · 수합 페이지를 담당했습니다. 프로젝트 등록 폼과 점수 입력 · 자동 합산화면을 구현했고, 등수 확인 페이지와 404 페이지도 함께 만들었습니다.",
        photo: "/gif/member/hyo.png",
        skills: [
          "Next.js",
          "React",
          "Tailwind CSS",
          "Tanstack Query",
          "TypeScript",
        ],
        email: "s25049@gsm.hs.kr",
        portfolioUrl: "https://m.site.naver.com/2bDZ8",
      },
      {
        name: "김수빈",
        role: "Back-end",
        description:
          "DataGam OAth를 이용한 로그인/회원가입 기능을 구현하였씁니다. 선생님과 학생 역할을 세분화 하여 관리하였으며 선생님 역할별 점수 부여 · 조회 · 합계 계산 · 랭킹 기능도 구현하였습니다.",
        photo: "/gif/member/subin.jpg",
        skills: [
          "java",
          "spring boot",
          "Rest API",
          "Spring Web",
          "Spring Security",
          "JPA",
        ],
        email: "s25021@gsm.hs.kr",
        portfolioUrl: "https://m.site.naver.com/2bEgX",
      },
      {
        name: "이하경",
        role: "Back-end",
        description:
          "프로젝트 생성 및 앵식 제출 시스템의 백엔드 API 설계 · 개발을 담당했고 AI 자동 요약 기증을 구현했습니다.",
        photo: "/gif/member/kyoung.jpg",
        skills: [
          "java",
          "spring boot",
          "Rest API",
          "Spring Web",
          "Spring Security",
        ],
        email: "s25048@gsm.hs.kr",
        portfolioUrl: "https://m.site.naver.com/2bDzW",
      },
      {
        name: "박채은",
        role: "DevOps",
        description:
          "CI/CD 파이프라인 구축 및 관리, 클라우드 인프라 설정 및 모니터링을 담당했습니다. 또한, 애플리케이션의 배포 자동화와 성능 최적화에 기여했습니다.",
        photo: "/gif/member/chae.png",
        skills: ["Doker"],
        email: "s25026@gsm.hs.kr",
        portfolioUrl: "https://m.site.naver.com/2bD1w",
      },
      {
        name: "조하율",
        role: "UI/UX Designer",
        description:
          "전체적인 프로젝트의 디자인을 기획하고, 캐릭터와 로고를 직접 디자인하여 프로젝트의 아이덴티티를 향상시켰습니다.",
        photo: "/gif/member/yul.jpg",
        skills: ["Figma"],
        email: "s25033@gsm.hs.kr",
        portfolioUrl: "https://m.site.naver.com/2bEf9",
      },
    ],
  },
];
