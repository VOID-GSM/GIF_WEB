"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { postScorePeriod } from "../api";

export function useSetScorePeriod() {
  return useMutation({
    mutationFn: postScorePeriod,
    onSuccess: () => {
      toast.success("평가 시작일이 설정되었습니다.");
    },
    onError: () => {
      toast.error("평가 시작일 설정에 실패했습니다. 잠시 후 다시 시도해주세요.");
    },
  });
}
