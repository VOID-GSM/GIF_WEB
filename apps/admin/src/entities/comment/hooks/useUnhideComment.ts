"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { unhideComment } from "../api/commentApi";

export function useUnhideComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unhideComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-comments"] });
      queryClient.invalidateQueries({ queryKey: ["project-stats"] });
      toast.success("댓글 숨김을 해제했습니다.");
    },
    onError: () => {
      toast.error("댓글 숨김 해제에 실패했습니다.");
    },
  });
}
