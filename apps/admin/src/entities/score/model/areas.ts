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
// - GENERAL_TEACHER(보통 교과): 사회
// - MAJOR_TEACHER(전공 교과): 전공
// 학년부 부장(gradeHead)은 adminRole과 별도의 boolean 플래그이며,
// 기본 role 영역에 더해 보고서 영역을 추가로 채점할 수 있다 (getAllowedAreas 참고).
export const ROLE_ALLOWED_AREAS: Record<string, ScoreArea[]> = {
  MAJOR_TEACHER: ["major"],
  GENERAL_TEACHER: ["social"],
  MASTER: ["major"],
};

const DEFAULT_AREAS: ScoreArea[] = ["major", "report", "social"];
const GRADE_HEAD_AREAS: ScoreArea[] = ["report"];

// adminRole 기준 영역에, 학년부 부장이면 보고서 영역을 더해 반환한다.
// 두 역할을 겸하는 경우(예: 보통 교과 + 학년부 부장) 사회·보고서 모두 채점 가능하다.
export function getAllowedAreas(
  adminRole: string | null | undefined,
  gradeHead: boolean | null | undefined,
): ScoreArea[] {
  const roleAreas = ROLE_ALLOWED_AREAS[adminRole ?? ""] ?? DEFAULT_AREAS;
  const allowed = new Set<ScoreArea>(roleAreas);
  if (gradeHead) GRADE_HEAD_AREAS.forEach((area) => allowed.add(area));
  // 항상 전공·보고서·사회 순으로 정렬해 반환한다.
  return DEFAULT_AREAS.filter((area) => allowed.has(area));
}
