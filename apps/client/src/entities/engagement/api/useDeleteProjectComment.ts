"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import { updateProjectInLists } from "../model/cache";
import { engagementQueryKeys } from "../model/queryKeys";
import type { ProjectEngagementFields } from "../model/types";
import { deleteProjectComment } from "./engagementApi";

const getErrorMessage = (error: unknown) =>
  isAxiosError(error) && error.response?.status === 403
    ? "본인 댓글만 삭제할 수 있습니다."
    : "댓글 삭제에 실패했습니다.";

export function useDeleteProjectComment(projectId: number) {
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
      toast.success("댓글이 삭제되었습니다.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
