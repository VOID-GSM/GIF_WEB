import { apiClient } from "@repo/lib";

import type { GetMyProjectsResponse } from "../model/types";

export const getMyProjects = () =>
  apiClient.get<GetMyProjectsResponse>("/api/project/me");
