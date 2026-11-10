"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { engagementQueryKeys } from "../model/queryKeys";
import type { ProjectEngagementFields } from "../model/types";
import { increaseProjectView } from "./engagementApi";

// 조회수 집계는 화면에 알리지 않는다 — 실패해도 조용히 넘긴다.
export function useIncreaseProjectView(projectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => increaseProjectView(projectId),
    onSuccess: ({ views }) => {
      queryClient.setQueryData<ProjectEngagementFields>(
        engagementQueryKeys.projectDetail(projectId),
        (old) => (old ? { ...old, viewCount: views } : old),
      );
    },
    onError: () => {},
  });
}
