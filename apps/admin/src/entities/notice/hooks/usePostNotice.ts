"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { postNotice } from "../api";
import { NOTICE_QUERY_KEY } from "./useGetNotices";

export function usePostNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postNotice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTICE_QUERY_KEY });
      toast.success("공지가 등록되었습니다.");
    },
    onError: () => toast.error("공지 등록에 실패했습니다. 다시 시도해주세요."),
  });
}
