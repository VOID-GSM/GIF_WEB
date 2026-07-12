"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { postInquiry } from "../api/inquiryApi";

export function usePostInquiry() {
  return useMutation({
    mutationFn: postInquiry,
    onSuccess: () => {
      toast.success("문의가 접수되었습니다.");
    },
    onError: () => {
      toast.error("문의 접수에 실패했습니다. 다시 시도해주세요.");
    },
  });
}
