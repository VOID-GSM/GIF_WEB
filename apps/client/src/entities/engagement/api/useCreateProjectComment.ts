"use client";

import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import { updateProjectInLists } from "../model/cache";
import { engagementQueryKeys } from "../model/queryKeys";
import type {
  CreateCommentRequest,
  ProjectEngagementFields,
} from "../model/types";
import { createProjectComment } from "./engagementApi";

const getErrorMessage = (
  error: unknown,
  messages: { rateLimit: string; fallback: string },
) => {
  if (
    isAxiosError<{ message?: string }>(error) &&
    error.response?.status === 429
  ) {
    return error.response.data?.message || messages.rateLimit;
  }
  return messages.fallback;
};

export function useCreateProjectComment(projectId: number) {
  const t = useTranslations("comment.toast");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateCommentRequest) =>
      createProjectComment(projectId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: engagementQueryKeys.comments(projectId),
      });
      queryClient.setQueriesData<ProjectEngagementFields>(
        { queryKey: engagementQueryKeys.projectDetail(projectId) },
        (old) => (old ? { ...old, commentCount: old.commentCount + 1 } : old),
      );
      updateProjectInLists(queryClient, projectId, (project) => ({
        ...project,
        commentCount: project.commentCount + 1,
      }));
      toast.success(t("created"));
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, {
          rateLimit: t("rateLimit"),
          fallback: t("createError"),
        }),
      );
    },
  });
}
