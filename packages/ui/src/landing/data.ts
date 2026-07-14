// 랜딩 페이지 콘텐츠. 실제 값이 확정되면 이 파일만 교체하면 된다.

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
  /** 팀원 명단 (팀장을 맨 앞에 둔다) */
  members: string[];
  /** 팀 로고 경로 (public 기준, 예: /story.png). 없으면 메달 이모지로 대체 */
  logo?: string;
  /** 수상작 미공개 시 자리표시자 처리 */
  pending?: boolean;
}

export interface MemberItem {
  name: string;
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
  title: string;
  desc: string;
}

// 페스티벌 일정 타임라인.
export interface ScheduleItem {
  period: string;
  title: string;
  /** 집중 기간 등 부가 설명 */
  note?: string;
  /** 집중 기간 여부 — 강조 표시에 사용 */
  focus?: boolean;
}

export const SCHEDULE: ScheduleItem[] = [
  { period: "5.27 ~ 6.13", title: "팀 조직" },
  {
    period: "7.06 ~ 7.10",
    title: "1차 집중 기간",
    note: "수업 없이 페스티벌 준비에만 집중하는 기간",
    focus: true,
  },
  { period: "7.15", title: "중간 발표" },
  {
    period: "12.21 ~ 12.25",
    title: "2차 집중 기간",
    note: "수업 없이 페스티벌 준비에만 집중하는 기간",
    focus: true,
  },
  { period: "12.28", title: "최종 발표" },
  { period: "12.28 ~ 12.29", title: "아이디어페스티벌 전시" },
];

export const STATS: StatItem[] = [
  { value: "26", label: "참가 팀" },
  { value: "123", label: "참가 학생" },
  { value: "1·2", label: "참가 학년" },
  { value: "3", label: "심사 영역" },
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
    desc: "영역별 평가와 점수 합산이 자동으로 이뤄져요.",
  },
  {
    icon: "✨",
    title: "AI 요약",
    desc: "프로젝트와 제출 답변을 AI가 요약해 심사를 빠르게 도와줘요.",
  },
  {
    icon: "🏆",
    title: "등수 공지",
    desc: "집계가 끝나면 팀 등수를 공지로 확인할 수 있어요.",
  },
];

export const STEPS: StepItem[] = [
  {
    step: "01",
    title: "팀 구성",
    desc: "함께할 팀원을 모으고 팀을 만들어 프로젝트를 등록해요.",
  },
  {
    step: "02",
    title: "기획 · 개발",
    desc: "자유 주제로 아이디어를 구체화하고 직접 만들어요.",
  },
  {
    step: "03",
    title: "자료 제출",
    desc: "선생님이 만든 양식에 맞춰 산출물을 온라인으로 제출해요.",
  },
  {
    step: "04",
    title: "발표 · 심사",
    desc: "완성한 결과물을 발표하고 부문별 심사를 받아요.",
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
  },
  {
    grade: 1,
    rank: "우수상",
    medal: "🥈",
    team: "기능반",
    title: "GSM Market",
    desc: "GSM Market은 학생들이 직접 물건을 사고팔며 자유롭게 소통하는 교내 중심의 플리마켓 플랫폼입니다. 안 쓰는 물건에 새로운 가치를 더하고, 필요한 선후배 그리고 동기들과 따뜻한 교류를 나눌 수 있습니다.",
    // 이찬진이 팀장이라 맨 앞에 둔다.
    members: ["이찬진", "조영재", "이진서", "김성주"],
    logo: "/gsmmarket-logo.png",
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
  },
];

// GIF를 만든 Team VOID 팀원. github이 없으면 클릭 이동을 하지 않는다.
export const MEMBERS: MemberItem[] = [
  {
    name: "김지유",
    role: "부장 · Frontend",
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
