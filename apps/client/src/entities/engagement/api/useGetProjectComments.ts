"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { engagementQueryKeys } from "../model/queryKeys";
import { getProjectComments } from "./engagementApi";

export function useGetProjectComments(projectId: number) {
  return useInfiniteQuery({
    queryKey: engagementQueryKeys.comments(projectId),
    queryFn: ({ pageParam }) => getProjectComments(projectId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.hasNext ? lastPageParam + 1 : undefined,
    enabled: Number.isFinite(projectId),
  });
}
