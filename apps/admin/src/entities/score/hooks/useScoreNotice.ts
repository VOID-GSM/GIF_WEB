"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { postScoreNotice } from "../api";

export function useScoreNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postScoreNotice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["score", "notice"] });
      toast.success("점수가 공지되었습니다.");
    },
    onError: () => {
      toast.error("공지를 실패했습니다.");
    },
  });
}
