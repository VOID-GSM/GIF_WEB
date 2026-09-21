"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteDraftRetrospective } from "../api/retrospectiveApi";

export function useDeleteDraftRetrospective() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDraftRetrospective,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["retrospective", "draft"] });
      toast.success("임시 저장 글을 삭제했습니다.");
    },
    onError: () => toast.error("임시 저장 글 삭제에 실패했습니다."),
  });
}
