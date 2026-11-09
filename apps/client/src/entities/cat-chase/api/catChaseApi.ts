import { apiClient } from "@repo/lib";

import type { CatChaseQuestion } from "@/entities/assessment";

import type {
  CatChaseRoundDetail,
  CatChaseRoundResult,
  CatChaseRoundSummary,
  SubmitCatChaseJudgmentsRequest,
  SubmitCatChaseJudgmentsResponse,
} from "../model/types";

// 라운드 시작은 entities/assessment 의 startAssessmentRound 를 쓴다.
const BASE_URL = "/api/assessment/cat-chase/rounds";

export const getCatChaseCurrentQuestion = async (roundId: number) => {
  const { data } = await apiClient.get<CatChaseQuestion>(
    `${BASE_URL}/${roundId}/questions/current`,
  );
  return data;
};

export const submitCatChaseJudgments = async (
  roundId: number,
  questionId: number,
  body: SubmitCatChaseJudgmentsRequest,
) => {
  const { data } = await apiClient.post<SubmitCatChaseJudgmentsResponse>(
    `${BASE_URL}/${roundId}/questions/${questionId}/judgments`,
    body,
  );
  return data;
};

// 끝까지 풀기 전에 호출하면 중단으로 처리되고 코인을 받지 않는다.
export const finishCatChaseRound = async (roundId: number) => {
  const { data } = await apiClient.post<CatChaseRoundResult>(
    `${BASE_URL}/${roundId}/finish`,
  );
  return data;
};

export const getCatChaseRounds = async () => {
  const { data } = await apiClient.get<CatChaseRoundSummary[]>(BASE_URL);
  return data;
};

export const getCatChaseRound = async (roundId: number) => {
  const { data } = await apiClient.get<CatChaseRoundDetail>(
    `${BASE_URL}/${roundId}`,
  );
  return { ...data, questions: data.questions ?? [] };
};
