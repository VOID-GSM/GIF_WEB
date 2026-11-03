"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteRetrospective } from "../api/retrospectiveApi";

export function useDeleteRetrospective() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRetrospective,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["retrospective"] });
      toast.success("회고록을 삭제했습니다.");
    },
    onError: () => toast.error("회고록 삭제에 실패했습니다."),
  });
}
