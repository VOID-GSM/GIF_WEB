"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteNotice } from "../api";
import { NOTICE_QUERY_KEY } from "./useGetNotices";

export function useDeleteNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noticeId: number) => deleteNotice(noticeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTICE_QUERY_KEY });
      toast.success("공지가 삭제되었습니다.");
    },
    onError: () => toast.error("공지 삭제에 실패했습니다."),
  });
}
