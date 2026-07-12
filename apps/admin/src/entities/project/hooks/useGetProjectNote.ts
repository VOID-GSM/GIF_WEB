"use client";

import { useQuery } from "@tanstack/react-query";

import { getProjectNote } from "../api";

export function useGetProjectNote(projectId: number) {
  return useQuery({
    queryKey: ["project", "note", projectId],
    queryFn: async () => (await getProjectNote(projectId)).data,
    enabled: Number.isFinite(projectId),
  });
}
