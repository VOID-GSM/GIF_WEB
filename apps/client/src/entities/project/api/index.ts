import { apiClient } from "@repo/lib";

import type {
  GetFilteredProjectsResponse,
  GetMyProjectResponse,
} from "../model/types";

export const getMyProject = () =>
  apiClient.get<GetMyProjectResponse>("/api/project/me");

export const getFilteredProjects = (grade: number) =>
  apiClient.get<GetFilteredProjectsResponse>("/api/project/filter", {
    params: { grade },
  });
