import type { EngagementFields, RawEngagement } from "./engagement";

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
  // 이미 다른 팀에 소속된 학생인지 여부
  hasTeam: boolean;
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

// isLiked: 비로그인 요청은 항상 false
export interface FilteredProject
  extends Pick<EngagementFields, "likeCount" | "isLiked" | "commentCount"> {
  id: number;
  name: string;
  teamName: string;
  logo: string;
  grade: Grade;
}

// GET /api/project/filter?grade= — 학년별 프로젝트 목록 (참여 지표 누락 가능)
export type GetFilteredProjectsResponse = RawEngagement<FilteredProject>[];

export interface ProjectMember {
  userId: number;
  name: string;
  studentNumber: string;
  role: string;
}

// 비로그인·외부 사용자용 공개 응답의 팀원 — userId·학번이 빠진다.
export interface PublicProjectMember {
  name: string | null;
  role: string;
}

interface ProjectDetailBase extends EngagementFields {
  id: number;
  name: string;
  teamName: string;
  description: string;
  logo: string;
  grade: number;
}

// GET /api/project/{projectId} — 교내 사용자(재학생·선생님)가 받는 프로젝트 상세
export interface ProjectDetail extends ProjectDetailBase {
  members: ProjectMember[];
}

// GET /api/project/{projectId} — 비로그인·외부 사용자가 받는 공개 응답
export interface PublicProjectDetail extends ProjectDetailBase {
  members: PublicProjectMember[];
}

// 같은 API가 요청자에 따라 둘 중 하나로 응답한다.
export type ProjectDetailResponse = ProjectDetail | PublicProjectDetail;

// GET /api/project/{projectId}/summary — AI가 생성한 프로젝트 요약 (응답은 요약 문자열)
export type ProjectSummaryResponse = string;

// GET /api/project/{projectId}/links — GitHub·배포 주소 등 팀이 등록한 링크
export interface ProjectLink {
  id: number;
  title: string;
  url: string;
}

export type GetProjectLinksResponse = ProjectLink[];

// POST /api/project/{projectId}/links, PATCH .../{linkId} 공용 요청 바디
export interface ProjectLinkRequest {
  title: string;
  url: string;
}

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

