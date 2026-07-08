// 점수 영역 도메인 정의 — 채점 뷰와 프로젝트 상세의 점수 부여 버튼이 공유한다.
export type ScoreArea = "major" | "report" | "social";

export const AREA_LABELS: Record<ScoreArea, string> = {
  major: "전공 중심 영역",
  report: "보고서 영역",
  social: "사회 중심 영역",
};

export const AREA_LABELS_SHORT: Record<ScoreArea, string> = {
  major: "전공",
  report: "보고서",
  social: "사회",
};

// 관리자 역할별 채점 가능 영역.
// - MASTER(아이디어페스티벌 담당): 전공
// - GRADE_HEAD(학생부 부장): 보고서 + 사회
// - GENERAL_TEACHER(보통 교과): 사회
// - MAJOR_TEACHER(전공 교과): 전공
export const ROLE_ALLOWED_AREAS: Record<string, ScoreArea[]> = {
  MAJOR_TEACHER: ["major"],
  GENERAL_TEACHER: ["social"],
  GRADE_HEAD: ["report", "social"],
  MASTER: ["major"],
};

// 전체 영역(순서 기준). 역할 매핑이 없을 때의 폴백이자 정렬 기준으로 쓴다.
export const ALL_SCORE_AREAS: ScoreArea[] = ["major", "report", "social"];

// 채점 가능 영역 계산 — 역할 기본 영역에 더해, 학년부 부장(gradeHead)이면 보고서 영역을 추가한다.
export function getAllowedScoreAreas(
  adminRole: string | null | undefined,
  gradeHead?: boolean,
): ScoreArea[] {
  const base = ROLE_ALLOWED_AREAS[adminRole ?? ""] ?? ALL_SCORE_AREAS;
  const areas = new Set<ScoreArea>(base);
  if (gradeHead) areas.add("report");
  return ALL_SCORE_AREAS.filter((area) => areas.has(area));
}
