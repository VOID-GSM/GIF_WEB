"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import { engagementQueryKeys } from "../model/queryKeys";
import type {
  CreateCommentRequest,
  ProjectEngagementFields,
} from "../model/types";
import { createProjectComment } from "./engagementApi";

const RATE_LIMIT_MESSAGE =
  "댓글을 너무 자주 작성하고 있습니다. 잠시 후 다시 시도해주세요.";

const getErrorMessage = (error: unknown) => {
  if (
    isAxiosError<{ message?: string }>(error) &&
    error.response?.status === 429
  ) {
    return error.response.data?.message || RATE_LIMIT_MESSAGE;
  }
  return "댓글 등록에 실패했습니다.";
};

export function useCreateProjectComment(projectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateCommentRequest) =>
      createProjectComment(projectId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: engagementQueryKeys.comments(projectId),
      });
      queryClient.setQueryData<ProjectEngagementFields>(
        engagementQueryKeys.projectDetail(projectId),
        (old) => (old ? { ...old, commentCount: old.commentCount + 1 } : old),
      );
      queryClient.invalidateQueries({
        queryKey: engagementQueryKeys.projectFilter(),
      });
      toast.success("댓글이 등록되었습니다.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
