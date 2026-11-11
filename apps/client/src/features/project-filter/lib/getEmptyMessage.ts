import type { GradeFilterValue } from "@/entities/project";

// 빈 목록 문구의 번역 키 — 실제 문구는 messages(project.list)에서 가져온다.
export function getEmptyMessageKey(grade: GradeFilterValue | null) {
  return grade === "all" ? "emptyAll" : "emptyGrade";
}