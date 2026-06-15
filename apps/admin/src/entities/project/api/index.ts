import { apiClient } from "@repo/lib";

import type { GetFilteredProjectsResponse, Grade } from "../model/types";

export const getFilteredProjects = (grade: Grade) =>
  apiClient.get<GetFilteredProjectsResponse>("/api/project/filter", {
    params: { grade },
  });
