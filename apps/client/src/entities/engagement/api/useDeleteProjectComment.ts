"use client";

import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import { updateProjectInLists } from "../model/cache";
import { engagementQueryKeys } from "../model/queryKeys";
import type { ProjectEngagementFields } from "../model/types";
import { deleteProjectComment } from "./engagementApi";

const isForbidden = (error: unknown) =>
  isAxiosError(error) && error.response?.status === 403;

export function useDeleteProjectComment(projectId: number) {
  const t = useTranslations("comment.toast");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) =>
      deleteProjectComment(projectId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: engagementQueryKeys.comments(projectId),
      });
      queryClient.setQueriesData<ProjectEngagementFields>(
        { queryKey: engagementQueryKeys.projectDetail(projectId) },
        (old) =>
          old
            ? { ...old, commentCount: Math.max(0, old.commentCount - 1) }
            : old,
      );
      updateProjectInLists(queryClient, projectId, (project) => ({
        ...project,
        commentCount: Math.max(0, project.commentCount - 1),
      }));
      toast.success(t("deleted"));
    },
    onError: (error) => {
      toast.error(isForbidden(error) ? t("deleteForbidden") : t("deleteError"));
    },
  });
}
