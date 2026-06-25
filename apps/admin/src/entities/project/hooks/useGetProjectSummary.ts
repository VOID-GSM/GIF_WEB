"use client";

import { useQuery } from "@tanstack/react-query";

import { getProjectSummary } from "../api";

export function useGetProjectSummary(
  projectId: number,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ["ai", "project", "summary", projectId],
    queryFn: async () => (await getProjectSummary(projectId)).data,
    enabled: Number.isFinite(projectId) && (options?.enabled ?? true),
  });
}
