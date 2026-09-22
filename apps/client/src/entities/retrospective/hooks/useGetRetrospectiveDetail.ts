"use client";

import { useQuery } from "@tanstack/react-query";

import { getRetrospectiveDetail } from "../api/retrospectiveApi";

export function useGetRetrospectiveDetail(id: number | undefined) {
  return useQuery({
    queryKey: ["retrospective", id],
    queryFn: () => getRetrospectiveDetail(id as number),
    enabled: Number.isFinite(id),
  });
}
