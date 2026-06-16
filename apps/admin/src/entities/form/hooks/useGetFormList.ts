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
    // 최신 양식(id가 큰 순)이 위로, 오래된 양식이 아래로 정렬
    select: (data) => [...data].sort((a, b) => b.id - a.id),
  });
}
