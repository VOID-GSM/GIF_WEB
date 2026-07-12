import { apiClient } from "@repo/lib";

import type {
  GetFilteredProjectsResponse,
  GetProjectNoteResponse,
  Grade,
  ProjectDetail,
  ProjectSummaryResponse,
  UpdateProjectNoteRequest,
} from "../model/types";

export const getFilteredProjects = (grade: Grade) =>
  apiClient.get<GetFilteredProjectsResponse>("/api/project/filter", {
    params: { grade },
  });

export const getProject = (projectId: number) =>
  apiClient.get<ProjectDetail>(`/api/project/${projectId}`);

export const getProjectSummary = (projectId: number) =>
  apiClient.get<ProjectSummaryResponse>(`/api/project/${projectId}/summary`);

export const getProjectNote = (projectId: number) =>
  apiClient.get<GetProjectNoteResponse>(`/api/project/${projectId}/note`);

export const updateProjectNote = (
  projectId: number,
  body: UpdateProjectNoteRequest,
) => apiClient.put<void>(`/api/project/${projectId}/note`, body);
