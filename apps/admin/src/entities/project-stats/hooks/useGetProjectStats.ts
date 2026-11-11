"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getProjectStats } from "../api/projectStatsApi";
import { projectStatsQueryKeys } from "../model/queryKeys";
import type { GetProjectStatsParams } from "../model/type";

export function useGetProjectStats(
  params: GetProjectStatsParams,
  enabled = true,
) {
  return useQuery({
    queryKey: projectStatsQueryKeys.list(params),
    queryFn: () => getProjectStats(params),
    enabled,
    placeholderData: keepPreviousData,
  });
}
