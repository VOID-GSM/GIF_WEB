"use client";

import { useQuery } from "@tanstack/react-query";

import { getFilteredProjects } from "../api";
import { projectQueryKeys } from "../model/queryKeys";
import type { Grade } from "../model/types";

export function useGetFilteredProjects(grade: Grade, enabled = true) {
  return useQuery({
    queryKey: projectQueryKeys.filter(grade),
    queryFn: async () => (await getFilteredProjects(grade)).data,
    enabled,
  });
}
