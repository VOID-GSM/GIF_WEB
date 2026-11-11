"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import { CURRENT_USER_QUERY_KEY } from "@/entities/user";

import { startAssessmentRound } from "../api/assessmentApi";
import {
  finishRoadMakingRound,
  getCurrentRoadMakingProblem,
  submitRoadMakingAnswer,
} from "../api/roadMakingApi";
import { DEFAULT_QUESTION_COUNT } from "../model/constants";
import type { BoardPosition, RoadMakingRoundResult } from "../model/types";
import { ASSESSMENT_RANKING_QUERY_KEY } from "./useGetAssessmentRanking";
import { assessmentRoundQueryKey } from "./useStartAssessmentRound";

// 이미 끝난 라운드를 열었을 때, 새 라운드를 만드는 대신 그 라운드의 결과를 들고 온다.
export class RoadMakingRoundEndedError extends Error {
  constructor(public readonly result: RoadMakingRoundResult) {
    super("이미 끝난 길 만들기 라운드입니다.");
  }
}

// 새로고침 등으로 캐시가 비었을 때 roundId 로 라운드를 되살린다.
// 시작 API 는 진행 중인 라운드가 없으면 새로 만들어 버리므로, 먼저 이 라운드가 진행 중인지 확인한다.
const restoreRound = async (roundId: number) => {
  try {
    await getCurrentRoadMakingProblem(roundId);
  } catch (error) {
    // 409: 이미 끝났거나 시간이 지난 라운드. 끝난 라운드에 finish 를 부르면 결과만 돌려준다.
    if (isAxiosError(error) && error.response?.status === 409) {
      throw new RoadMakingRoundEndedError(await finishRoadMakingRound(roundId));
    }
    throw error;
  }
  // 진행 중인 라운드가 있으면 시작 API 는 그 라운드와 남은 시간을 돌려준다.
  return startAssessmentRound("road-making", {
    questionCount: DEFAULT_QUESTION_COUNT,
  });
};

// 시작 화면에서 넣어둔 캐시를 그대로 쓰고, 캐시가 없을 때만 서버에서 되살린다.
export function useRoadMakingRound(roundId: string) {
  return useQuery({
    queryKey: assessmentRoundQueryKey("road-making", roundId),
    queryFn: () => restoreRound(Number(roundId)),
    enabled: !!roundId,
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

// 라운드가 끝나면 랭킹과 코인 잔액이 바뀐다.
const invalidateAfterRound = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ASSESSMENT_RANKING_QUERY_KEY });
  queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
};

interface SubmitVariables {
  roundId: number;
  problemId: number;
  fences: BoardPosition[];
}

export function useSubmitRoadMakingAnswer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roundId, problemId, fences }: SubmitVariables) =>
      submitRoadMakingAnswer(roundId, problemId, { fences }),
    onSuccess: (res) => {
      if (res.result) invalidateAfterRound(queryClient);
    },
    onError: (error) => {
      // 409(이미 답한 문항·끝난 라운드)는 화면이 서버 상태를 다시 맞춘다.
      if (isAxiosError(error) && error.response?.status === 409) return;
      toast.error("답안을 제출하지 못했어요. 다시 시도해주세요.");
    },
  });
}

// 화면 상태가 서버와 어긋났을 때(다른 탭에서 답했거나 새로고침 등) 지금 풀 문항을 다시 받는다.
export function useRecoverRoadMakingProblem() {
  return useMutation({
    mutationFn: (roundId: number) => getCurrentRoadMakingProblem(roundId),
  });
}

export function useFinishRoadMakingRound() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roundId: number) => finishRoadMakingRound(roundId),
    onSuccess: () => invalidateAfterRound(queryClient),
    onError: () => {
      toast.error("검사를 종료하지 못했어요. 잠시 후 다시 시도해주세요.");
    },
  });
}
