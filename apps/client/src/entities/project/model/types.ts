export interface CreateProjectRequest {
  name: string;
  teamName: string;
  memberIds: number[];
  description: string;
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
