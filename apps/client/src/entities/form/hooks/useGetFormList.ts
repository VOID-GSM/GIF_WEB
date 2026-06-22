"use client";

import { useQuery } from "@tanstack/react-query";

import { getFormList } from "../api";

export const FORM_QUERY_KEY = ["form", "list"] as const;

export function useGetFormList(projectId?: number) {
  return useQuery({
    queryKey: [...FORM_QUERY_KEY, projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const { data } = await getFormList(projectId);
      return data;
    },
    enabled: !!projectId,
    select: (data) => [...data].sort((a, b) => b.id - a.id),
  });
}
