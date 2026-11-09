import { apiClient } from "@repo/lib";

import type {
  CreateProjectRequest,
  ProjectDetail,
  ProjectDetailResponse,
  ProjectResponse,
  ProjectSummaryResponse,
  UpdateProjectRequest,
  UserSearchResult,
} from "../model/types";

export const createProject = async (
  data: CreateProjectRequest,
): Promise<number> => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("teamName", data.teamName);
  formData.append("description", data.description);
  formData.append("grade", String(data.grade));
  data.memberIds.forEach((id) => formData.append("memberIds", String(id)));
  if (data.logo) formData.append("logo", data.logo);

  const { data: responseData } = await apiClient.post<number>(
    "/api/project",
    formData,
    { headers: { "Content-Type": null } },
  );

  return responseData;
};

export const getMyProject = async (): Promise<ProjectResponse> => {
  const { data } = await apiClient.get<ProjectResponse>("/api/project/me");
  return data;
};

// 교내 사용자 전용 화면(수정·대시보드)에서 쓰는 상세 — 팀원 userId·학번이 포함된다.
export const getProject = async (projectId: number): Promise<ProjectDetail> => {
  const { data } = await apiClient.get<ProjectDetail>(
    `/api/project/${projectId}`,
  );
  return data;
};

// 공개 상세 — 비로그인·외부 사용자는 팀원 userId·학번이 빠진 응답을 받는다.
export const getPublicProject = async (
  projectId: number,
): Promise<ProjectDetailResponse> => {
  const { data } = await apiClient.get<ProjectDetailResponse>(
    `/api/project/${projectId}`,
  );
  return data;
};

export const updateProject = async (
  projectId: number,
  data: UpdateProjectRequest,
): Promise<void> => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("teamName", data.teamName);
  formData.append("description", data.description);
  formData.append("grade", String(data.grade));
  data.addMemberIds.forEach((id) => formData.append("addMemberIds", String(id)));
  data.removeMemberIds.forEach((id) =>
    formData.append("removeMemberIds", String(id)),
  );
  if (data.logo) formData.append("logo", data.logo);

  await apiClient.put(`/api/project/${projectId}/update`, formData, {
    headers: { "Content-Type": null },
  });
};

// 팀원(리더 아님)은 프로젝트 설명만 수정 가능 — 전체 수정(PUT)은 리더만 허용(403)
export const updateProjectDescription = async (
  projectId: number,
  description: string,
): Promise<void> => {
  await apiClient.patch(`/api/project/${projectId}/description`, {
    description,
  });
};

export const searchUsers = async (keyword: string): Promise<UserSearchResult[]> => {
  const { data } = await apiClient.get<UserSearchResult[]>("/api/project/users/search", {
    params: { keyword },
  });
  return data;
};

export const getProjectSummary = async (
  projectId: number,
): Promise<ProjectSummaryResponse> => {
  const { data } = await apiClient.get<ProjectSummaryResponse>(
    `/api/project/${projectId}/summary`,
  );
  return data;
};
