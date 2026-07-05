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
  rank: string;
  medal: string;
  team: string;
  title: string;
  desc: string;
  /** 카드 상단 그라데이션 (Tailwind from/to 클래스) */
  accent: string;
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
  {
    rank: "대상",
    medal: "🥇",
    team: "Team Prism",
    title: "모두를 위한 배리어프리 내비게이션",
    desc: "시각장애인을 위한 실내 길안내 서비스",
    accent: "from-yellow-600 to-orange-400",
  },
  {
    rank: "최우수상",
    medal: "🥈",
    team: "Team Nova",
    title: "교실 탄소중립 대시보드",
    desc: "학급 전력 사용량을 실시간 시각화한 IoT 프로젝트",
    accent: "from-gray-300 to-gray-500",
  },
  {
    rank: "우수상",
    medal: "🥉",
    team: "Team Echo",
    title: "AI 급식 추천 봇",
    desc: "잔반을 줄이는 개인 맞춤 급식 추천 서비스",
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
