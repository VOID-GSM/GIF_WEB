"use client";

import { useQuery } from "@tanstack/react-query";

import { getFilteredProjects } from "../api";
import type { Grade } from "../model/types";

export function useGetFilteredProjects(grade: Grade) {
  return useQuery({
    queryKey: ["project", "filter", grade],
    queryFn: async () => (await getFilteredProjects(grade)).data,
  });
}
