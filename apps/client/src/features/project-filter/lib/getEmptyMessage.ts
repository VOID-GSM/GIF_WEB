import type { GradeFilterValue } from "@/entities/project";

// 선택한 학년에 맞는 빈 목록 문구. 문구가 바뀌거나 번역 키로 교체될 때 이 한 곳만 고치면 된다.
export function getEmptyMessage(grade: GradeFilterValue | null) {
  return grade === "all"
    ? "프로젝트가 없습니다."
    : "해당 학년의 프로젝트가 없습니다.";
}
