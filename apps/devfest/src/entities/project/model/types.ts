// 프로젝트 팀원 — 사진/포폴 링크/전공/스킬은 없을 수 있어 optional
export interface ProjectMember {
  name: string;
  role: string; // 파트/역할 (팀장, Back-end, Front-end, QA, PM, Design 등)
  description: string; // 담당 업무 설명
  photo?: string; // 팀원 사진 (없을 수 있음)
  portfolioUrl?: string; // 포폴/깃허브 사이트 링크 (없을 수 있음)
  major?: string; // 전공 (없을 수 있음)
  skills?: string[]; // 스킬 (없을 수 있음)
  email?: string; // 이메일 (없을 수 있음)
  phone?: string; // 전화번호 (없을 수 있음)
}

// 프로젝트 기능 — 큰 틀(title)과 그에 대한 설명(description)
export interface ProjectFeature {
  title: string;
  description: string;
}

// 프로젝트 지표 — 상세 페이지 상태 바에 표시하는 수치 (없을 수 있음)
export interface ProjectStat {
  value: string;
  label: string;
}

export interface Project {
  id: number;
  name: string; // 프로젝트 명
  teamName: string; // 팀명
  tagline?: string; // 카드/헤더용 한 줄 소개
  logo: string; // 프로젝트 로고
  description: string; // 프로젝트 설명
  features: ProjectFeature[]; // 프로젝트 기능
  members: ProjectMember[]; // 프로젝트 팀원
  stats?: ProjectStat[]; // 프로젝트 지표 (없을 수 있음)
  siteUrl?: string; // 프로젝트 사이트 링크 (없을 수 있음)
  demoVideoUrl?: string; // 프로젝트 시연 영상 (없을 수 있음)
  // 시연 영상 표시 방식: cover(꽉 채움, 기본) / contain(전체 표시, 좌우 여백 — 세로형 앱 영상용)
  videoFit?: "cover" | "contain";
  // 히어로 배경색 (contain 여백 등). 밝은 색을 지정하면 텍스트가 어둡게 전환됨. 미지정 시 검정
  heroBg?: string;
}
