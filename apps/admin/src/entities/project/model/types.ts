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

export interface ProjectMember {
  userId: number;
  name: string;
  studentNumber: string;
  role: string;
}

// GET /api/project/{projectId} — 프로젝트 상세
export interface ProjectDetail {
  id: number;
  name: string;
  teamName: string;
  description: string;
  logo: string;
  grade: number;
  members: ProjectMember[];
}
