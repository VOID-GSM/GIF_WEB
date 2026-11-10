"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { engagementQueryKeys } from "../model/queryKeys";
import type { ProjectEngagementFields } from "../model/types";
import { toggleProjectLike } from "./engagementApi";

export function useToggleProjectLike(projectId: number) {
  const queryClient = useQueryClient();
  const detailKey = engagementQueryKeys.projectDetail(projectId);

  return useMutation({
    mutationFn: () => toggleProjectLike(projectId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: detailKey });
      const previous =
        queryClient.getQueryData<ProjectEngagementFields>(detailKey);

      queryClient.setQueryData<ProjectEngagementFields>(detailKey, (old) =>
        old
          ? {
              ...old,
              isLiked: !old.isLiked,
              likeCount: Math.max(0, old.likeCount + (old.isLiked ? -1 : 1)),
            }
          : old,
      );

      return { previous };
    },
    onSuccess: ({ liked, likes }) => {
      queryClient.setQueryData<ProjectEngagementFields>(detailKey, (old) =>
        old ? { ...old, isLiked: liked, likeCount: likes } : old,
      );
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(detailKey, context.previous);
      }
      toast.error("좋아요 처리에 실패했습니다.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: engagementQueryKeys.projectFilter(),
      });
    },
  });
}
