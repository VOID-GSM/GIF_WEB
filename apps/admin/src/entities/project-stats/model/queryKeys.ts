import type { GetProjectStatsParams } from "./type";

export const projectStatsQueryKeys = {
  all: ["project-stats"] as const,
  list: (params: GetProjectStatsParams) =>
    [
      "project-stats",
      params.grade ?? "all",
      params.classNo ?? "all",
      params.sort,
    ] as const,
};
