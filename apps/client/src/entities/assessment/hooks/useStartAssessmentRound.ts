"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { startAssessmentRound } from "../api/assessmentApi";
import type { AssessmentType } from "../model/types";

// 검사 페이지는 URL의 문자열 roundId로 읽으므로 키를 문자열로 맞춘다.
export const assessmentRoundQueryKey = (
  type: AssessmentType,
  roundId: number | string,
) => ["assessment", type, "round", String(roundId)] as const;

interface StartRoundVariables {
  type: AssessmentType;
  questionCount: number;
}

export function useStartAssessmentRound() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ type, questionCount }: StartRoundVariables) =>
      startAssessmentRound(type, { questionCount }),
    onSuccess: (round, { type }) => {
      // 검사 화면이 첫 문항을 다시 요청하지 않도록 시작 응답을 캐시에 넣어둔다.
      queryClient.setQueryData(assessmentRoundQueryKey(type, round.roundId), round);
    },
    onError: () => {
      toast.error("검사를 시작하지 못했어요. 잠시 후 다시 시도해주세요.");
    },
  });
}
