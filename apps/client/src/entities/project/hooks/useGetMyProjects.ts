"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyProjects } from "../api";

export const PROJECT_QUERY_KEY = ["project", "me"] as const;

export function useGetMyProjects() {
  return useQuery({
    queryKey: PROJECT_QUERY_KEY,
    queryFn: async () => {
      const { data } = await getMyProjects();
      return data;
    },
  });
}
