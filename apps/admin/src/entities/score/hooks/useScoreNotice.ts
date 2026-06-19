"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { postScoreNotice } from "../api";
import { setCookieValue } from "@repo/lib";

export function useScoreNotice() {
  return useMutation({
    mutationFn: postScoreNotice,
    onSuccess: () => {
      setCookieValue("rank_announced", "1", {
        path: "/",
        maxAge: 60 * 60 * 24,
      });
      toast.success("점수가 공지되었습니다.");
    },
    onError: () => {
      toast.error("공지를 실패했습니다.");
    },
  });
}
