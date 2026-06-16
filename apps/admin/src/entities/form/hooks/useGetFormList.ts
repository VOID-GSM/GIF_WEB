"use client";

import { useQuery } from "@tanstack/react-query";

import { getFormList } from "../api";

export const FORM_QUERY_KEY = ["form", "list"] as const;

export function useGetFormList() {
  return useQuery({
    queryKey: FORM_QUERY_KEY,
    queryFn: async () => {
      const { data } = await getFormList();
      return data;
    },
  });
}
