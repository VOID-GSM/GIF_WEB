// 랜딩 페이지 콘텐츠. 실제 값이 확정되면 이 파일만 교체하면 된다.
// 화면에 보이는 문구는 번역 리소스("intro" 네임스페이스)에 있고, 여기에는 그 키만 둔다.

export interface StatItem {
  value: string;
  /** intro.about.stats.* 번역 키 */
  key: string;
}

export interface FeatureItem {
  icon: string;
  /** intro.landing.features.* 번역 키 */
  key: string;
}

export interface WinnerItem {
  /** 수상 학년 (1 | 2) */
  grade: 1 | 2;
  /** intro.winners.rank.* 번역 키 */
  rank: "grand" | "excellence" | "encouragement";
  medal: string;
  team: string;
  title: string;
  /** intro.winners.desc.* 번역 키 */
  descKey: string;
  /** 팀원 명단 (팀장을 맨 앞에 둔다) */
  members: string[];
  /** 팀 로고 경로 (public 기준, 예: /story.png). 없으면 메달 이모지로 대체 */
  logo?: string;
  /** 수상작 미공개 시 자리표시자 처리 */
  pending?: boolean;
}

export interface MemberItem {
  name: string;
  /** 담당 분야 (부장 표기는 lead 로 따로 붙인다) */
  role: string;
  /** 아바타에 표시할 짧은 라벨 */
  initial: string;
  /** GitHub 프로필 URL. 없으면 클릭 이동을 하지 않는다. */
  github?: string;
  /** 부장 여부 — 카드 강조에 사용 */
  lead?: boolean;
}

// 진행 흐름 — 랜딩에서 페스티벌 참여 과정을 안내한다.
export interface StepItem {
  step: string;
  /** intro.landing.steps.* 번역 키 */
  key: string;
}

// 페스티벌 일정 타임라인.
export interface ScheduleItem {
  period: string;
  /** intro.about.schedule.* 번역 키 */
  key: string;
  /** 집중 기간 여부 — 강조 표시와 부가 설명에 사용 */
  focus?: boolean;
}

export const SCHEDULE: ScheduleItem[] = [
  { period: "5.27 ~ 6.13", key: "teamBuilding" },
  { period: "7.06 ~ 7.10", key: "focus1", focus: true },
  { period: "7.15", key: "midterm" },
  { period: "12.21 ~ 12.25", key: "focus2", focus: true },
  { period: "12.28", key: "final" },
  { period: "12.28 ~ 12.29", key: "exhibition" },
];

export const STATS: StatItem[] = [
  { value: "26", key: "teams" },
  { value: "133", key: "students" },
  { value: "1·2", key: "grades" },
  { value: "3", key: "areas" },
];

export const FEATURES: FeatureItem[] = [
  { icon: "📁", key: "team" },
  { icon: "📤", key: "submit" },
  { icon: "📝", key: "form" },
  { icon: "🧮", key: "score" },
  { icon: "✨", key: "ai" },
  { icon: "🏆", key: "rank" },
];

export const STEPS: StepItem[] = [
  { step: "01", key: "team" },
  { step: "02", key: "build" },
  { step: "03", key: "submit" },
  { step: "04", key: "present" },
];

export const WINNERS: WinnerItem[] = [
  // ── 1학년 ──────────────────────────────
  {
    grade: 1,
    rank: "grand",
    medal: "🥇",
    team: "404",
    title: "Story",
    descKey: "story",
    members: ["이남진", "정연돈", "홍지민", "배재현", "박채은", "김서연"],
    logo: "/story.png",
  },
  {
    grade: 1,
    rank: "excellence",
    medal: "🥈",
    team: "기능반",
    title: "GSM Market",
    descKey: "gsmMarket",
    // 이찬진이 팀장이라 맨 앞에 둔다.
    members: ["이찬진", "조영재", "이진서", "김성주"],
    logo: "/gsmmarket-logo.png",
  },
  {
    grade: 1,
    rank: "encouragement",
    medal: "🥉",
    team: "null",
    title: "Coding GO!",
    descKey: "codingGo",
    members: ["류수연", "유휘영", "이의빈", "정종윤", "주현진"],
    logo: "/codinggo.png",
  },
  // ── 2학년 ──────────────────────────────
  {
    grade: 2,
    rank: "grand",
    medal: "🥇",
    team: "한승일",
    title: "NoChu",
    descKey: "nochu",
    members: ["조수민", "임지훈", "전선우", "김재관", "박정우", "박승일", "배용빈"],
    logo: "/nochu.png",
  },
  {
    grade: 2,
    rank: "excellence",
    medal: "🥈",
    team: "NFTEEN",
    title: "DONDON",
    descKey: "dondon",
    members: ["박서현", "이서희", "유은서", "김준혁", "송정연", "이준건"],
    logo: "/dondon.png",
  },
  {
    grade: 2,
    rank: "encouragement",
    medal: "🥉",
    team: "소라고",
    title: "아.아.",
    descKey: "aa",
    members: ["허은서", "김명현", "임시현", "이영서", "김한주"],
    logo: "/aa_logo.jpg",
  },
];

// GIF를 만든 Team VOID 팀원. github이 없으면 클릭 이동을 하지 않는다.
export const MEMBERS: MemberItem[] = [
  {
    name: "김지유",
    role: "Frontend",
    initial: "지유",
    github: "https://github.com/jyuuuuu0",
    lead: true,
  },
  {
    name: "김민아",
    role: "Frontend",
    initial: "민아",
    github: "https://github.com/ma94275",
  },
  {
    name: "김수빈",
    role: "Backend",
    initial: "수빈",
    github: "https://github.com/sooooooobinn",
  },
  {
    name: "박채은",
    role: "DevOps",
    initial: "채은",
    github: "https://github.com/chaeeun-09",
  },
  {
    name: "이하경",
    role: "Backend",
    initial: "하경",
    github: "https://github.com/hikeong",
  },
  {
    name: "이효은",
    role: "Frontend",
    initial: "효은",
    github: "https://github.com/hyooeunn",
  },
  {
    name: "조하율",
    role: "Design",
    initial: "하율",
  },
];
