"use client";

import { useQuery } from "@tanstack/react-query";

import { getForms } from "./formApi";

export function useGetForms(projectId: number) {
  return useQuery({
    queryKey: ["form", "list", projectId],
    queryFn: () => getForms(projectId),
    enabled: Number.isFinite(projectId),
  });
}
