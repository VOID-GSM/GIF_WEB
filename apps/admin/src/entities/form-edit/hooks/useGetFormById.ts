"use client";

import { useQuery } from "@tanstack/react-query";
import { getFormById } from "../api";

export function useGetFormById(formId: number, projectId?: number) {
  return useQuery({
    queryKey: ["form", "by-id", formId, projectId] as const,
    queryFn: () => getFormById(formId, projectId),
    enabled: !!formId,
    retry: 1,
  });
}
