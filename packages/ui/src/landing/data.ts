// 랜딩 페이지 더미 콘텐츠. 실제 값이 확정되면 이 파일만 교체하면 된다.

export interface StatItem {
  value: string;
  label: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  desc: string;
}

export interface WinnerItem {
  /** 수상 학년 (1 | 2) */
  grade: 1 | 2;
  rank: string;
  medal: string;
  team: string;
  title: string;
  desc: string;
  /** 팀원 명단 */
  members: string[];
  /** 팀 로고 경로 (public 기준, 예: /winners/story.png). 없으면 메달 이모지로 대체 */
  logo?: string;
  /** 카드 상단 그라데이션 (Tailwind from/to 클래스) */
  accent: string;
  /** 수상작 미공개 시 자리표시자 처리 */
  pending?: boolean;
}

export interface MemberItem {
  name: string;
  role: string;
  /** 아바타에 표시할 짧은 라벨 */
  initial: string;
}

export const STATS: StatItem[] = [
  { value: "30+", label: "참가 팀" },
  { value: "120+", label: "참가 학생" },
  { value: "300+", label: "제출 산출물" },
  { value: "4", label: "심사 부문" },
];

export const FEATURES: FeatureItem[] = [
  {
    icon: "📁",
    title: "팀 프로젝트 관리",
    desc: "팀 구성부터 프로젝트 진행 상황까지 한 곳에서 관리해요.",
  },
  {
    icon: "📤",
    title: "자료 제출",
    desc: "기획서·발표자료 등 모든 산출물을 온라인으로 제출해요.",
  },
  {
    icon: "📝",
    title: "맞춤 양식",
    desc: "담당 선생님이 만든 양식에 맞춰 손쉽게 작성하고 제출해요.",
  },
  {
    icon: "🧮",
    title: "평가·점수 집계",
    desc: "교과별 평가와 점수 합산이 자동으로 이뤄져요.",
  },
  {
    icon: "✨",
    title: "AI 요약",
    desc: "제출한 답변을 AI가 요약해 심사를 빠르게 도와줘요.",
  },
  {
    icon: "🏆",
    title: "실시간 순위",
    desc: "집계된 점수로 팀 순위를 한눈에 확인해요.",
  },
];

export const WINNERS: WinnerItem[] = [
  // ── 1학년 ──────────────────────────────
  {
    grade: 1,
    rank: "최우수상",
    medal: "🥇",
    team: "404",
    title: "Story",
    desc: "포트폴리오 및 블로그 작성에 익숙하지 않은 학생들이 AI의 도움으로 손쉽게 자신만의 글을 완성할 수 있도록 도와주고 이를 공유할 수 있는 플랫폼입니다.",
    members: ["이남진", "정연돈", "홍지민", "배재현", "박채은", "김서연"],
    logo: "/story.png",
    accent: "from-yellow-600 to-orange-400",
  },
  {
    grade: 1,
    rank: "우수상",
    medal: "🥈",
    team: "",
    title: "",
    desc: "",
    members: [],
    accent: "from-gray-300 to-gray-500",
    pending: true,
  },
  {
    grade: 1,
    rank: "장려상",
    medal: "🥉",
    team: "null",
    title: "Coding GO!",
    desc: "누구나 쉽고 재미있게 코딩을 배우고, 꾸준한 학습을 통해 성장할 수 있도록 돕는 코딩 학습 플랫폼, Coding GO!",
    members: ["류수연", "유휘영", "이의빈", "정종윤", "주현진"],
    logo: "/codinggo.png",
    accent: "from-orange-300 to-orange-500",
  },
  // ── 2학년 ──────────────────────────────
  {
    grade: 2,
    rank: "최우수상",
    medal: "🥇",
    team: "한승일",
    title: "NoChu",
    desc: "AI 실시간 표정 인식을 통해 사용자의 현재 감정을 분석하여 최적의 맞춤형 음악을 추천하는 모바일 애플리케이션",
    members: ["조수민", "임지훈", "전선우", "김재관", "박정우", "박승일", "배용빈"],
    logo: "/nochu.png",
    accent: "from-yellow-600 to-orange-400",
  },
  {
    grade: 2,
    rank: "우수상",
    medal: "🥈",
    team: "NFTEEN",
    title: "DONDON",
    desc: "청소년들을 위한 경제/금융 플랫폼",
    members: ["박서현", "이서희", "유은서", "김준혁", "송정연", "이준건"],
    logo: "/dondon.png",
    accent: "from-gray-300 to-gray-500",
  },
  {
    grade: 2,
    rank: "장려상",
    medal: "🥉",
    team: "소라고",
    title: "아.아.",
    desc: '개발자 전용 커피챗 네트워킹 플랫폼, "아.아." 가볍게 만나서 기술과 커리어 이야기를 나눠보세요. 아.아.는 개발자들이 부담 없이 신뢰를 쌓아가는 새로운 네트워킹 문화를 만들어갑니다.',
    members: ["허은서", "김명현", "임시현", "이영서", "김한주"],
    logo: "/aa_logo.jpg",
    accent: "from-orange-300 to-orange-500",
  },
];

// TODO: 실제 VOID 팀원 정보(이름·역할·사진)로 교체하기.
export const MEMBERS: MemberItem[] = [
  { name: "구성원 1", role: "Frontend", initial: "01" },
  { name: "구성원 2", role: "Frontend", initial: "02" },
  { name: "구성원 3", role: "Backend", initial: "03" },
  { name: "구성원 4", role: "Backend", initial: "04" },
  { name: "구성원 5", role: "Design · PM", initial: "05" },
];
