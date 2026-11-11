import { apiClient } from "@repo/lib";

import type { RetrospectiveCategory } from "../model/type";

export type RetrospectiveAiAction = "polish" | "structure" | "portfolio";

export interface RetrospectiveAiRequest {
  title?: string;
  category: RetrospectiveCategory;
  content: string;
}

export interface RetrospectiveAiResult {
  content: string;
  sections?: string[];
}

const categoryToServer = {
  FEATURE: "FEATURE_DEV",
  IMPROVEMENT: "FEATURE_IMPROVEMENT",
  REFACTORING: "REFACTORING",
  TROUBLESHOOTING: "TROUBLESHOOTING",
  RETROSPECT: "RETROSPECTIVE",
  PORTFOLIO: "PORTFOLIO",
} satisfies Record<RetrospectiveCategory, string>;

// 공용 apiClient의 10초 제한으로는 AI 생성이 자주 끊긴다.
// 서버의 AI 생성 응답 제한(90초)보다 조금 길게 잡아, 서버가 처리 중인 요청을 먼저 끊지 않는다.
const AI_REQUEST_TIMEOUT_MS = 100_000;

export async function requestRetrospectiveAiAssist(
  action: RetrospectiveAiAction,
  payload: RetrospectiveAiRequest,
): Promise<RetrospectiveAiResult> {
  const { data } = await apiClient.post<RetrospectiveAiResult>(
    `/api/ai/retrospective/${action}`,
    { ...payload, category: categoryToServer[payload.category] },
    { timeout: AI_REQUEST_TIMEOUT_MS },
  );
  return data;
}
