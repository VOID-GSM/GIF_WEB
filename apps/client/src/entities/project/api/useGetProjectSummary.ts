"use client";

import { useQuery } from "@tanstack/react-query";

import { getProjectSummary } from "./projectApi";

export function useGetProjectSummary(
  projectId: number,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ["ai", "project", "summary", projectId],
    queryFn: () => getProjectSummary(projectId),
    enabled: Number.isFinite(projectId) && (options?.enabled ?? true),
  });
}
