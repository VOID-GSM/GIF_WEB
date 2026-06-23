"use client";

import { useQuery } from "@tanstack/react-query";

import { getForms } from "../api";

export function useGetForms(projectId: number) {
  return useQuery({
    queryKey: ["form", "list", projectId],
    queryFn: async () => (await getForms(projectId)).data,
    enabled: Number.isFinite(projectId),
  });
}
