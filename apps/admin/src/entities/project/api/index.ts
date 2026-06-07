import { apiClient } from "@repo/lib";

import type { GetFilteredProjectsResponse } from "../model/types";

export const getFilteredProjects = (grade: number) =>
  apiClient.get<GetFilteredProjectsResponse>("/api/project/filter", {
    params: { grade },
  });
