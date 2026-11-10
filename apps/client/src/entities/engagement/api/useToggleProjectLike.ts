"use client";

import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateProjectInLists } from "../model/cache";
import { engagementQueryKeys } from "../model/queryKeys";
import type { ProjectEngagementFields } from "../model/types";
import { likeProject, unlikeProject } from "./engagementApi";

// 현재 좋아요 상태(isLiked)에 따라 POST(좋아요) / DELETE(취소)를 보낸다.
// detailFilter 는 교내용·공개 상세 캐시의 공통 prefix — 두 캐시를 함께 갱신·롤백한다.
export function useToggleProjectLike(projectId: number) {
  const t = useTranslations("like.toast");
  const queryClient = useQueryClient();
  const detailFilter = {
    queryKey: engagementQueryKeys.projectDetail(projectId),
  };

  return useMutation({
    mutationFn: (isLiked: boolean) =>
      isLiked ? unlikeProject(projectId) : likeProject(projectId),
    onMutate: async (isLiked) => {
      await queryClient.cancelQueries(detailFilter);
      const previous =
        queryClient.getQueriesData<ProjectEngagementFields>(detailFilter);

      queryClient.setQueriesData<ProjectEngagementFields>(
        detailFilter,
        (old) =>
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
      queryClient.setQueriesData<ProjectEngagementFields>(
        detailFilter,
        (old) => (old ? { ...old, isLiked: liked, likeCount: likes } : old),
      );
      updateProjectInLists(queryClient, projectId, (project) => ({
        ...project,
        isLiked: liked,
        likeCount: likes,
      }));
    },
    onError: (_error, _variables, context) => {
      context?.previous.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      toast.error(t("error"));
    },
  });
}
