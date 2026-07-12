"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { transferLeader } from "../api";

export function useTransferLeader(projectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newLeaderUserId: number) =>
      transferLeader(projectId, newLeaderUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project", "detail", projectId],
      });
      toast.success("팀장이 양도되었습니다.");
    },
    onError: () => toast.error("팀장 양도에 실패했습니다."),
  });
}
