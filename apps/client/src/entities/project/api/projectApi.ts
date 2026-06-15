import { apiClient } from "@repo/lib";

import type { CreateProjectRequest, ProjectResponse, UserSearchResult } from "../model/types";

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

export const searchUsers = async (keyword: string): Promise<UserSearchResult[]> => {
  const { data } = await apiClient.get<UserSearchResult[]>("/api/project/users/search", {
    params: { keyword },
  });
  return data;
};
