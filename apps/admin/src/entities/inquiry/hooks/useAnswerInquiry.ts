"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { answerInquiry } from "../api/inquiryApi";
import type { AnswerInquiryRequest } from "../model/type";

interface AnswerInquiryVariables {
  inquiryId: number;
  body: AnswerInquiryRequest;
}

export function useAnswerInquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ inquiryId, body }: AnswerInquiryVariables) =>
      answerInquiry(inquiryId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiry", "admin"] });
      toast.success("답변이 등록되었습니다.");
    },
    onError: () => {
      toast.error("답변 등록에 실패했습니다. 다시 시도해주세요.");
    },
  });
}
