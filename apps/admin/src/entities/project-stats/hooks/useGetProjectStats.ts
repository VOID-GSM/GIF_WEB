"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getProjectStats } from "../api/projectStatsApi";
import type { GetProjectStatsParams } from "../model/type";

export function useGetProjectStats(
  params: GetProjectStatsParams,
  enabled = true,
) {
  return useQuery({
    queryKey: [
      "project-stats",
      params.grade ?? "all",
      params.classNo ?? "all",
      params.sort,
    ],
    queryFn: () => getProjectStats(params),
    enabled,
    placeholderData: keepPreviousData,
  });
}
