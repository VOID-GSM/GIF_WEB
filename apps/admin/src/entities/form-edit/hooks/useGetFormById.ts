"use client";

import { useQuery } from "@tanstack/react-query";
import { getFormById } from "../api";

export function useGetFormById(formId: number) {
  return useQuery({
    queryKey: ["form", "by-id", formId] as const,
    queryFn: async () => {
      const { data } = await getFormById(formId);
      return data;
    },
    enabled: !!formId,
  });
}
