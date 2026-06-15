export interface CreateProjectRequest {
  name: string;
  teamName: string;
  memberIds: number[];
  description: string;
  logo?: File;
}

export interface UserSearchResult {
  userId: number;
  name: string;
  studentNumber: string;
}

export interface ProjectResponse {
  projectId: number;
  projectName: string;
  teamName: string;
  members: string[];
  description: string;
  thumbnailUrl?: string;
}

export interface Project {
  id: number;
  name: string;
}

// GET /api/project/me — 참여(생성)한 프로젝트 목록. 없으면 빈 배열 []
export type GetMyProjectResponse = Project[];

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
