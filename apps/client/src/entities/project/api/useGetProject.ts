"use client";

import { useQuery } from "@tanstack/react-query";

import { getProject } from "./projectApi";

export function useGetProject(projectId: number) {
  return useQuery({
    queryKey: ["project", "detail", projectId],
    queryFn: () => getProject(projectId),
    enabled: Number.isFinite(projectId),
  });
}
