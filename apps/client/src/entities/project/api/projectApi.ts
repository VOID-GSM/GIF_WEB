import { apiClient } from "@repo/lib";

import type { CreateProjectRequest, ProjectResponse, UserSearchResult } from "../model/types";

export const createProject = async (
  data: CreateProjectRequest,
): Promise<ProjectResponse> => {
  const { data: responseData } = await apiClient.post<ProjectResponse>(
    "/api/project",
    data,
  );

  return responseData;
};

export const uploadProjectLogo = async (projectId: number, file: File): Promise<void> => {
  const formData = new FormData();
  formData.append("file", file);
  await apiClient.post(`/api/project/${projectId}/logo`, formData);
};

export const getMyProject = async (): Promise<ProjectResponse> => {
  const { data } = await apiClient.get<ProjectResponse>("/api/project/me");
  return data;
};

export const searchUsers = async (keyword: string): Promise<UserSearchResult[]> => {
  const { data } = await apiClient.get<UserSearchResult[]>("/api/project/users/search", {
    params: { keyword },
  });
  return data;
};
