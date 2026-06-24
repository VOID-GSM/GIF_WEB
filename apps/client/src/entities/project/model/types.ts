export interface CreateProjectRequest {
  name: string;
  teamName: string;
  description: string;
  grade: Grade;
  memberIds: number[];
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
  teamName: string;
  logo: string;
  grade: number;
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

// GET /api/project/{projectId}/summary — AI가 생성한 프로젝트 요약 (응답은 요약 문자열)
export type ProjectSummaryResponse = string;

// PUT /api/project/{projectId}/update — 멤버는 추가/삭제 델타로 전달
export interface UpdateProjectRequest {
  name: string;
  teamName: string;
  description: string;
  grade: number;
  addMemberIds: number[];
  removeMemberIds: number[];
  logo?: File;
}

// PATCH /api/project/{projectId}/transfer-leader — 팀장 양도(현재 리더만 호출)
export interface TransferLeaderRequest {
  newLeaderUserId: number;
}
