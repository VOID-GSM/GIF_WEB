import type { Grade } from "@repo/ui";

export { GRADES } from "@repo/ui";
export type { Grade };

export interface FilteredProject {
  id: number;
  name: string;
  teamName: string;
  logo: string;
  grade: Grade;
}

// GET /api/project/filter?grade= — 학년별 프로젝트 목록
export type GetFilteredProjectsResponse = FilteredProject[];
