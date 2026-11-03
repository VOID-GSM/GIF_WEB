// TODO(backend): AI 요약 API(예: POST /api/retrospective/{id}/ai-summary)가 생기면
// 이 훅의 내부 구현만 TanStack Query 훅으로 교체한다 (컴포넌트 사용부는 변경 불필요).
"use client";

import { useMemo } from "react";

import { summarizeContent } from "../lib/summarizeContent";
import { useMockLoading } from "./useMockLoading";

export function useGetAiSummary(content: string | undefined) {
  // 실제 AI 응답을 기다리는 느낌을 흉내 내기 위해 조금 더 긴 지연을 준다
  const isLoading = useMockLoading(700);

  const data = useMemo(() => {
    if (!content?.trim()) return [];
    return summarizeContent(content);
  }, [content]);

  return { data, isLoading };
}
