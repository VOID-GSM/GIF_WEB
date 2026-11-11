"use client";

import { useTranslations } from "next-intl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  ASSESSMENT_RANKING_QUERY_KEY,
  assessmentRoundQueryKey,
  type StartCatChaseRoundResponse,
} from "@/entities/assessment";
import { CURRENT_USER_QUERY_KEY } from "@/entities/user";

import {
  finishCatChaseRound,
  getCatChaseCurrentQuestion,
  getCatChaseRound,
  getCatChaseRounds,
  submitCatChaseJudgments,
} from "../api/catChaseApi";
import { DEFAULT_CAT_CHASE_BOARD_SIDE, toBoardSide } from "../model/constants";
import type {
  CatChaseSession,
  SubmitCatChaseJudgmentsRequest,
} from "../model/types";

// 랭킹(["assessment", ...]) 무효화에 진행 중인 검사 상태가 휩쓸리지 않도록 prefix 를 따로 둔다.
export const CAT_CHASE_QUERY_KEY = ["cat-chase"] as const;
const ROUNDS_QUERY_KEY = [...CAT_CHASE_QUERY_KEY, "rounds"] as const;

// 서버 기준으로 라운드 상태를 다시 맞춘다. 새로고침으로 다시 들어오거나 제출 응답을 못 받았을 때 쓴다.
export const fetchCatChaseSession = async (
  roundId: number,
): Promise<CatChaseSession> => {
  const detail = await getCatChaseRound(roundId);
  const base = {
    roundId,
    boardSide: DEFAULT_CAT_CHASE_BOARD_SIDE,
    questionCount: detail.questionCount,
  };

  if (detail.finishedAt) {
    return {
      ...base,
      question: null,
      result: {
        roundId,
        questionCount: detail.questionCount,
        answeredCount: detail.answeredCount,
        correctCount: detail.correctCount,
        completed: detail.completed,
        earnedCoin: detail.earnedCoin,
      },
    };
  }

  const question = await getCatChaseCurrentQuestion(roundId);
  return { ...base, question, result: null };
};

// 라운드 결과가 확정되면 기록·랭킹·코인 잔액을 다시 불러온다.
const useInvalidateRoundResult = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ROUNDS_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: ASSESSMENT_RANKING_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
  };
};

export function useGetCatChaseSession(roundId: number) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [...CAT_CHASE_QUERY_KEY, "session", roundId],
    queryFn: () => fetchCatChaseSession(roundId),
    // 역량검사 화면에서 막 시작한 라운드면 시작 응답(첫 문항)을 그대로 써서 다시 요청하지 않는다.
    initialData: (): CatChaseSession | undefined => {
      const started = queryClient.getQueryData<StartCatChaseRoundResponse>(
        assessmentRoundQueryKey("cat-chase", roundId),
      );
      if (!started) return undefined;
      return {
        roundId,
        boardSide: toBoardSide(started.gridSize),
        questionCount: started.questionCount,
        question: started.question,
        result: null,
      };
    },
    // 진행은 화면 상태로 하므로, 검사 도중 다시 불러와 문항이 바뀌지 않게 한다.
    staleTime: Infinity,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useSubmitCatChaseJudgments() {
  const invalidateRoundResult = useInvalidateRoundResult();

  return useMutation({
    mutationFn: ({
      roundId,
      questionId,
      body,
    }: {
      roundId: number;
      questionId: number;
      body: SubmitCatChaseJudgmentsRequest;
    }) => submitCatChaseJudgments(roundId, questionId, body),
    onSuccess: ({ result }) => {
      if (result) invalidateRoundResult();
    },
    // 실패하면 검사 화면이 서버 상태를 다시 확인해 이어갈지 정한다.
  });
}

// 제출 응답을 못 받았을 때 서버에 저장됐는지 확인한다.
export function useRecoverCatChaseSession() {
  const invalidateRoundResult = useInvalidateRoundResult();

  return useMutation({
    mutationFn: fetchCatChaseSession,
    // 마지막 문항이 저장돼 라운드가 끝나 있었다면 제출 성공과 똑같이 갱신한다.
    onSuccess: ({ result }) => {
      if (result) invalidateRoundResult();
    },
  });
}

export function useFinishCatChaseRound() {
  const t = useTranslations("catChase.toast");
  const invalidateRoundResult = useInvalidateRoundResult();

  return useMutation({
    mutationFn: finishCatChaseRound,
    onSuccess: invalidateRoundResult,
    onError: () => toast.error(t("finishError")),
  });
}

export function useGetCatChaseRounds() {
  return useQuery({
    queryKey: ROUNDS_QUERY_KEY,
    queryFn: getCatChaseRounds,
  });
}

export function useGetCatChaseRound(roundId: number) {
  return useQuery({
    queryKey: [...ROUNDS_QUERY_KEY, roundId],
    queryFn: () => getCatChaseRound(roundId),
  });
}
