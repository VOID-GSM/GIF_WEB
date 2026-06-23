import { apiClient } from "@repo/lib";

import type {
  CreateProjectRequest,
  ProjectDetail,
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

export const getProject = async (projectId: number): Promise<ProjectDetail> => {
  const { data } = await apiClient.get<ProjectDetail>(
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
