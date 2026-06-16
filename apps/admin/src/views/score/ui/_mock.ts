// TODO: API 연동 시 이 파일 전체 삭제

export type ScoreArea   = "major" | "report" | "social";
export type ScoreStatus = "scored" | "unscored" | "unavailable";
export type ScoreValue  = 40 | 32 | 24;

export interface TeamScore {
  id: number;
  teamName: string;
  projectName: string;
  scores: Record<ScoreArea, ScoreStatus>;
}

export interface ScoreRow {
  id: number;
  teamName: string;
  title: string;
  deadline: string;
  selectedScore: ScoreValue | null;
  deadlineStatus: "before" | "after";
  isComplete: boolean;
}

export const MOCK_TEAMS: TeamScore[] = [
  { id: 1, teamName: "VOID",  projectName: "스마트 출입 관리 시스템", scores: { major: "unscored",    report: "unscored",    social: "scored"      } },
  { id: 2, teamName: "NOVA",  projectName: "AI 기반 학습 도우미",     scores: { major: "scored",      report: "scored",      social: "unavailable" } },
  { id: 3, teamName: "APEX",  projectName: "실시간 환경 모니터링",     scores: { major: "unavailable", report: "unscored",    social: "unscored"    } },
  { id: 4, teamName: "PULSE", projectName: "헬스케어 데이터 플랫폼",   scores: { major: "unscored",    report: "unavailable", social: "scored"      } },
  { id: 5, teamName: "ORBIT", projectName: "소셜 학습 커뮤니티",       scores: { major: "unscored",    report: "unscored",    social: "unscored"    } },
  { id: 6, teamName: "SIGMA", projectName: "스마트 재활용 분류기",      scores: { major: "unavailable", report: "scored",      social: "unscored"    } },
  { id: 7, teamName: "DELTA", projectName: "AR 기반 체험 학습",        scores: { major: "scored",      report: "unscored",    social: "scored"      } },
];

export const MOCK_TEAM_NAMES: Record<number, string> = {
  1: "VOID",
  2: "NOVA",
  3: "APEX",
  4: "PULSE",
  5: "ORBIT",
  6: "SIGMA",
  7: "DELTA",
};

export const MOCK_TOTAL = 48;

export function buildMockRows(teamName: string): ScoreRow[] {
  return [
    { id: 1, teamName, title: "아이디어페스티벌 보고서", deadline: "2026.12.21", selectedScore: 40,   deadlineStatus: "before", isComplete: true  },
    { id: 2, teamName, title: "아이디어페스티벌 보고서", deadline: "2026.12.21", selectedScore: 32,   deadlineStatus: "before", isComplete: true  },
    { id: 3, teamName, title: "아이디어페스티벌 보고서", deadline: "2026.12.21", selectedScore: null, deadlineStatus: "after",  isComplete: false },
    { id: 4, teamName, title: "아이디어페스티벌 보고서", deadline: "2026.12.21", selectedScore: null, deadlineStatus: "before", isComplete: false },
    { id: 5, teamName, title: "아이디어페스티벌 보고서", deadline: "2026.12.21", selectedScore: null, deadlineStatus: "before", isComplete: false },
    { id: 6, teamName, title: "아이디어페스티벌 보고서", deadline: "2026.12.21", selectedScore: null, deadlineStatus: "before", isComplete: false },
    { id: 7, teamName, title: "아이디어페스티벌 보고서", deadline: "2026.12.21", selectedScore: null, deadlineStatus: "before", isComplete: false },
    { id: 8, teamName, title: "아이디어페스티벌 보고서", deadline: "2026.12.21", selectedScore: null, deadlineStatus: "before", isComplete: false },
    { id: 9, teamName, title: "아이디어페스티벌 보고서", deadline: "2026.12.21", selectedScore: null, deadlineStatus: "after",  isComplete: false },
  ];
}
