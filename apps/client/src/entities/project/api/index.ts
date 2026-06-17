import { apiClient } from "@repo/lib";

import type {
  GetFilteredProjectsResponse,
  GetMyProjectResponse,
  Grade,
} from "../model/types";

export const getMyProject = () =>
  apiClient.get<GetMyProjectResponse>("/api/project/me");

export const getFilteredProjects = (grade: Grade) =>
  apiClient.get<GetFilteredProjectsResponse>("/api/project/filter", {
    params: { grade },
  });
