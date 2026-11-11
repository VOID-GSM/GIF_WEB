"use client";

import { useQuery } from "@tanstack/react-query";

import { getForms } from "./formApi";

export function useGetForms(
  projectId: number,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ["form", "list", projectId],
    queryFn: () => getForms(projectId),
    enabled: Number.isFinite(projectId) && (options?.enabled ?? true),
  });
}
