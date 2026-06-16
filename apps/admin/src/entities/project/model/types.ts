// 아이디어 페스티벌 참가 학년 (디자인 기준 1·2학년)
export const GRADES = [1, 2] as const;
export type Grade = (typeof GRADES)[number];

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
