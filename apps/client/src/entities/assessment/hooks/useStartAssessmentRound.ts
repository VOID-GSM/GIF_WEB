"use client";

import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { startAssessmentRound } from "../api/assessmentApi";
import type { AssessmentType } from "../model/types";

// 검사 페이지는 URL의 문자열 roundId로 읽으므로 키를 문자열로 맞춘다.
// 랭킹(["assessment", ...]) 무효화에 휩쓸리지 않도록 prefix 를 분리한다.
export const assessmentRoundQueryKey = (
  type: AssessmentType,
  roundId: number | string,
) => ["assessment-round", type, String(roundId)] as const;

interface StartRoundVariables {
  type: AssessmentType;
  questionCount: number;
}

export function useStartAssessmentRound() {
  const t = useTranslations("assessment.toast");
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ type, questionCount }: StartRoundVariables) =>
      startAssessmentRound(type, { questionCount }),
    onSuccess: (round, { type }) => {
      // 검사 화면이 첫 문항을 다시 요청하지 않도록 시작 응답을 캐시에 넣어둔다.
      queryClient.setQueryData(assessmentRoundQueryKey(type, round.roundId), round);
    },
    onError: () => {
      toast.error(t("startError"));
    },
  });
}
