import { apiClient } from "@repo/lib";

import type {
  GetFilteredProjectsResponse,
  Grade,
  ProjectDetail,
  ProjectSummaryResponse,
} from "../model/types";

export const getFilteredProjects = (grade: Grade) =>
  apiClient.get<GetFilteredProjectsResponse>("/api/project/filter", {
    params: { grade },
  });

export const getProject = (projectId: number) =>
  apiClient.get<ProjectDetail>(`/api/project/${projectId}`);

export const getProjectSummary = (projectId: number) =>
  apiClient.get<ProjectSummaryResponse>(`/api/project/${projectId}/summary`);
