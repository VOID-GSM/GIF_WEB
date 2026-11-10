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

export async function requestRetrospectiveAiAssist(
  action: RetrospectiveAiAction,
  payload: RetrospectiveAiRequest,
): Promise<RetrospectiveAiResult> {
  const { data } = await apiClient.post<RetrospectiveAiResult>(
    `/api/ai/retrospective/${action}`,
    { ...payload, category: categoryToServer[payload.category] },
  );
  return data;
}
