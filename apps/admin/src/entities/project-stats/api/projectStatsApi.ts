import { apiClient } from "@repo/lib";

import type {
  GetProjectStatsParams,
  ProjectStats,
} from "@/entities/project-stats/model/type";

export const getProjectStats = async (
  params: GetProjectStatsParams,
): Promise<ProjectStats[]> => {
  const { data } = await apiClient.get<ProjectStats[]>("/api/project/stats", {
    params,
  });
  return data;
};
