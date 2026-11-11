"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { projectStatsQueryKeys } from "@/entities/project-stats";

import { unhideComment } from "../api/commentApi";
import { commentMutationKeys, commentQueryKeys } from "../model/queryKeys";

export function useUnhideComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: commentMutationKeys.unhide,
    mutationFn: unhideComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentQueryKeys.all });
      // 숨김·삭제된 댓글은 댓글 수에서 빠지므로 통계도 다시 받는다.
      queryClient.invalidateQueries({ queryKey: projectStatsQueryKeys.all });
      toast.success("댓글 숨김을 해제했습니다.");
    },
    onError: () => {
      toast.error("댓글 숨김 해제에 실패했습니다.");
    },
  });
}
