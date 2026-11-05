"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getAssessmentRanking } from "../api/assessmentApi";
import type { AssessmentType } from "../model/types";

export const ASSESSMENT_RANKING_QUERY_KEY = ["assessment", "ranking"] as const;

export function useGetAssessmentRanking(
  type: AssessmentType,
  questionCount: number,
  limit?: number,
) {
  return useQuery({
    queryKey: [...ASSESSMENT_RANKING_QUERY_KEY, type, questionCount, limit],
    queryFn: () => getAssessmentRanking(type, { questionCount, limit }),
    // 문항 수·탭을 바꾸는 동안 이전 랭킹을 유지해 스켈레톤 깜빡임을 막는다.
    placeholderData: keepPreviousData,
    // 검사를 마치고 돌아오면 전역 staleTime(60초)과 상관없이 새 기록을 불러온다.
    refetchOnMount: "always",
  });
}
