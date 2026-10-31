"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { toggleRetrospectiveBookmark } from "../api/retrospectiveApi";

export function useToggleBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleRetrospectiveBookmark,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["retrospective"] });
      queryClient.invalidateQueries({ queryKey: ["retrospective", id] });
    },
    onError: () => toast.error("북마크 변경에 실패했습니다."),
  });
}
