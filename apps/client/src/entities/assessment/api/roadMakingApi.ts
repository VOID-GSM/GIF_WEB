import { apiClient } from "@repo/lib";

import type {
  RoadMakingProblem,
  RoadMakingRoundResult,
  SubmitRoadMakingAnswerRequest,
  SubmitRoadMakingAnswerResponse,
} from "../model/types";

const BASE = "/api/assessment/road-making/rounds";

export const getCurrentRoadMakingProblem = async (roundId: number) => {
  const { data } = await apiClient.get<RoadMakingProblem>(
    `${BASE}/${roundId}/problems/current`,
  );
  return data;
};

export const submitRoadMakingAnswer = async (
  roundId: number,
  problemId: number,
  body: SubmitRoadMakingAnswerRequest,
) => {
  const { data } = await apiClient.post<SubmitRoadMakingAnswerResponse>(
    `${BASE}/${roundId}/problems/${problemId}/submit`,
    body,
  );
  return data;
};

// 진행 중인 라운드를 시간 전에 닫으면 이탈로 처리된다(코인 0). 이미 끝난 라운드는 결과만 돌려준다.
export const finishRoadMakingRound = async (roundId: number) => {
  const { data } = await apiClient.post<RoadMakingRoundResult>(
    `${BASE}/${roundId}/finish`,
  );
  return data;
};
