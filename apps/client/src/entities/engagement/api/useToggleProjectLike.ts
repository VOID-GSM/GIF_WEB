"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateProjectInLists } from "../model/cache";
import { engagementQueryKeys } from "../model/queryKeys";
import type { ProjectEngagementFields } from "../model/types";
import { likeProject, unlikeProject } from "./engagementApi";

// 현재 좋아요 상태(isLiked)에 따라 POST(좋아요) / DELETE(취소)를 보낸다.
export function useToggleProjectLike(projectId: number) {
  const queryClient = useQueryClient();
  const detailKey = engagementQueryKeys.projectDetail(projectId);

  return useMutation({
    mutationFn: (isLiked: boolean) =>
      isLiked ? unlikeProject(projectId) : likeProject(projectId),
    onMutate: async (isLiked) => {
      await queryClient.cancelQueries({ queryKey: detailKey });
      const previous =
        queryClient.getQueryData<ProjectEngagementFields>(detailKey);

      queryClient.setQueryData<ProjectEngagementFields>(detailKey, (old) =>
        old
          ? {
              ...old,
              isLiked: !isLiked,
              likeCount: Math.max(0, old.likeCount + (isLiked ? -1 : 1)),
            }
          : old,
      );

      return { previous };
    },
    onSuccess: ({ liked, likes }) => {
      queryClient.setQueryData<ProjectEngagementFields>(detailKey, (old) =>
        old ? { ...old, isLiked: liked, likeCount: likes } : old,
      );
      updateProjectInLists(queryClient, projectId, (project) => ({
        ...project,
        isLiked: liked,
        likeCount: likes,
      }));
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(detailKey, context.previous);
      }
      toast.error("좋아요 처리에 실패했습니다.");
    },
  });
}
