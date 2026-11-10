"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { hideComment } from "../api/commentApi";

export function useHideComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: hideComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-comments"] });
      // 숨김 댓글은 댓글 수에서 빠지므로 통계도 다시 받는다.
      queryClient.invalidateQueries({ queryKey: ["project-stats"] });
      toast.success("댓글을 숨겼습니다.");
    },
    onError: () => {
      toast.error("댓글 숨김에 실패했습니다.");
    },
  });
}
