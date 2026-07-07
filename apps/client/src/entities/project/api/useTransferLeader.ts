"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { transferLeader } from "./projectApi";

export function useTransferLeader(projectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newLeaderUserId: number) =>
      transferLeader(projectId, newLeaderUserId),
    onSuccess: () => {
      // 멤버 role 이 바뀌므로 상세·내 프로젝트·목록 캐시를 갱신한다.
      queryClient.invalidateQueries({
        queryKey: ["project", "detail", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["project", "me"] });
      queryClient.invalidateQueries({ queryKey: ["project", "filter"] });
      // 마이페이지 역할(clientRole)은 auth/me 에서 오므로 함께 갱신한다.
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      toast.success("팀장이 양도되었습니다.");
    },
    onError: () => {
      toast.error("팀장 양도에 실패했습니다.");
    },
  });
}
