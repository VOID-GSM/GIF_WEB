"use client";

import { useQuery } from "@tanstack/react-query";

import { getProject } from "../api";

export function useGetProject(projectId: number) {
  return useQuery({
    queryKey: ["project", "detail", projectId],
    queryFn: async () => (await getProject(projectId)).data,
    enabled: Number.isFinite(projectId),
  });
}
