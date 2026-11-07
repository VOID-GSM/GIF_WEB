import { apiClient } from "@repo/lib";

import type {
  AssessmentRankingParams,
  AssessmentRankingResponse,
  AssessmentType,
  StartAssessmentRoundRequest,
  StartRoundResponseMap,
} from "../model/types";

export const getAssessmentRanking = async (
  type: AssessmentType,
  params: AssessmentRankingParams,
) => {
  const { data } = await apiClient.get<AssessmentRankingResponse>(
    `/api/assessment/${type}/ranking`,
    { params },
  );
  return data;
};

export const startAssessmentRound = async <T extends AssessmentType>(
  type: T,
  body: StartAssessmentRoundRequest,
) => {
  const { data } = await apiClient.post<StartRoundResponseMap[T]>(
    `/api/assessment/${type}/rounds`,
    body,
  );
  return data;
};
