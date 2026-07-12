"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateProjectNote } from "../api";

export function useUpdateProjectNote(projectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => updateProjectNote(projectId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project", "note", projectId],
      });
      toast.success("메모가 저장되었습니다.");
    },
    onError: () => toast.error("메모 저장에 실패했습니다."),
  });
}
