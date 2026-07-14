"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateInquiry } from "../api/inquiryApi";

export function useUpdateInquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateInquiry,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["inquiry", "my", variables.inquiryId],
      });
      queryClient.invalidateQueries({ queryKey: ["inquiry", "my"] });
      toast.success("문의가 수정되었습니다.");
    },
    onError: () => {
      toast.error("문의 수정에 실패했습니다. 다시 시도해주세요.");
    },
  });
}
